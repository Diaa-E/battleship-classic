"use strict";

export {
    generatePosition,
    decodeCoord,
    encodeCoord,
    findCoordPair,
    checkSunk,
    positionConflict,
    rotationConflict,
    updateMissed,
};

function generatePosition(newPivot, isVertical, length)
{
    const newPosition = [];

    for (let i = 0; i < length; i++)
    {
        if (isVertical) 
        {
            newPosition.push({
                coord: encodeCoord([newPivot[0], newPivot[1] + i]),
                isDamaged: false
            });
        }
        else
        {
            newPosition.push({
                coord: encodeCoord([newPivot[0] + i, newPivot[1]]),
                isDamaged: false
            });
        }
    }

    return newPosition;
}

function encodeCoord(newCoord)
{

    return newCoord.join(",");
}

function decodeCoord(newCoord)
{
    const pair = newCoord.split(",");
    
    pair[0] = +pair[0];
    pair[1] = +pair[1];

    return pair;
}

function findCoordPair(pair, positionArray)
{
    return positionArray.find(element => element.coord === encodeCoord(pair));
}

function checkSunk(positionArray)
{
    return positionArray.every(element => element.isDamaged === true);
}

function positionConflict(ship, newPivot, board, emptyPin, boardSize, shipIsVertical)
{
    if (newPivot[0] >= boardSize || newPivot[1] >= boardSize) return true;

    const newPosition = generatePosition(newPivot, shipIsVertical, ship.LENGTH).map(position => position.coord);

    for (let pair of newPosition)
    {
        pair = decodeCoord(pair);

        if (pair[0] >= boardSize || pair[1] >= boardSize) return true;
        if (board[pair[1]][pair[0]] !== emptyPin && board[pair[1]][pair[0]] !== ship) return true;
    }

    return false;
}

function rotationConflict(ship, board, emptyPin, boardSize)
{
    return positionConflict(ship, ship.pivot, board, emptyPin, boardSize, !ship.isVertical);
}

function updateMissed(board, missedShots, missedPin)
{
    for (const shot of missedShots)
    {
        board[shot[1]][shot[0]] = missedPin;
    }

    return board;
}