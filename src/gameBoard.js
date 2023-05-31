"use strict";

import { ship } from "./ship";

export function gameBoard(shipList, boardSize, tokens)
{
    const _ships = [];
    let board;
    const _TOKENS = {...tokens};

    _initBoard(boardSize, shipList);

    function _createShips(shipList)
    {
        shipList.forEach((element, index) => {

            _ships.push(ship(element.name, element.shipLength, [index, 0], true));
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
        board = Array(size).fill(Array(size).fill(_TOKENS.empty));
        _createShips(shipList);
        updateBoard();
    }

    function updateShip()
    {
        _ships.forEach(element => {

            element.position.forEach(pair => {

                board[pair[1]][pair[0]] = element;
            });
        });
    }

    function updateEmpty()
    {
        board.forEach(row => {

            row.forEach(square => {

                square = _TOKENS.empty;
            });
        });
    }

    function updateDamage()
    {

    }

    return {
        get board(){ return board },
    }
}