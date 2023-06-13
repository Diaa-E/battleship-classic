"use strict";

export {encodeCoord, decodeCoord}

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