"use strict";

import { Player, Ai } from "./player";
import { pickGameMode } from "./rules";
import { dispatchCustomEvent } from "./uiUtility";

export function Game()
{
    let pinBox = PinBox("E", "M", "H", "S");
    let rules;
    let aiTurn = true //pickRandomTurn() === 0 ? false : true;
    let gameOver = false;
    let winner = undefined;
    let players;
    const REFRESH_INTERVAL_MS = 500;

    switchTurn();

    function init(playerName, gameModeNumber)
    {
        rules = pickGameMode(gameModeNumber);
        players = {
            human: Player(playerName, rules, pinBox),
            ai: Ai(rules, pinBox)
        };
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
                dispatchCustomEvent("playerBoardChanged", {}, document, true);

            }, REFRESH_INTERVAL_MS * i);
        }

        setTimeout(switchTurn, REFRESH_INTERVAL_MS * attacks.length - 1)

        if (players.human.fleetDestroyed())
        {
            gameOver = true;
            winner = players.ai.NAME;
        }
    }

    function humanPlay(attacks)
    {
        players.human.addShotsFired(attacks.length);

        for (let i = 0; i < attacks.length; i++)
        {
            setTimeout(() => {

                players.ai.receiveAttack(attacks[i]);
                dispatchCustomEvent("aiBoardChanged", {}, document, true);

            }, REFRESH_INTERVAL_MS * i);
        }

        setTimeout(switchTurn, REFRESH_INTERVAL_MS * attacks.length - 1)

        if (players.ai.fleetDestroyed())
        {
            gameOver = true;
            winner = players.human.NAME;
        }
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
        get rules(){ return rules },
        get players(){ return players },

        switchTurn,
        aiPlay,
        humanPlay,
        getTotalShots,
        movePlayerShip,
        rotatePlayerShip,
        init
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