"use strict";

import { Ship } from "./ship";

export function GameBoard(shipList, boardSize)
{
    const _ships = [];
    const _missed = [];
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
        updateMissed();
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

    function updateMissed()
    {
        _missed.forEach(miss => {

            board[miss[1]][miss[0]] = TOKENS.missed;
        });
    }

    function updateDamage()
    {
        _ships.forEach(ship => {

            ship.position.forEach(square => {

                if (square.isDamaged)
                {
                    let decoded = _decodeCoord(square.coord);
                    board[decoded[1]][decoded[0]] = TOKENS.damaged;
                }
            });
        });
    }

    function moveShip(ship, newPivot)
    {
        if (_positionConflict()) return;
    }

    function _positionConflict(shipLength, newPivot)
    {

    }

    function receiveAttack(hits)
    {
        hits.forEach(hit => {

            if (board[hit[1]][hit[0]] === TOKENS.empty)
            {
                _missed.push([hit[0], hit[1]]);
            }
            else if (board[hit[1]][hit[0]] instanceof Object)
            {
                board[hit[1]][hit[0]].receiveDamage([hit]);
            }
        });

        updateBoard();
    }

    return {
        get board(){ return board },
        get TOKENS() { return TOKENS },

        moveShip,
        receiveAttack
    }
}