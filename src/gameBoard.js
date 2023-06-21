"use strict";

import { createFleet, updateFleet } from "./fleet";
import { updateMissed } from "./positionUtility";
export { GameBoard, EmptyBoard, pinBox, processShot}

function GameBoard(shipList, boardSize)
{
    let missedShots = []
    let pinBox = pinBox("E", "M", "H");
    let board = EmptyBoard(boardSize, pinBox.empty);
    let fleet = createFleet(shipList);

    function _clearBoard()
    {
        board = Array.from(EmptyBoard(boardSize, pinBox.empty));
    }

    function _placeShipPins()
    {
        board = Array.from(updateFleet(fleet, board, pinBox.hit));
    }

    function _placeMissedPins()
    {
        board = Array.from(updateMissed(board, missedShots, pinBox.missed));
    }

    function clearAndUpdate()
    {
        _clearBoard();
        _placeMissedPins();
        _placeShipPins();
    }

    function update()
    {
        _placeShipPins();
        _placeMissedPins();
    }

    function receiveAttack(coord)
    {
        missedShots = Array.from(processShot(board, coord, missedShots));
        update();
    }

    return {
        get board(){ return board },
        get pinBox(){ return pinBox },
        get fleet(){ return fleet },

        clearAndUpdate,
        update,
        receiveAttack,
    }
}

function EmptyBoard(boardSize, emptyPin)
{
    const board = []

    for (let y = 0; y < boardSize; y++)
    {
        const row = [];

        for (let x = 0; x < boardSize; x++)
        {
            row.push(emptyPin);
        }

        board.push(row);
    }

    return board;
}

function pinBox(emptyPin, missedPin, hitPin)
{
    return {
        empty: emptyPin,
        missed: missedPin,
        hit: hitPin
    };
}

function processShot(board, coord, missedShots)
{
    if (board[coord[1]][coord[0]] instanceof Object)
    {
        board[coord[1]][coord[0]].receiveDamage(coord);
    }
    else
    {
        missedShots.push(coord);
    }

    return missedShots;
}