import {expect, jest, test} from '@jest/globals';
import {GameBoard} from "../gameBoard";
import { DefinePlugin } from 'webpack';

const DEFAULT_SHIP_LIST = [
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
]

// 1
test("Board places ships vertically next to each other starting at (0, 0) after object is initialized.", () => {

    const board1 = GameBoard(DEFAULT_SHIP_LIST, 10);

    expect(board1.board[0][0].NAME).toStrictEqual(DEFAULT_SHIP_LIST[0].shipName);
    expect(board1.board[0][1].NAME).toStrictEqual(DEFAULT_SHIP_LIST[1].shipName);
    expect(board1.board[0][2].NAME).toStrictEqual(DEFAULT_SHIP_LIST[2].shipName);
    expect(board1.board[0][3].NAME).toStrictEqual(DEFAULT_SHIP_LIST[3].shipName);
    expect(board1.board[0][4].NAME).toStrictEqual(DEFAULT_SHIP_LIST[4].shipName);

    expect(board1.board[0][5]).toStrictEqual(board1.PINS.empty);
    expect(board1.board[5][0]).toStrictEqual(board1.PINS.empty);
    expect(board1.board[4][1]).toStrictEqual(board1.PINS.empty);
    expect(board1.board[3][2]).toStrictEqual(board1.PINS.empty);
    expect(board1.board[3][3]).toStrictEqual(board1.PINS.empty);
    expect(board1.board[2][4]).toStrictEqual(board1.PINS.empty);
});

// 2
test("Board handles missed shots correctly.", () => {

    const board1 = GameBoard(DEFAULT_SHIP_LIST, 10);
    board1.receiveAttack([[6, 6], [6, 7], [9, 9]]);

    expect(board1.board[6][6]).toStrictEqual(board1.PINS.missed);
    expect(board1.board[7][6]).toStrictEqual(board1.PINS.missed);
    expect(board1.board[9][9]).toStrictEqual(board1.PINS.missed);
});

// 3
test("Board handles hit shots correctly.", () => {

    const board1 = GameBoard(DEFAULT_SHIP_LIST, 10);
    board1.receiveAttack([[0, 0], [1, 3], [4, 0]]);

    expect(board1.board[0][0]).toStrictEqual(board1.PINS.damaged);
    expect(board1.board[3][1]).toStrictEqual(board1.PINS.damaged);
    expect(board1.board[0][4]).toStrictEqual(board1.PINS.damaged);
});

// 4
test("Board handles mixed (includes hits and misses) attack correctly.", () => {

    const board1 = GameBoard(DEFAULT_SHIP_LIST, 10);
    board1.receiveAttack([[0, 0], [6, 7], [4, 0]]);

    expect(board1.board[0][0]).toStrictEqual(board1.PINS.damaged);
    expect(board1.board[7][6]).toStrictEqual(board1.PINS.missed);
    expect(board1.board[0][4]).toStrictEqual(board1.PINS.damaged);
});

// 5
test("Board moves a ship to a new position.", () => {

    const board1 = GameBoard(DEFAULT_SHIP_LIST, 10);
    board1.moveShip(board1.board[0][0], [8, 0]);

    expect(board1.board[0][0]).toStrictEqual(board1.PINS.empty);
    expect(board1.board[0][8]).toBeInstanceOf(Object);
});