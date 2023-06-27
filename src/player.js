"use strict";

import { GameBoard } from "./gameBoard";
import { decodeCoord } from "./positionUtility";

export function Player(playerName, isAi, rules)
{
    const NAME = isAi? _generateAiName() : playerName;
    const gameBoard = GameBoard(rules.SHIP_LIST, rules.BOARD_SIZE);

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

        receiveAttack,
        moveShip,
        rotateShip,
    };
}