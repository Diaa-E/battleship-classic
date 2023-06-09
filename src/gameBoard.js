"use strict";

import { Ship } from "./ship";

export function GameBoard(shipList, boardSize)
{
    const _ships = [];
    let board = [];
    const TOKENS = {
        damaged: "D",
        empty: "E",
        missed: "M"
    };

    _initBoard(boardSize, shipList);

    function _createShips(shipList)
    {
        shipList.forEach((element, index) => {

            _ships.push(Ship(element.shipName, element.shipLength, [index, 0], true));
        });
    }

    function updateBoard()
    {
        updateEmpty(); //in case a ship is moved
        updateShip();
        updateDamage();
    }

    function _initBoard(size, shipList)
    {
        // Array.fill makes all row elements reference the same place
        for (let i = 0; i < size; i++)
        {
            const row = [];
            for (let j = 0; j < size; j ++)
            {
                row.push(TOKENS.empty)
            }
            board.push(row)
        }
        _createShips(shipList);
        updateBoard();
    }

    function _decodeCoord(newCoord)
    {
        return newCoord.split(",");
    }

    function updateShip()
    {
        _ships.forEach(ship => {

            ship.position.forEach(pair => {

                pair = _decodeCoord(pair.coord)
                board[pair[1]][pair[0]] = ship;
            });
        });
    }

    function updateEmpty()
    {
        board.forEach(row => {

            row.forEach(square => {

                square = TOKENS.empty;
            });
        });
    }

    function updateDamage()
    {

    }

    function moveShip(ship, newPivot)
    {
        if (_positionConflict()) return;
    }

    function _positionConflict(shipLength, newPivot)
    {

    }

    return {
        get board(){ return board },
        get TOKENS() { return TOKENS },

        moveShip,
    }
}