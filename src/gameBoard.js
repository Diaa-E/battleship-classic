"use strict";

import { createFleet, updateFleet } from "./fleet";
import { decodeCoord, positionConflict, rotationConflict, updateMissed } from "./positionUtility";
export { GameBoard, EmptyBoard, PinBox, processShot, calculateAvailableShots};

function GameBoard(shipList, boardSize)
{
    let missedShots = []
    let pinBox = pinBox("E", "M", "H", "S");
    let board = EmptyBoard(boardSize, pinBox.empty);
    let fleet = createFleet(shipList);

    function _clearBoard()
    {
        board = Array.from(EmptyBoard(boardSize, pinBox.empty));
    }

    function _placeShipPins()
    {
        board = Array.from(updateFleet(fleet, board, pinBox.hit, pinBox.sunk));
    }

    function _placeMissedPins()
    {
        board = Array.from(updateMissed(board, missedShots, pinBox.missed));
    }

    function _clearAndUpdate()
    {
        _clearBoard();
        _placeMissedPins();
        _placeShipPins();
    }

    function _update()
    {
        _placeShipPins();
        _placeMissedPins();
    }

    function receiveAttack(coord)
    {
        missedShots = Array.from(processShot(board, coord, missedShots));
        _update();
    }

    function moveShip(encodedCoord, encodedNewPivot)
    {
        const decodedNewPivot = decodeCoord(encodedNewPivot)
        const decodedCoord = decodeCoord(encodedCoord);
        const ship = board[decodedCoord[1]][decodedCoord[0]];

        if (!positionConflict(ship, decodedNewPivot, board, pinBox.empty, boardSize, ship.isVertical))
        {
            ship.changePosition(decodedNewPivot, false);
            _clearAndUpdate();
        }
    }

    function rotateShip(encodedCoord)
    {
        const decodedCoord = decodeCoord(encodedCoord);
        const ship = board[decodedCoord[1]][decodedCoord[0]];

        if (!rotationConflict(ship, board, pinBox.empty, boardSize))
        {
            ship.changePosition(ship.pivot, true);
            _clearAndUpdate();
        }
    }

    function getAvailableShots()
    {
        return calculateAvailableShots(fleet);
    }

    return {
        get board(){ return board },
        get pinBox(){ return pinBox },
        get fleet(){ return fleet },

        receiveAttack,
        moveShip,
        rotateShip,
        getAvailableShots,
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

function PinBox(emptyPin, missedPin, hitPin, sunkPin)
{
    return {
        empty: emptyPin,
        missed: missedPin,
        hit: hitPin,
        sunk: sunkPin,
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

function calculateAvailableShots(fleet)
{
    let shots = 0;

    for (const ship of fleet)
    {
        if (!ship.isSunk) shots += ship.SHOTS;
    }

    return shots;
}