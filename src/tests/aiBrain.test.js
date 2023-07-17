import {expect, jest, test} from '@jest/globals';
import {bustRows, bustColumns, createWeightedBoard, getDamagedSquares, huntShips, connectDots } from '../aiBrain';

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

test("Connects dots if a damaged square is at a distance shorter than the longest ship alive (H)", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.DAMAGE,WEIGHTS.RANDOM, WEIGHTS.DAMAGE, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ];
    expect(connectDots("0,1", weightedBoard, WEIGHTS, 3)).toStrictEqual([
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.DAMAGE,WEIGHTS.HUNT, WEIGHTS.DAMAGE, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ]);
});

test("Returns false when no damaged squares exist at a distance shorter than the longest ship alive (H)", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.DAMAGE,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ];

    expect(connectDots("0,1", weightedBoard, WEIGHTS, 3)).toStrictEqual(false);
});

test("Ignores damaged squares at distance further than longest ship alive (H)", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.DAMAGE,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.DAMAGE],
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ];

    expect(connectDots("0,1", weightedBoard, WEIGHTS, 3)).toStrictEqual(false);
});

test("Ignores damaged squares at distance shorter than longest ship alive, but blocked by a used square", () => {

    const weightedBoard = [
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.DAMAGE,WEIGHTS.NONE, WEIGHTS.RANDOM, WEIGHTS.DAMAGE],
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
        [WEIGHTS.RANDOM,WEIGHTS.RANDOM, WEIGHTS.RANDOM, WEIGHTS.RANDOM],
    ];

    expect(connectDots("0,1", weightedBoard, WEIGHTS, 4)).toStrictEqual(false);
});