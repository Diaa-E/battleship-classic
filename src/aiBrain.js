"use strict";

import { decodeCoord, encodeCoord } from "./positionUtility";

export {AiBrain, createWeightedBoard, bustRows, bustColumns, getDamagedSquares, huntShips, connectDots};

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

function getDamagedSquares(weightedBoard, weights)
{
    const damagedSquares = [];

    for (let y = 0; y < weightedBoard.length; y++)
    {
        for (let x = 0; x < weightedBoard.length; x++)
        {
            if (weightedBoard[y][x] === weights.DAMAGE)
            {
                damagedSquares.push(encodeCoord([x, y]));
            }
        }
    }

    return damagedSquares;
}

function huntShips(damagedSquares, weightedBoard, weights, longestShipAlive)
{
    
}

function connectDots(square, weightedBoard, weights, longestShipAlive)
{
    const coord = decodeCoord(square);

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1]][coord[0] + offset] === weights.NONE)
        {
            break;
        }

        for (let i = coord[0] + 1; i < offset; i++)
        {
            if (weightedBoard[coord[1]][coord[0] + offset] === weights.DAMAGE)
            {
                weightedBoard[coord[1]][coord[0] + i] = weights.HUNT;
                return weightedBoard;
            }
        }
    }

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1]][coord[0] - offset] === weights.NONE)
        {
            break;
        }

        for (let i = coord[0] + 1; i < offset; i++)
        {
            if (weightedBoard[coord[1]][coord[0] - offset] === weights.DAMAGE)
            {
                weightedBoard[coord[1]][coord[0] - i] = weights.HUNT;
                return weightedBoard;
            }
        }
    }

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1] + offset]?.[coord[0]] === weights.NONE)
        {
            break;
        }

        for (let i = [coord[1]] + 1; i < offset; i++)
        {
            if (weightedBoard[coord[1] + offset]?.[coord[0]] === weights.DAMAGE)
            {
                weightedBoard[coord[1] + i][coord[0]] = weights.HUNT;
                return weightedBoard;
            }
        }
    }

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1] - offset]?.[coord[0]] === weights.NONE)
        {
            break;
        }

        for (let i = coord[1] + 1; i < offset; i++)
        {
            if (weightedBoard[coord[1] - offset]?.[coord[0]] === weights.DAMAGE)
            {
                weightedBoard[coord[1] - i][coord[0]] = weights.HUNT;
                return weightedBoard;
            }
        }
    }

    return false;
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