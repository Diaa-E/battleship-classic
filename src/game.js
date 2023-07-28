"use strict";

import { Player, Ai } from "./player";
import { pickGameMode } from "./rules";

export function Game(playerName, gameModeNumber)
{
    let pinBox = PinBox("E", "M", "H", "S");
    const rules = pickGameMode(gameModeNumber);
    let aiTurn = pickRandomTurn() === 0 ? false : true;
    let gameOver = false;
    let winner = undefined;
    const players ={
        human: Player(playerName, rules, pinBox),
        ai: Ai(rules, pinBox)
    };
    
    function switchTurn()
    {
        aiTurn = !aiTurn;
    }

    function aiPlay()
    {
        const attacks = players.ai.aiBrain.getNextAttack(players.human.board, pinBox, players.human.fleet, players.ai.getAvailableShots());
        players.ai.addShotsFired(attacks.length);

        attacks.forEach(attack => {

            players.human.receiveAttack(attack);
        });

        switchTurn();

        if (players.human.fleetDestroyed())
        {
            gameOver = true;
            winner = players.ai.NAME;
        }
    }

    function humanPlay(attacks)
    {
        players.human.addShotsFired(attacks.length);

        attacks.forEach(attack => {

            players.ai.receiveAttack(attack);
        });

        switchTurn();

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

        switchTurn,
        aiPlay,
        humanPlay,
        getTotalShots,
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