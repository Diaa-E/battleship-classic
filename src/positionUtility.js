"use strict";

export {
    generatePosition,
    decodeCoord,
    encodeCoord,
    findCoordPair,
    checkSunk,
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