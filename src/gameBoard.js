"use strict";

import { Ship } from "./ship";
export { GameBoard, EmptyBoard, pinBox }

function GameBoard(shipList, boardSize)
{
    
}

function EmptyBoard(boardSize, emptyPin)
{
    const board = []

    for (let y = 0; y < boardSize; y++)
    {
        const row = [];

        for (let x = 0; x < boardSize; x++)
        {
            row.push(emptyPin);
        }

        board.push(row);
    }

    return board;
}

function pinBox(emptyPin, missedPin, hitPin)
{
    return {
        empty: emptyPin,
        missed: missedPin,
        hit: hitPin
    };
}