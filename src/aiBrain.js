"use strict";

import { decodeCoord, encodeCoord } from "./positionUtility";

export {AiBrain, createWeightedBoard, bustRows, bustColumns, getDamagedSquares, scanRow, scanColumn};

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
    damagedSquares.forEach(square => {

        weightedBoard = scanRow(square, weightedBoard, weights, longestShipAlive);
        weightedBoard = scanColumn(square, weightedBoard, weights, longestShipAlive);

        return weightedBoard;
    });
}

function scanRow(square, weightedBoard,  weights, longestShipAlive)
{
    const coord = decodeCoord(square);

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1]][coord[0] + offset] === weights.RANDOM)
        {
            weightedBoard[coord[1]][coord[0] + offset] = weights.HUNT;
            break;
        }
    }

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1]][coord[0] - offset] === weights.RANDOM)
        {
            weightedBoard[coord[1]][coord[0] - offset] = weights.HUNT;
            break;
        }
    }

    return weightedBoard;
}

function scanColumn(square, longestShipAlive, weights, weightedBoard)
{
    const coord = decodeCoord(square);

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1] + offset]?.[coord[0]] === weights.RANDOM)
        {
            weightedBoard[coord[1] + offset][coord[0]] = weights.HUNT;
            break;
        }
    }

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1] - offset]?.[coord[0]] === weights.RANDOM)
        {
            weightedBoard[coord[1] - offset][coord[0]] = weights.HUNT;
            break;
        }
    }

    return weightedBoard;
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