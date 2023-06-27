"use strict";

import { encodeCoord } from "./positionUtility";

export {AiBrain, sortBoard};

function AiBrain(rules)
{
    let boardStatus = {};

    return {

    }
}

function sortBoard(board, emptyPin, damagedPin)
{
    const availableSquares = [];
    const damagedSquares = [];

    for (let x = 0; x < board.length; x++)
    {
        for (let y = 0; y < board.length; y ++)
        {
            if (board[y][x] === emptyPin)
            {
                availableSquares.push(encodeCoord([x, y]));
            }
            else if (board[y][x] === damagedPin)
            {
                damagedSquares.push(encodeCoord([x, y]));
            }
        }
    }

    return {
        availableSquares: availableSquares,
        damagedSquares: damagedSquares,
    }
}