"use strict";

import { encodeCoord } from "./positionUtility";

export {AiBrain, checkerEmptySquares, scrapeDamagedSquares, createWeightedBoard, bustRows, bustColumns};

function AiBrain(rules)
{
    const MAX_WEIGHT = 100;
    const BUSTING_SHOT_WEIGHT = MAX_WEIGHT / 2;
    const RANDOM_SHOT_WEIGHT = MAX_WEIGHT / 4;
    const NO_SHOT_WEIGHT = 0;

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

function bustRows(blockLength, weightedBoard, randomShotWeight, bustingShotWeight)
{
    for (let y = 0; y < weightedBoard.length; y++)
    {
        let streak = 0;

        for (let x = 0; x < weightedBoard.length; x++)
        {
            if (weightedBoard[y][x] === randomShotWeight)
            {
                streak++;
                if (streak === blockLength)
                {
                    streak = 0;
                    weightedBoard[y][x] = bustingShotWeight;
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

function bustColumns(blockLength, weightedBoard, randomShotWeight, bustingShotWeight)
{
    for (let x = 0; x < weightedBoard.length; x++)
    {
        let streak = 0;

        for (let y = 0; y < weightedBoard.length; y++)
        {
            if (weightedBoard[y][x] === randomShotWeight)
            {
                streak++;
                if (streak === blockLength)
                {
                    streak = 0;
                    weightedBoard[y][x] = bustingShotWeight;
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

function createWeightedBoard(randomShotWeight, noShotWeight, originalBoard, damagedPin, missedPin, sunkPin)
{
    let weightedBoard = [];

    for (let y = 0; y < originalBoard.length; y++)
    {
        weightedBoard.push([]);

        for (let x = 0; x < originalBoard.length; x++)
        {
            if (originalBoard[y][x] === damagedPin || originalBoard[y][x] === missedPin || originalBoard[y][x] === sunkPin)
            {
                weightedBoard[y].push(noShotWeight);
            }
            else
            {
                weightedBoard[y].push(randomShotWeight);
            }
        }
    }

    return weightedBoard;
}