"use strict";

export function ship(name, length, startPivot, startVertical)
{
    let position = [];
    const NAME = name;
    const LENGTH = length;
    let isVertical = startVertical;
    let pivot = startPivot;
    let isSunk = false;

    _drawShip(pivot);

    function _drawShip(newPivot)
    {
        const newPosition = [];

        for (let i = 0; i < LENGTH; i++)
        {
            if (isVertical) 
            {
                newPosition.push([newPivot[0], newPivot[1] + i]);
            }
            else
            {
                newPosition.push([newPivot[0] + i, newPivot[1]]);
            }
        }

        newPosition.forEach((element, index) => { position[index] = element });
    }

    return {
        get position(){ return position },
        get isSunk(){ return isSunk },
        get pivot(){ return pivot },
        get NAME(){ return NAME },
        get LENGTH(){ return LENGTH },
        get isVertical(){ return isVertical }
    }
}