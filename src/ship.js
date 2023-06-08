"use strict";

export function Ship(name, length, startPivot, startVertical)
{
    let position = [];
    const damage = [];
    const NAME = name;
    const LENGTH = length;
    let isVertical = startVertical;
    let pivot = startPivot;
    let isSunk = false;

    _drawShip(pivot);

    function _encodeCoord(newCoord)
    {
        return newCoord.join(",");
    }

    function receiveDamage(hits)
    {
        hits.forEach(hit => {
            
            damage.push(hit);

            if (damage.length === LENGTH)
            {
                isSunk = true;
                return;
            }
        });
    }

    function changePosition(newPivot, rotate)
    {
        if (rotate) isVertical = !isVertical;

        _drawShip(newPivot);
    }

    function _drawShip(newPivot)
    {
        const newPosition = [];

        for (let i = 0; i < LENGTH; i++)
        {
            if (isVertical) 
            {
                newPosition.push(_encodeCoord([newPivot[0], newPivot[1] + i]));
            }
            else
            {
                newPosition.push(_encodeCoord([newPivot[0] + i, newPivot[1]]));
            }
        }

        position = Array.from(newPosition);
    }

    return {
        get position(){ return position },
        get isSunk(){ return isSunk },
        get pivot(){ return pivot },
        get NAME(){ return NAME },
        get LENGTH(){ return LENGTH },
        get isVertical(){ return isVertical },
        get damage(){ return damage },

        changePosition: changePosition,
        receiveDamage: receiveDamage,
    }
}