"use strict";

import { Ship } from "./ship";

export function GameBoard(shipList, boardSize)
{
    const _ships = [];
    const _missed = [];
    let _board = [];
    const PINS = {
        damaged: "D",
        empty: "E",
        missed: "M"
    };

    _initBoard(boardSize, shipList);

    function getSquareAt(coord)
    {
        return _board[coord[1]][coord[0]];
    }

    function _createShips(shipList)
    {
        shipList.forEach((element, index) => {

            _ships.push(Ship(element.shipName, element.shipLength, [index, 0], true, index));
        });
    }

    function updateBoard()
    {
        updateEmpty(); //in case a ship is moved
        updateMissed();
        updateShip();
        updateDamage();
        console.table(_board)
    }

    function _initBoard(size, shipList)
    {
        // Array.fill makes all row elements reference the same place
        for (let i = 0; i < size; i++)
        {
            const row = [];
            for (let j = 0; j < size; j ++)
            {
                row.push(PINS.empty)
            }
            _board.push(row)
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
                _board[pair[1]][pair[0]] = ship;
            });
        });
    }

    function updateEmpty()
    {
        for (let x = 0; x < boardSize; x ++)
        {
            for (let y = 0; y < boardSize; y ++)
            {
                _board[y][x] = PINS.empty;
            }
        }
    }

    function updateMissed()
    {
        _missed.forEach(miss => {

            _board[miss[1]][miss[0]] = PINS.missed;
        });
    }

    function updateDamage()
    {
        _ships.forEach(ship => {

            ship.position.forEach(square => {

                if (square.isDamaged)
                {
                    let decoded = _decodeCoord(square.coord);
                    _board[decoded[1]][decoded[0]] = PINS.damaged;
                }
            });
        });
    }

    function moveShip(ship, newPivot)
    {
        if (_positionConflict(ship, newPivot)) return;

        ship.changePosition(newPivot, false);
        updateBoard();
    }

    function rotateShip(ship)
    {
        if (_rotationConflict(ship)) return;

        ship.changePosition(ship.pivot, true);
        updateBoard();
    }

    function _rotationConflict(ship)
    {
        if (!ship.isVertical)
        {
            for (let i = 0; i < ship.LENGTH; i ++)
            {
                if (_board[ship.pivot[1] + i][ship.pivot[0]] !== PINS.empty && _board[ship.pivot[1] + i][ship.pivot[0]] !== ship) return true
            }
        }
        else
        {
            for (let i = 0; i < ship.LENGTH; i ++)
            {
                if (_board[ship.pivot[1]][ship.pivot[0] + i] !== PINS.empty && _board[ship.pivot[1]][ship.pivot[0] + i] !== ship) return true
            }
        }

        return false
    }

    function _positionConflict(ship, newPivot)
    {
        if (ship.isVertical)
        {
            for (let i = 0; i < ship.LENGTH; i ++)
            {
                if (_board[newPivot[1] + i][newPivot[0]] !== PINS.empty && _board[newPivot[1] + i][newPivot[0]] !== ship) return true
            }
        }
        else
        {
            for (let i = 0; i < ship.LENGTH; i ++)
            {
                if (_board[newPivot[1]][newPivot[0] + i] !== PINS.empty && _board[newPivot[1]][newPivot[0] + i] !== ship) return true
            }
        }

        return false
    }

    function receiveAttack(hits)
    {
        //forEach cannot be early terminated using return or break
        for (const hit of hits) 
        {
            if (_board[hit[1]][hit[0]] === PINS.empty)
            {
                _missed.push([hit[0], hit[1]]);
            }
            else if (_board[hit[1]][hit[0]] !== PINS.empty)
            {
                _board[hit[1]][hit[0]].receiveDamage([hit]);
            }
            
            updateBoard();
            
            if (_gameOver()) return;
        }
    }

    function _gameOver()
    {
        for (const ship of _ships)
        {
            if (!ship.isSunk) return false;
        }

        return true;
    }

    return {
        get PINS(){ return PINS },

        moveShip,
        receiveAttack,
        rotateShip,
        getSquareAt
    }
}