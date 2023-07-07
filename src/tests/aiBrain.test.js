import {expect, jest, test} from '@jest/globals';
import { checkerEmptySquares, scrapeDamagedSquares, bustRows, bustColumns, createWeightedBoard } from '../aiBrain';

test("AI Brain halves the gameboard by checkering", () => {

    const board = [
        ["E", "E", "E"],
        ["E", "E", "E"],
        ["E", "E", "E"],
    ];

    expect(checkerEmptySquares(board, "E", true)).toStrictEqual(["0,1", "1,0", "1,2", "2,1"]);
    expect(checkerEmptySquares(board, "E", false)).toStrictEqual(["0,0", "0,2", "1,1", "2,0", "2,2"]);
});

test("AI Brain halves the gameboard by checkering and ignores occupied squares", () => {

    const board = [
        ["E", "D", "E", "E"],
        [{ }, "E", "M", "E"],
        ["E", { }, "E", "E"],
        ["E", "E", "E", "E"],
    ];

    expect(checkerEmptySquares(board, "E", true)).toStrictEqual(["0,3", "2,3", "3,0", "3,2"]);
    expect(checkerEmptySquares(board, "E", false)).toStrictEqual(["0,0", "0,2", "1,1", "1,3", "2,0", "2,2", "3,1", "3,3"]);
});

test("AI brain scrapes damaged squares correctly", () => {

    const board = [
        ["E", "D", "E"],
        ["D", "E", "E"],
        ["E", "E", "E"],
    ];

    expect(scrapeDamagedSquares(board, "D")).toStrictEqual(["0,1", "1,0"]);
});

test("AI Brain scrapes damaged squares and ignores other squares", () => {

    const board = [
        ["E", { }, "M", "D"],
        ["E", "E", "D", { }],
        [{ }, { }, "M", "D"],
        ["E", "E", "E", "D"],
    ];

    expect(scrapeDamagedSquares(board, "D")).toStrictEqual(["2,1", "3,0", "3,2", "3,3"]);
});

test("AI Brain scrapes an empty array when there is no damage on the board", () => {

    const board = [
        ["E", "E", "E"],
        ["E", "E", "E"],
        ["E", "E", "E"],
    ];

    expect(scrapeDamagedSquares(board, "D")).toStrictEqual([]);
});

test("Weighted board assigns weight correctly to empty squares", () => {

    const RANDOM_SHOT = 25;
    const NO_SHOT = 0;
    const E = "E";
    const D = "D";
    const M = "M";
    const S = "S";
    const board = [
        [E, E, E],
        [E, E, E],
        [E, E, E]
    ];

    expect(createWeightedBoard(RANDOM_SHOT, NO_SHOT, board, D, M, S)).toStrictEqual([
        [RANDOM_SHOT, RANDOM_SHOT, RANDOM_SHOT],
        [RANDOM_SHOT, RANDOM_SHOT, RANDOM_SHOT],
        [RANDOM_SHOT, RANDOM_SHOT, RANDOM_SHOT],
    ])
});

test("Weighted board assigns weight correctly to mixed squares", () => {

    const RANDOM_SHOT = 25;
    const NO_SHOT = 0;
    const E = "E";
    const D = "D";
    const M = "M";
    const S = "S";
    const board = [
        [D, E, M],
        [E, { }, { }],
        [E, M, E]
    ];

    expect(createWeightedBoard(RANDOM_SHOT, NO_SHOT, board, D, M, S)).toStrictEqual([
        [0, RANDOM_SHOT, 0],
        [RANDOM_SHOT, RANDOM_SHOT, RANDOM_SHOT],
        [RANDOM_SHOT, 0, RANDOM_SHOT]
    ])
});

test("Picks last square of a row of empty squares of a specified length (ideal case)", () => {

    const BUSTING_SHOT = 50;
    const RANDOM_SHOT = 25;
    const NO_SHOT = 0;
    const weightedBoard = [
        [RANDOM_SHOT, RANDOM_SHOT, NO_SHOT],
        [RANDOM_SHOT, NO_SHOT, RANDOM_SHOT],
        [NO_SHOT, RANDOM_SHOT ,RANDOM_SHOT],
    ];

    expect(bustRows(2, weightedBoard, RANDOM_SHOT, BUSTING_SHOT)).toStrictEqual([
        [RANDOM_SHOT, BUSTING_SHOT, NO_SHOT],
        [RANDOM_SHOT, NO_SHOT, RANDOM_SHOT],
        [NO_SHOT, RANDOM_SHOT, BUSTING_SHOT]
    ]);
});

test("Picks last square of a column of empty squares of a specified length (ideal case)", () => {

    const BUSTING_SHOT = 50;
    const RANDOM_SHOT = 25;
    const NO_SHOT = 0;
    const weightedBoard = [
        [RANDOM_SHOT, RANDOM_SHOT, NO_SHOT],
        [RANDOM_SHOT, NO_SHOT, RANDOM_SHOT],
        [NO_SHOT, RANDOM_SHOT ,RANDOM_SHOT],
    ];

    expect(bustColumns(2, weightedBoard, RANDOM_SHOT, BUSTING_SHOT)).toStrictEqual([
        [RANDOM_SHOT, RANDOM_SHOT, NO_SHOT],
        [BUSTING_SHOT, NO_SHOT, RANDOM_SHOT],
        [NO_SHOT, RANDOM_SHOT, BUSTING_SHOT]
    ]);
});

test("Picks last square of a row of empty squares of a specified length (ignores already existing max weight)", () => {

    const BUSTING_SHOT = 50;
    const RANDOM_SHOT = 25;
    const NO_SHOT = 0;
    const weightedBoard = [
        [RANDOM_SHOT, RANDOM_SHOT, BUSTING_SHOT],
        [RANDOM_SHOT, BUSTING_SHOT, RANDOM_SHOT],
        [NO_SHOT, RANDOM_SHOT ,RANDOM_SHOT],
    ];

    expect(bustRows(2, weightedBoard, RANDOM_SHOT, BUSTING_SHOT)).toStrictEqual([
        [RANDOM_SHOT, BUSTING_SHOT, BUSTING_SHOT],
        [RANDOM_SHOT, BUSTING_SHOT, RANDOM_SHOT],
        [NO_SHOT, RANDOM_SHOT, BUSTING_SHOT]
    ]);
});

test("Picks last square of a column of empty squares of a specified length (ignores already existing max weight)", () => {

    const BUSTING_SHOT = 50;
    const RANDOM_SHOT = 25;
    const NO_SHOT = 0;
    const weightedBoard = [
        [RANDOM_SHOT, RANDOM_SHOT, BUSTING_SHOT],
        [RANDOM_SHOT, BUSTING_SHOT, RANDOM_SHOT],
        [NO_SHOT, RANDOM_SHOT, RANDOM_SHOT],
    ];

    expect(bustColumns(2, weightedBoard, RANDOM_SHOT, BUSTING_SHOT)).toStrictEqual([
        [RANDOM_SHOT, RANDOM_SHOT, BUSTING_SHOT],
        [BUSTING_SHOT, BUSTING_SHOT, RANDOM_SHOT],
        [NO_SHOT, RANDOM_SHOT, BUSTING_SHOT]
    ]);
});