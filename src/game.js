"use strict";

import { Player } from "./player";
import { pickGameMode } from "./rules";

export function Game(playerName, gameModeNumber)
{
    let pinBox = PinBox("E", "M", "H", "S");
    const rules = pickGameMode(gameModeNumber);
    let aiTurn = pickRandomTurn() === 0 ? false : true;
    let gameOver = false;
    let winner = undefined;
    const players ={
        human: Player(playerName, false, rules, pinBox),
        ai: Player("Player2", true, rules, pinBox)
    };
    
    function switchTurn()
    {
        aiTurn = !aiTurn;
    }

    function aiPlay()
    {
        const attacks = players.ai.aiBrain.getNextAttack(players.human.board, pinBox, players.human.fleet, players.ai.getAvailableShots());

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

    return {
        get aiTurn(){ return aiTurn },
        get gameOver(){ return gameOver },
        get aiBoard(){ return players.ai.board},
        get humanBoard(){ return players.human.board },
        get humanAvailableShots(){ return players.human.getAvailableShots() },
        get pinBox(){ return pinBox },
        get winner(){ return winner },

        switchTurn,
        aiPlay,
        humanPlay,
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