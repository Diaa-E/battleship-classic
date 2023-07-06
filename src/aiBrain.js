"use strict";

import { encodeCoord } from "./positionUtility";

export {AiBrain, checkerEmptySquares, scrapeDamagedSquares, bustBlocks, createWeightedBoard, bustRows, bustColumns};

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

function bustBlocks(blockLength, board, maxWeight, damagedPin, missedPin)
{
    let weightedBoard = createWeightedBoard(maxWeight, board, damagedPin, missedPin);

    weightedBoard = bustRows(blockLength, weightedBoard, maxWeight);
    weightedBoard = bustColumns(blockLength, weightedBoard, maxWeight);

    return weightedBoard;
}

function bustRows(blockLength,weightedBoard, maxWeight)
{
    for (let y = 0; y < weightedBoard.length; y++)
    {
        let streak = 0;

        for (let x = 0; x < weightedBoard.length; x++)
        {
            if (weightedBoard[y][x] === maxWeight / 2)
            {
                streak++;
                if (streak === blockLength)
                {
                    streak = 0;
                    weightedBoard[y][x] = maxWeight;
                }
            }
            else
            {
                streak = 0;
            }
        }
    }

    return weightedBoard;
}

function bustColumns(blockLength,weightedBoard, maxWeight)
{
    for (let x = 0; x < weightedBoard.length; x++)
    {
        let streak = 0;

        for (let y = 0; y < weightedBoard.length; y++)
        {
            if (weightedBoard[y][x] === maxWeight / 2)
            {
                streak++;
                if (streak === blockLength)
                {
                    streak = 0;
                    weightedBoard[y][x] = maxWeight;
                }
            }
            else
            {
                streak = 0;
            }

        }
    }

    return weightedBoard;
}

function createWeightedBoard(maxWeight, originalBoard, damagedPin, missedPin)
{
    let weightedBoard = [];

    for (let y = 0; y < originalBoard.length; y++)
    {
        weightedBoard.push([]);

        for (let x = 0; x < originalBoard.length; x++)
        {
            if (originalBoard[y][x] === damagedPin || originalBoard[y][x] === missedPin)
            {
                weightedBoard[y].push(0);
            }
            else
            {
                weightedBoard[y].push(maxWeight / 2);
            }
        }
    }

    return weightedBoard;
}