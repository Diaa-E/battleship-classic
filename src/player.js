"use strict";

import { GameBoard } from "./gameBoard";
import { decodeCoord } from "./positionUtility";
import { AiBrain } from "./aiBrain";

export function Player(playerName, isAi, rules, pinBox)
{
    const NAME = isAi? _generateAiName() : playerName;
    const aiBrain = isAi?  AiBrain() : undefined;

    const gameBoard = GameBoard(rules.SHIP_LIST, rules.BOARD_SIZE, pinBox);
    let availableShots = rules.ADVANCED_MODE ? rules.SHIP_LIST.length : 1;

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
        gameBoard.receiveAttack(decodeCoord(encodedCoord));
        if (rules.ADVANCED_MODE) updateAvailableShots();
    }

    function updateAvailableShots()
    {
        availableShots = gameBoard.getAvailableShots();
    }

    function getAvailableShots()
    {
        return rules.ADVANCED_MODE ? gameBoard.getAvailableShots() : 1;
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

        return names[Math.round(Math.random() * names.length)];
    }

    return {
        get NAME(){ return NAME },
        get board(){ return gameBoard.board },
        get fleet(){ return gameBoard.fleet },
        get pinBox(){ return gameBoard.pinBox },
        get aiBrain(){ return aiBrain },

        receiveAttack,
        moveShip,
        rotateShip,
        getAvailableShots
    };
}