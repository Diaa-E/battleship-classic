"use strict";

export function ship(name, length, pivot, vert = true)
{
    const hits = [];
    let position = [];
    let isSunk = false;
    let isVertical = vert;
    let currentPivot = pivot;

    move(pivot); //place ship for the first time

    function rotate()
    {
        isVertical = !isVertical;

        updatePosition(setPosition(currentPivot));
    }

    function checkHits(hits)
    {

    }

    function registerHit(hit)
    {

    }

    function move(newPivot)
    {
        updatePosition(setPosition(newPivot));
    }

    function updatePosition(newPosition)
    {
        newPosition.forEach((pair, index) => {

            position[index] = pair;
        });
    }

    function setPosition(newPivot)
    {
        const newPosition = [];

        if (isVertical)
        {
            for (let y = 0; y < length; y++)
            {
                newPosition.push([newPivot[0], newPivot[1] + y]);
            }
        }
        else
        {
            for (let x = 0; x < length; x++)
            {
                newPosition.push([newPivot[0] + x, newPivot[1]]);
            }
        }

        return newPosition;
    }

    return {
        name: name,
        hits: hits,
        position: position,
        isSunk: isSunk,
        rotate: rotate,
        checkHits: checkHits,
        move: move,
    }
}