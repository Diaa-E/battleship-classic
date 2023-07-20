"use strict";

import { generatePosition, findCoordPair, checkSunk } from "./positionUtility";
export { Ship };

function Ship(name, length, startPivot, startVertical)
{
    let position = Array.from(generatePosition(startPivot, startVertical, length));
    const NAME = name;
    const LENGTH = length;
    let isVertical = startVertical;
    let pivot = startPivot;
    let isSunk = false;
    const SHOTS = length > 4 ? 2 : 1;

    function receiveDamage(hit)
    {
        findCoordPair(hit, position).isDamaged = true;

        isSunk = checkSunk(position);
    }

    function changePosition(newPivot, rotate)
    {
        if (rotate) isVertical = !isVertical;

        position = Array.from(generatePosition(newPivot, isVertical, LENGTH));
        pivot = newPivot;
    }

    return {
        get position(){ return position },
        get isSunk(){ return isSunk },
        get pivot(){ return pivot },
        get NAME(){ return NAME },
        get LENGTH(){ return LENGTH },
        get isVertical(){ return isVertical },
        get SHOTS(){ return SHOTS },

        changePosition: changePosition,
        receiveDamage: receiveDamage,
    }
}