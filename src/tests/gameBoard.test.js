import {expect, jest, test} from '@jest/globals';
import {GameBoard} from "../gameBoard";

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
    
    expect(board1.board[0][5]).toStrictEqual(board1.TOKENS.empty);
    expect(board1.board[5][0]).toStrictEqual(board1.TOKENS.empty);
    expect(board1.board[4][1]).toStrictEqual(board1.TOKENS.empty);
    expect(board1.board[3][2]).toStrictEqual(board1.TOKENS.empty);
    expect(board1.board[3][3]).toStrictEqual(board1.TOKENS.empty);
    expect(board1.board[2][4]).toStrictEqual(board1.TOKENS.empty);
});