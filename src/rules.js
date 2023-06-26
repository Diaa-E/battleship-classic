"use strict";

export function RulesClassic(salvo = false)
{
    const BOARD_SIZE = 10;
    const SHIP_LIST = [
        {
            shipName: "Carrier",
            shipLength: 5,
        },
        {
            shipName: "Battleship",
            shipLength: 4,
        },
        {
            shipName: "Cruiser",
            shipLength: 3,
        },
        {
            shipName: "Submarine",
            shipLength: 3,
        },
        {
            shipName: "Destroyer",
            shipLength: 2,
        }
    ];
    const ADVANCED_MODE = salvo? true : false;

    return {
        get BOARD_SIZE(){ return BOARD_SIZE },
        get SHIP_LIST(){ return SHIP_LIST },
        get ADVANCED_MODE(){ return ADVANCED_MODE },
    }
}