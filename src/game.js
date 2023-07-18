"use strict";

import { Player } from "./player";
import { pickGameMode } from "./rules";

export function Game(playerName, gameModeNumber)
{
    let pinBox = PinBox("E", "M", "H", "S");
    const rules = pickGameMode(gameModeNumber);
    let aiTurn = pickRandomTurn === 0 ? false : true;
    let gameOver = false;
    const players = [
        Player(playerName, false, rules, pinBox),
        Player("Player2", true, rules, pinBox)
    ]
    
    function switchTurn()
    {
        aiTurn = !aiTurn;
    }

    function aiPlay()
    {
        const attacks = players[1].aiBrain.getNextAttack(players[0].board, pinBox, players[0].fleet, players[1].getAvailableShots());
        
        attacks.forEach(attack => {
            players[0].receiveAttack(attack);
        });
        switchTurn();
    }

    function playerPlay()
    {

    }

    return {
        get aiTurn(){ return aiTurn },
        get gameOver(){ return gameOver },

        switchTurn,
        aiPlay,
        playerPlay,
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