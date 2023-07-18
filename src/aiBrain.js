"use strict";

import { decodeCoord, encodeCoord } from "./positionUtility";

export {AiBrain, createWeightedBoard, bustRows, bustColumns, getDamagedSquares, scanRow, scanColumn, getAllMoves, getLongestShipAlive};

function AiBrain(rules)
{
    const WEIGHTS = {
        HUNT: 100,
        BUST: 50,
        RANDOM: 25,
        DAMAGE: 10,
        NONE: 0,
    };

    const possibleMoves = {
        high: [],
        medium: [],
        low: [],
    };

    function _getRandomIndex(movesArray)
    {
        return Math.floor(Math.random() * movesArray.length);
    }

    function analyzeBoard(gameBoard, pinBox, opponentFleet)
    {
        const weightedBoard = createWeightedBoard(WEIGHTS, gameBoard.board, pinBox);
        weightedBoard = bustRows()
    }

    function getAttackCoords(availableShots)
    {
        const attackCoords = [];

        for (let i = 0; i < availableShots; i++)
        {
            if (possibleMoves.high.length > 0)
            {
                const index = _getRandomIndex(possibleMoves.high);
                attackCoords.push(possibleMoves.high[index]);
                possibleMoves.high.splice(index, 1);
            }
            else if (possibleMoves.medium.length > 0)
            {
                const index = _getRandomIndex(possibleMoves.medium);
                attackCoords.push(possibleMoves.medium[index]);
                possibleMoves.medium.splice(index, 1);
            }
            else
            {
                const index = _getRandomIndex(possibleMoves.low);
                attackCoords.push(possibleMoves.low[index]);
                possibleMoves.low.splice(index, 1);
            }
        }

        return attackCoords;
    }

    return {
        getAttackCoords,
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
        if (weightedBoard[coord[1]][coord[0] + offset] >= weights.RANDOM)
        {
            weightedBoard[coord[1]][coord[0] + offset] = weights.HUNT;
            break;
        }
    }

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1]][coord[0] - offset] >= weights.RANDOM)
        {
            weightedBoard[coord[1]][coord[0] - offset] = weights.HUNT;
            break;
        }
    }

    return weightedBoard;
}

function scanColumn(square, weightedBoard,  weights, longestShipAlive)
{
    const coord = decodeCoord(square);

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1] + offset]?.[coord[0]] >= weights.RANDOM)
        {
            weightedBoard[coord[1] + offset][coord[0]] = weights.HUNT;
            break;
        }
    }

    for (let offset = 1; offset < longestShipAlive; offset++)
    {
        if (weightedBoard[coord[1] - offset]?.[coord[0]] >= weights.RANDOM)
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

function getAllMoves(weightedBoard, weights)
{
    const high = [];
    const medium = [];
    const low = [];

    for (let x = 0; x < weightedBoard.length; x++)
    {
        for (let y = 0; y < weightedBoard.length; y++)
        {
            if (weightedBoard[y][x] === weights.HUNT)
            {
                high.push(encodeCoord([x, y]));
            }
            else if (weightedBoard[y][x] === weights.BUST)
            {
                medium.push(encodeCoord([x, y]));
            }
            else if (weightedBoard[y][x] === weights.RANDOM)
            {
                low.push(encodeCoord([x, y]));
            }
        }
    }

    return {
        high,
        medium,
        low
    }
}

function getLongestShipAlive(ships)
{
    for (const ship of ships)
    {
        if (!ship.isSunk) return ship.LENGTH;
    }
}