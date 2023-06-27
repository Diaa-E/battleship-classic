"use strict";

import { Player } from "./player";
import { pickGameMode } from "./rules";

export function Game(playerName, gameModeNumber)
{
    const rules = pickGameMode(gameModeNumber);
    let aiTurn = pickRandomTurn === 0 ? false : true;
    const players = [
        Player(playerName, false, rules),
        Player("Player2", true, rules)
    ]
    
    function switchTurn()
    {
        aiTurn = !aiTurn;
    }

    return {
        get aiTurn(){ return aiTurn },

        switchTurn,
    };
}

function pickRandomTurn()
{
    return Math.round(Math.random());
}