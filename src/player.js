"use strict";

import { GameBoard } from "./gameBoard";
import { decodeCoord } from "./positionUtility";
import { AiBrain } from "./aiBrain";

export {Player, Ai};

function Player(playerName, rules, pinBox)
{
    const NAME = playerName;
    const gameBoard = GameBoard(rules.SHIP_LIST, rules.BOARD_SIZE, pinBox);
    let totalShots = 0;

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
    };
}

function Ai(rules, pinBox)
{
    const NAME = _generateAiName();
    const aiBrain = AiBrain();
    const gameBoard = GameBoard(rules.SHIP_LIST, rules.BOARD_SIZE, pinBox);
    let totalShots = 0;

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

        return names[Math.round(Math.random() * names.length)];
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
        get aiBrain(){ return aiBrain },
        get totalShots(){ return totalShots },

        getAvailableShots,
        fleetDestroyed,
        addShotsFired,
    }
}