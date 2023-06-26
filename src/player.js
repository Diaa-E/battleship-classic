"use strict";

import { GameBoard } from "./gameBoard";

export function Player(playerName, isAi, rules)
{
    const NAME = playerName;
    const gameBoard = GameBoard(rules.SHIP_LIST, rules.BOARD_SIZE);

    return {
        get NAME(){ return NAME },
        get board(){ return gameBoard.board },
        get fleet(){ return gameBoard.fleet },
        get pinBox(){ return gameBoard.pinBox },

        receiveAttack : gameBoard.receiveAttack,
    };
}