"use strict";

import { encodeCoord } from "./positionUtility";

export {AiBrain, createWeightedBoard, bustRows, bustColumns};

function AiBrain(rules)
{
    const WEIGHTS = {
        HUNT: 100,
        BUST: 50,
        RANDOM: 25,
        DAMAGE: 10,
        NONE: 0,
    };

    return {

    }
}

function bustRows(blockLength, weightedBoard, weights)
{
    for (let y = 0; y < weightedBoard.length; y++)
    {
        let streak = 0;

        for (let x = 0; x < weightedBoard.length; x++)
        {
            if (weightedBoard[y][x] === weights.RANDOM)
            {
                streak++;
                if (streak === blockLength)
                {
                    streak = 0;
                    weightedBoard[y][x] = weights.BUST;
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

function bustColumns(blockLength, weightedBoard, weights)
{
    for (let x = 0; x < weightedBoard.length; x++)
    {
        let streak = 0;

        for (let y = 0; y < weightedBoard.length; y++)
        {
            if (weightedBoard[y][x] === weights.RANDOM)
            {
                streak++;
                if (streak === blockLength)
                {
                    streak = 0;
                    weightedBoard[y][x] = weights.BUST;
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

function createWeightedBoard(weights, originalBoard, pinBox)
{
    let weightedBoard = [];

    for (let y = 0; y < originalBoard.length; y++)
    {
        weightedBoard.push([]);

        for (let x = 0; x < originalBoard.length; x++)
        {
            if (originalBoard[y][x] === pinBox.missed || originalBoard[y][x] === pinBox.sunk)
            {
                weightedBoard[y].push(weights.NONE);
            }
            else if (originalBoard[y][x] === pinBox.hit)
            {
                weightedBoard[y].push(weights.DAMAGE);
            }
            else
            {
                weightedBoard[y].push(weights.RANDOM);
            }
        }
    }

    return weightedBoard;
}