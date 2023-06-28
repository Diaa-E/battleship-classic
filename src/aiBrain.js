"use strict";

import { encodeCoord } from "./positionUtility";

export {AiBrain, sortBoard, checkerEmptySquares};

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

function checkerEmptySquares(board, emptyPin, skipTopLeft = Boolean(Math.round(Math.random())))
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