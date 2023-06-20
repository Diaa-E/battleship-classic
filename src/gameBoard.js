"use strict";

import { Ship } from "./ship";
export { GameBoard, emptyBoard }

function GameBoard(shipList, boardSize)
{
    
}

function emptyBoard(boardSize, emptyPin)
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