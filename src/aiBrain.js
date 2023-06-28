"use strict";

import { encodeCoord } from "./positionUtility";

export {AiBrain, checkerEmptySquares, scrapeDamagedSquares};

function AiBrain(rules)
{
    return {

    }
}

function checkerEmptySquares(board, emptyPin, skipTopLeft)
{
    const checkeredBoard = [];
    let skipFirst = skipTopLeft;

    for (let x = 0; x < board.length; x++)
    {
        for (let y = skipFirst? 1 : 0; y < board.length; y += 2)
        {
            if (board[y][x] === emptyPin) checkeredBoard.push(encodeCoord([x, y]));
        }
        skipFirst = !skipFirst;
    }

    return checkeredBoard;
}

function scrapeDamagedSquares(board, damagedPin)
{
    const damaged = []

    for (let x = 0; x < board.length; x++)
    {
        for (let y = 0; y < board.length; y++)
        {
            if (board[y][x] === damagedPin) damaged.push(encodeCoord([x, y]));
        }
    }

    return damaged;
}