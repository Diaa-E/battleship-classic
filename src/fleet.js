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

    function isDestroyed()
    {
        return checkFleetDestroyed(ships);
    }

    function update(board, damagedPin, sunkPin)
    {
        return updateFleet(ships, board, damagedPin, sunkPin);
    }

    function getRemainingShips()
    {
        let remainingShips = 0;
        ships.forEach(ship => {

            if (!ship.isSunk) remainingShips ++;
        });

        return remainingShips;
    }

    return {
        get ships(){ return ships},
        
        isDestroyed,
        update,
        getRemainingShips,
    }
}

function updateFleet(ships, board, damagedPin, sunkPin)
{
    for (const ship of ships)
    {
        if (ship.isSunk)
        {
            for (const position of ship.position)
            {
                const pair = decodeCoord(position.coord);
                board[pair[1]][pair[0]] = sunkPin;
            }
        }
        else
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