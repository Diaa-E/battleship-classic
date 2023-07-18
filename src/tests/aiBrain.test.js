import {expect, jest, test} from '@jest/globals';
import {bustRows, bustColumns, createWeightedBoard, getDamagedSquares, scanRow, scanColumn, getAllMoves, getLongestShipAlive} from '../aiBrain';
import { Ship } from '../ship';

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

    expect(bustColumns(2, weightedBoard, WEIGHTS, 5)).toStrictEqual([
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.BUST],
        [WEIGHTS.BUST, WEIGHTS.BUST, WEIGHTS.RANDOM],
        [WEIGHTS.NONE, WEIGHTS.RANDOM, WEIGHTS.BUST]
    ]);
});

test("Damaged squares are retreived correctly (parsing starts with rows)", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.NONE],
        [WEIGHTS.HUNT, WEIGHTS.BUST, WEIGHTS.NONE],
        [WEIGHTS.DAMAGE, WEIGHTS.DAMAGE, WEIGHTS.NONE]
    ];

    expect(getDamagedSquares(weightedBoard, WEIGHTS)).toStrictEqual(["1,0", "0,2", "1,2"]);
});

test("Marks right and left of a single damaged square", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ];

    expect(scanRow("1,1", weightedBoard, WEIGHTS, 3)).toStrictEqual([
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.HUNT, WEIGHTS.DAMAGE, WEIGHTS.HUNT],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ])
});

test("Marks right and left of multiple damaged squares", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.DAMAGE, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ];

    expect(scanRow("1,1", weightedBoard, WEIGHTS, 3)).toStrictEqual([
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.HUNT, WEIGHTS.DAMAGE, WEIGHTS.DAMAGE, WEIGHTS.HUNT],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ])
});

test("Marks top and bottom of a single damaged square", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ];

    expect(scanColumn("1,1", weightedBoard, WEIGHTS, 3)).toStrictEqual([
        [WEIGHTS.RANDOM, WEIGHTS.HUNT, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.HUNT, WEIGHTS.RANDOM],
    ])
});

test("Marks top and bottom of multiple damaged squares", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ];

    expect(scanColumn("1,1", weightedBoard, WEIGHTS, 3)).toStrictEqual([
        [WEIGHTS.RANDOM, WEIGHTS.HUNT, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM, WEIGHTS.HUNT, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ])
});

test("Sorts weighted board into 3 sets of priority encoded coordinates", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM, WEIGHTS.BUST, WEIGHTS.HUNT],
        [WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.HUNT],
        [WEIGHTS.BUST, WEIGHTS.DAMAGE, WEIGHTS.RANDOM],
    ];

    expect(getAllMoves(weightedBoard, WEIGHTS)).toStrictEqual({
        high: ["2,0", "2,1"],
        medium: ["0,2", "1,0"],
        low: ["0,0", "0,1", "2,2"]
    })
});

test("Returns the first ship in list that isn't sunk", () => {

    const fleet = [
        Ship("boat", 3, [0, 0], true),
        Ship("boat2", 2, [1, 0], true)
    ];

    expect(getLongestShipAlive(fleet)).toStrictEqual(3);
});

test("Skips first ship if it's sunk", () => {

    const fleet = [
        Ship("boat", 3, [0, 0], true),
        Ship("boat2", 2, [1, 0], true)
    ];

    fleet[0].receiveDamage([0, 0]);
    fleet[0].receiveDamage([0, 1]);
    fleet[0].receiveDamage([0, 2]);

    expect(getLongestShipAlive(fleet)).toStrictEqual(2);
});