import {expect, jest, test} from '@jest/globals';
import {gameBoard} from "../gameBoard";

const tokens = {
    empty: "[]",
    damaged: "X",
    missed: "O",
}

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

test("Creates ship objects from the given list placed vertically next to each other.", () => {

    const board1 = gameBoard(SHIPS_LIST, 10, tokens);

    SHIPS_LIST.forEach((element, index) => {

        expect(board1.board[0][index].NAME).toStrictEqual(element.name);
        expect(board1.board[0][index].LENGTH).toStrictEqual(element.shipLength);
    });
});

test("Moves ship to a new position", () => {

    const board1 = gameBoard([SHIPS_LIST[0]], 10, tokens);
    board1.moveShip(board1[0][0], [1, 2], false);

    expect(board1.board[0][0]).toStrictEqual(tokens.empty);
    expect(board1[2][1].NAME).toStrictEqual(SHIPS_LIST[0].name);
});

test("Moves ship to a new position by selecting any part of the ship", () => {

    const board1 = gameBoard([SHIPS_LIST[0]], 10, tokens);
    board1.moveShip(board1[0][3], [1, 2], false);

    expect(board1.board[0][0]).toStrictEqual(tokens.empty);
    expect(board1[2][1].NAME).toStrictEqual(SHIPS_LIST[0].name);
});

test("Does not move ship over another ship", () => {

    const board1 = gameBoard(SHIPS_LIST, 10, tokens);
    board1.moveShip(board1[0][0], [1, 0], false);

    expect(board1[0][0].NAME).toStrictEqual(SHIPS_LIST[0].name);
    expect(board1[1][0].NAME).toStrictEqual(SHIPS_LIST[1].name);
});

test("Does not mvoe ship out of the board", () => {

    const board1 = gameBoard([SHIPS_LIST[0]], 10, tokens);
    board1.moveShip(board1[0][0], [0, 7], false);
    expect(board1[0][0].NAME).toStrictEqual(SHIPS_LIST[0].name);
    expect(board1[7][0]).toStrictEqual(tokens.empty);
});