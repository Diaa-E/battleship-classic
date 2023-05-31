import {expect, jest, test} from '@jest/globals';
import {gameBoard} from "../gameBoard";

const SHIPS_LIST = [
    {
        shipLength: 5,
        name: "Carrier"
    },
    {
        shipLength: 4,
        name: "Battleship"
    },
    {
        shipLength: 3,
        name: "Submarine"
    },
    {
        shipLength: 3,
        name: "Cruiser"
    },
    {
        shipLength: 2,
        name: "Destroyer"
    }
];

test("Creates ship objects from the given list placed verticall next to each other.", () => {

    const board1 = gameBoard(SHIPS_LIST, 10);

    SHIPS_LIST.forEach((element, index) => {

        expect(board1.board[0][index].NAME).toStrictEqual(element.name);
        expect(board1.board[0][index].LENGTH).toStrictEqual(element.shipLength);
    });
});

