"use strict";

export function ship(name, length, pivot)
{
    const hits = [];
    let position = [];
    let isSunk = false;
    let isVertical = true;

    position = move(pivot, isVertical); //place ship for the first time

    function rotate()
    {
    
    }

    function checkHits(hits)
    {

    }

    function registerHit(hit)
    {

    }

    function move(newPivot, vert = isVertical)
    {
        const newPosition = [];

        if (vert)
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