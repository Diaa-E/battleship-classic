import {expect, jest, test} from '@jest/globals';
import { checkerEmptySquares, scrapeDamagedSquares, bustRows, bustColumns, createWeightedBoard } from '../aiBrain';

const WEIGHTS = {
    HUNT: 100,
    BUST: 50,
    RANDOM: 25,
    DAMAGE: 10,
    NONE: 0,
};

const PIN_BOX = {
    empty: "E",
    missed: "M",
    hit: "D",
    sunk: "S",
};

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

    const board = [
        [PIN_BOX.empty, PIN_BOX.empty, PIN_BOX.empty],
        [PIN_BOX.empty, PIN_BOX.empty, PIN_BOX.empty],
        [PIN_BOX.empty, PIN_BOX.empty, PIN_BOX.empty]
    ];

    expect(createWeightedBoard(WEIGHTS, board, PIN_BOX)).toStrictEqual([
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM]
    ])
});

test("Weighted board assigns weight correctly to mixed squares", () => {

    const board = [
        [PIN_BOX.hit, PIN_BOX.empty, PIN_BOX.missed],
        [PIN_BOX.empty, { }, { }],
        [PIN_BOX.empty, PIN_BOX.missed, PIN_BOX.empty]
    ];

    expect(createWeightedBoard(WEIGHTS, board, PIN_BOX)).toStrictEqual([
        [WEIGHTS.DAMAGE, WEIGHTS.RANDOM, WEIGHTS.NONE],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.NONE, WEIGHTS.RANDOM]
    ])
});

test("Picks last square of a row of empty squares of a specified length (ideal case)", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.NONE],
        [WEIGHTS.RANDOM, WEIGHTS.NONE, WEIGHTS.RANDOM],
        [WEIGHTS.NONE, WEIGHTS.RANDOM ,WEIGHTS.RANDOM],
    ];

    expect(bustRows(2, weightedBoard, WEIGHTS)).toStrictEqual([
        [WEIGHTS.RANDOM, WEIGHTS.BUST, WEIGHTS.NONE],
        [WEIGHTS.RANDOM, WEIGHTS.NONE, WEIGHTS.RANDOM],
        [WEIGHTS.NONE, WEIGHTS.RANDOM, WEIGHTS.BUST]
    ]);
});

test("Picks last square of a column of empty squares of a specified length (ideal case)", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.NONE],
        [WEIGHTS.RANDOM, WEIGHTS.NONE, WEIGHTS.RANDOM],
        [WEIGHTS.NONE, WEIGHTS.RANDOM ,WEIGHTS.RANDOM],
    ];

    expect(bustColumns(2, weightedBoard, WEIGHTS)).toStrictEqual([
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.NONE],
        [WEIGHTS.BUST, WEIGHTS.NONE, WEIGHTS.RANDOM],
        [WEIGHTS.NONE, WEIGHTS.RANDOM, WEIGHTS.BUST]
    ]);
});

test("Picks last square of a row of empty squares of a specified length (ignores already existing busting shots)", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.BUST],
        [WEIGHTS.RANDOM, WEIGHTS.BUST, WEIGHTS.RANDOM],
        [WEIGHTS.NONE, WEIGHTS.RANDOM ,WEIGHTS.RANDOM],
    ];

    expect(bustRows(2, weightedBoard, WEIGHTS)).toStrictEqual([
        [WEIGHTS.RANDOM, WEIGHTS.BUST, WEIGHTS.BUST],
        [WEIGHTS.RANDOM, WEIGHTS.BUST, WEIGHTS.RANDOM],
        [WEIGHTS.NONE, WEIGHTS.RANDOM, WEIGHTS.BUST]
    ]);
});

test("Picks last square of a column of empty squares of a specified length (ignores already existing busting shots)", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.BUST],
        [WEIGHTS.RANDOM, WEIGHTS.BUST, WEIGHTS.RANDOM],
        [WEIGHTS.NONE, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ];

    expect(bustColumns(2, weightedBoard, WEIGHTS)).toStrictEqual([
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.BUST],
        [WEIGHTS.BUST, WEIGHTS.BUST, WEIGHTS.RANDOM],
        [WEIGHTS.NONE, WEIGHTS.RANDOM, WEIGHTS.BUST]
    ]);
});