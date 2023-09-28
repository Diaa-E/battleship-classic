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
        const availableShots = gameBoard.getAvailableShots();
        
        if (availableShots === 0) return 0;
        if (rules.ADVANCED_MODE) return availableShots;
        return 1;
    }

    function getRemainingShips()
    {
        return gameBoard.getRemainingShips();
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
        getRemainingShips,
    };
}

function Ai(rules, pinBox)
{
    const NAME = _generateAiName();
    const aiBrain = AiBrain();
    const gameBoard = GameBoard(rules.SHIP_LIST, rules.BOARD_SIZE, pinBox);
    let totalShots = 0;
    let logging = false;

    _placeShips();

    function debug_setLogging(enableLogging)
    {
        logging = enableLogging;
        aiBrain.debug_setLogging(enableLogging);
    }

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
        const availableShots = gameBoard.getAvailableShots();
        
        if (availableShots === 0) return 0;
        if (rules.ADVANCED_MODE) return availableShots;
        return 1;
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
        gameBoard.randomizeFleet();
    }

    function receiveAttack(encodedCoord)
    {
        gameBoard.receiveAttack(decodeCoord(encodedCoord));;
    }

    function getRemainingShips()
    {
        return gameBoard.getRemainingShips();
    }

    return {
        get NAME(){ return NAME },
        get board(){ return gameBoard.board },
        get fleet(){ return gameBoard.fleet },
        get aiBrain(){ return aiBrain },
        get totalShots(){ return totalShots },
        get log(){ return aiBrain.log },

        getAvailableShots,
        fleetDestroyed,
        addShotsFired,
        receiveAttack,
        debug_setLogging,
        getRemainingShips,
    }
}