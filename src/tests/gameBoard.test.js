import {expect, jest, test} from '@jest/globals';
import { gameBoard } from '../gameBoard';
import { ship } from '../ship';

const defaultShipList = [
    {
        name: "Carrier",
        length: 5
    },
    {
        name: "Battleship",
        length: 4
    },
    {
        name: "Cruiser",
        length: 3
    },
    {
        name: "Submarine",
        length: 3
    },
    {
        name: "Destroyer",
        length: 2
    }
];

const defaultShips = [
    ship(defaultShipList[0].name, defaultShipList[0].length, [0, 0], true),
    ship(defaultShipList[1].name, defaultShipList[1].length, [1, 0], true),
    ship(defaultShipList[2].name, defaultShipList[2].length, [2, 0], true),
    ship(defaultShipList[3].name, defaultShipList[3].length, [3, 0], true),
    ship(defaultShipList[4].name, defaultShipList[4].length, [4, 0], true)
]

test("Board is initialized correctly", () => {

    const board = gameBoard();
    board.createShips(defaultShipList);

    expect(board.shipList).toStrictEqual(defaultShips);
});