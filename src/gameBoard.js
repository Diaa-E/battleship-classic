"use strict";

import { checkFleetDestroyed, createFleet, updateFleet } from "./fleet";
import { decodeCoord, positionConflict, rotationConflict, updateMissed } from "./positionUtility";
export { GameBoard, EmptyBoard, processShot, calculateAvailableShots};

function GameBoard(shipList, boardSize, pinBox)
{
    let missedShots = []
    let board = EmptyBoard(boardSize, pinBox.empty);
    let fleet = createFleet(shipList);
    _clearAndUpdate();

    function _clearBoard()
    {
        board = Array.from(EmptyBoard(boardSize, pinBox.empty));
    }

    function _placeShipPins()
    {
        board = Array.from(fleet.update(board, pinBox.hit, pinBox.sunk));
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
            return true;
        }

        return false;
    }

    function rotateShip(encodedCoord)
    {
        const decodedCoord = decodeCoord(encodedCoord);
        const ship = board[decodedCoord[1]][decodedCoord[0]];

        if (!rotationConflict(ship, board, pinBox.empty, boardSize))
        {
            ship.changePosition(ship.pivot, true);
            _clearAndUpdate();
            return true;
        }

        return false;
    }

    function getAvailableShots()
    {
        return calculateAvailableShots(fleet);
    }

    function fleetDestroyed()
    {
        return fleet.isDestroyed();
    }

    return {
        get board(){ return board },
        get pinBox(){ return pinBox },
        get fleet(){ return fleet },

        receiveAttack,
        moveShip,
        rotateShip,
        getAvailableShots,
        fleetDestroyed,
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

    for (const ship of fleet.ships)
    {
        if (!ship.isSunk) shots += ship.SHOTS;
    }

    return shots;
}