"use strict";

import { Player, Ai } from "./player";
import { decodeCoord } from "./positionUtility";
import { pickGameMode } from "./rules";
import { dispatchCustomEvent } from "./uiUtility";

export function Game()
{
    let pinBox = PinBox("E", "M", "H", "S");
    let rules;
    let aiTurn = pickRandomTurn() === 0 ? false : true;
    let gameOver = false;
    let winner = undefined;
    let players;
    let logging = false;
    let animation_speed_ms = 500;
    let log = [];

    function init(playerName, gameModeNumber)
    {
        rules = pickGameMode(gameModeNumber);
        players = {
            human: Player(playerName, rules, pinBox),
            ai: Ai(rules, pinBox)
        };
    }

    function setAnimationSpeed(newSpeedMs)
    {
        animation_speed_ms = +newSpeedMs;
    }

    function debug_setLogging(enableLogging)
    {
        logging = enableLogging;
        players.ai.debug_setLogging(enableLogging);
    }

    function debug_appendLogEntry(newEntry)
    {
        log.push(newEntry);
    }
    
    function switchTurn()
    {
        aiTurn = !aiTurn;

        dispatchCustomEvent("turnSwitched", {aiTurn: aiTurn}, document, true);
    }

    function aiPlay()
    {
        const attacks = players.ai.aiBrain.getNextAttack(players.human.board, pinBox, players.human.fleet, players.ai.getAvailableShots());
        players.ai.addShotsFired(attacks.length);

        for (let i = 0; i < attacks.length; i++)
        {
            setTimeout(() => {
                
                players.human.receiveAttack(attacks[i]);
                dispatchCustomEvent("playerBoardChanged", {encodedAttackCoord: attacks[i]}, document, true);

            }, animation_speed_ms * i);
        }

        if (logging) debug_appendLogEntry(players.ai.log);

        setTimeout(switchTurn, animation_speed_ms * attacks.length - 1);
    }

    function humanPlay(attacks)
    {
        players.human.addShotsFired(attacks.length);

        for (let i = 0; i < attacks.length; i++)
        {
            setTimeout(() => {

                players.ai.receiveAttack(attacks[i]);
                dispatchCustomEvent("aiBoardChanged", {encodedAttackCoord: attacks[i]}, document, true);

            }, animation_speed_ms * i);
        }

        setTimeout(switchTurn, animation_speed_ms * attacks.length - 1);
    }

    function getTotalShots()
    {
        return {
            ai: players.ai.totalShots,
            human: players.human.totalShots,
        }
    }

    function movePlayerShip(encodedCoord, encodedNewPivot)
    {
        players.human.moveShip(encodedCoord, encodedNewPivot);
    }

    function rotatePlayerShip(encodedCoord)
    {
        players.human.rotateShip(encodedCoord);
    }

    function checkGameOver()
    {
        if (players.ai.fleetDestroyed())
        {
            dispatchCustomEvent(
                "gameOver",
                {
                    winner: players.human.NAME,
                    loser: players.ai.NAME,
                    winnerShots: getTotalShots().human,
                    loserShots: getTotalShots().ai,
                    winnerShips: players.human.getRemainingShips(),
                },
                document,
                true
            );
            return true;
        }
        else if (players.human.fleetDestroyed())
        {
            dispatchCustomEvent(
                "gameOver",
                {
                    winner: players.ai.NAME,
                    loser: players.human.NAME,
                    winnerShots: getTotalShots().ai,
                    loserShots: getTotalShots().human,
                    winnerShips: players.ai.getRemainingShips(),
                },
                document,
                true
            );
            return true;
        }
    }

    return {
        get aiTurn(){ return aiTurn },
        get gameOver(){ return gameOver },
        get aiBoard(){ return players.ai.board},
        get humanBoard(){ return players.human.board },
        get humanAvailableShots(){ return players.human.getAvailableShots() },
        get pinBox(){ return pinBox },
        get winner(){ return winner },
        get aiName(){ return players.ai.NAME },
        get humanName(){ return players.human.NAME },
        get BOARD_SIZE(){ return rules.BOARD_SIZE },
        get humanFleet(){ return players.human.fleet },
        get aiFleet(){ return players.ai.fleet },
        get rules(){ return rules },
        get players(){ return players },
        get log(){ return log }, 

        switchTurn,
        aiPlay,
        humanPlay,
        getTotalShots,
        movePlayerShip,
        rotatePlayerShip,
        init,
        checkGameOver,
        debug_setLogging,
        setAnimationSpeed,
    };
}

function pickRandomTurn()
{
    return Math.round(Math.random());
}

function PinBox(emptyPin, missedPin, hitPin, sunkPin)
{
    return {
        empty: emptyPin,
        missed: missedPin,
        hit: hitPin,
        sunk: sunkPin,
    };
}