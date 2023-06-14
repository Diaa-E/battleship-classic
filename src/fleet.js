"use strict";

import { decodeCoord } from "./positionUtility";
import { Ship } from "./ship";
export { createFleet, updateFleet, checkFleetDestroyed };

function createFleet(shipList)
{
    const ships = []

    for (let i = 0; i < shipList.length; i++)
    {
        ships.push(Ship(shipList[i].shipName, shipList[i].shipLength, [i, 0], true));
    }

    return ships;
}

function updateFleet(ships, board, damagedPin)
{
    for (const ship of ships)
    {
        for (const position of ship.position)
        {
            const pair = decodeCoord(position.coord);

            if (position.isDamaged)
            {
                board[pair[1]][pair[0]] = damagedPin;
            }
            else
            {
                board[pair[1]][pair[0]] = ship;
            }
        }
    }

    return board;
}

function checkFleetDestroyed(ships)
{
    for (const ship of ships)
    {
        if (!ship.isSunk) return false;
    }

    return true;
}