"use strict";

import { GameBoard } from "./gameBoard";
import { decodeCoord, encodeCoord } from "./positionUtility";
import { AiBrain } from "./aiBrain";

export {Player, Ai};

function Player(playerName, rules, pinBox)
{
    const NAME = playerName;
    const gameBoard = GameBoard(rules.SHIP_LIST, rules.BOARD_SIZE, pinBox);
    let totalShots = 0;

    function randomizeFleet()
    {
        gameBoard.randomizeFleet();
    }

    function moveShip(encodedCoord, encodedNewIvot)
    {
        gameBoard.moveShip(encodedCoord, encodedNewIvot);
    }

    function rotateShip(encodedCoord)
    {
        gameBoard.rotateShip(encodedCoord);
    }

    function receiveAttack(encodedCoord)
    {
        gameBoard.receiveAttack(decodeCoord(encodedCoord));;
    }

    function getAvailableShots()
    {
        return rules.ADVANCED_MODE ? gameBoard.getAvailableShots() : 1;
    }

    function fleetDestroyed()
    {
        return gameBoard.fleetDestroyed();
    }

    function addShotsFired(shots)
    {
        totalShots += shots;
    }

    return {
        get NAME(){ return NAME },
        get board(){ return gameBoard.board },
        get fleet(){ return gameBoard.fleet },
        get totalShots(){ return totalShots },

        receiveAttack,
        moveShip,
        rotateShip,
        getAvailableShots,
        fleetDestroyed,
        addShotsFired,
        randomizeFleet,
    };
}

function Ai(rules, pinBox)
{
    const NAME = _generateAiName();
    const aiBrain = AiBrain();
    const gameBoard = GameBoard(rules.SHIP_LIST, rules.BOARD_SIZE, pinBox);
    let totalShots = 0;

    _placeShips();

    function _generateAiName()
    {
        const names = [
            "HAL 9000",
            "Skynet",
            "Cortana",
            "Mother",
            "T-800",
            "T-1000",
            "T-X",
            "Weebo",
            "J.A.R.V.I.S",
            "Brother Eye",
        ]

        return names[Math.floor(Math.random() * names.length)];
    }

    function getAvailableShots()
    {
        return rules.ADVANCED_MODE ? gameBoard.getAvailableShots() : 1;
    }

    function fleetDestroyed()
    {
        return gameBoard.fleetDestroyed();
    }

    function addShotsFired(shots)
    {
        totalShots += shots;
    }

    function _placeShips()
    {
        for (let ship of gameBoard.fleet.ships)
        {
            let availableSquares = _getAvailableSquares(ship);

            while (availableSquares.length > 0)
            {
                const i = _getRandomIndex(availableSquares);

                if (gameBoard.moveShip(encodeCoord(ship.pivot), availableSquares[i]))
                {
                    if (Math.floor(Math.random() * 100) > 50)
                    {
                        gameBoard.rotateShip(encodeCoord(ship.pivot));
                    }

                    break;
                }

                availableSquares.splice(i, 1);
            }
        }
    }

    function _getAvailableSquares(ship)
    {
        let availableSquares = [];

        for (let y = 0; y < gameBoard.board.length; y++)
        {
            for (let x = 0; x < gameBoard.board.length; x++)
            {
                if (gameBoard.board[y][x] === ship || gameBoard.board[y][x] === pinBox.empty)
                {
                    availableSquares.push(encodeCoord([x, y]));
                }
            }
        }

        return availableSquares;
    }

    function _getRandomIndex(array)
    {
        return Math.floor(Math.random() * array.length);
    }

    function receiveAttack(encodedCoord)
    {
        gameBoard.receiveAttack(decodeCoord(encodedCoord));;
    }

    return {
        get NAME(){ return NAME },
        get board(){ return gameBoard.board },
        get fleet(){ return gameBoard.fleet },
        get aiBrain(){ return aiBrain },
        get totalShots(){ return totalShots },

        getAvailableShots,
        fleetDestroyed,
        addShotsFired,
        receiveAttack,
    }
}