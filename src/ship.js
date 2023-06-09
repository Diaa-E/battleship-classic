"use strict";

export function Ship(name, length, startPivot, startVertical, pin)
{
    let position = [];
    const NAME = name;
    const LENGTH = length;
    const PIN = pin;
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

            position.find(element => {

                if (element.coord === _encodeCoord(hit))
                {
                    element.isDamaged = true;
                }
            });
        });

        if (position.every(element => element.isDamaged === true)) isSunk = true;
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
                newPosition.push({
                    coord: _encodeCoord([newPivot[0], newPivot[1] + i]),
                    isDamaged: false
                });
            }
            else
            {
                newPosition.push({
                    coord: _encodeCoord([newPivot[0] + i, newPivot[1]]),
                    isDamaged: false
                });
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
        get PIN(){ return PIN },

        changePosition: changePosition,
        receiveDamage: receiveDamage,
    }
}