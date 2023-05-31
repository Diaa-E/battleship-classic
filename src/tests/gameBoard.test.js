import {expect, jest, test} from '@jest/globals';
import {gameBoard} from "../gameBoard";

const SHIPS_LIST = [
    {
        length: 5,
        name: "Carrier"
    },
    {
        length: 4,
        name: "Battleship"
    },
    {
        length: 3,
        name: "Submarine"
    },
    {
        length: 3,
        name: "Cruiser"
    },
    {
        length: 2,
        name: "Destroyer"
    }
];

test("Creates ship objects from the given list placed verticall next to each other.", () => {

    const board1 = gameBoard(SHIPS_LIST);

    SHIPS_LIST.forEach((element, index) => {

        expect(board1.board[0][index].name).toBeInstanceOf(element.name);
        expect(board1.board[0][index].length).toBeInstanceOf(element.length);
    });
});

