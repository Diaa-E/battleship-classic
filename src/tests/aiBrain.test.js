import {expect, jest, test} from '@jest/globals';
import { sortBoard, checkerEmptySquares } from '../aiBrain';

test("AI Brain sorts empty squares correctly", () => {

    const board = [
        ["E", "E", "E"],
        ["E", "E", "E"],
        ["E", "E", "E"],
    ];

    expect(sortBoard(board, "E", "D")).toStrictEqual({
        availableSquares: ["0,0", "0,1", "0,2", "1,0", "1,1", "1,2", "2,0", "2,1", "2,2"],
        damagedSquares: [],
    });
});

test("AI Brain sorts damaged squares correctly", () => {

    const board = [
        ["E", "D", "E"],
        ["D", "E", "D"],
        ["E", "E", "E"],
    ];

    expect(sortBoard(board, "E", "D")).toStrictEqual({
        availableSquares: ["0,0", "0,2", "1,1", "1,2", "2,0", "2,2"],
        damagedSquares: ["0,1", "1,0", "2,1"],
    })
});

test("AI Brain ignores ship and missed squares", () => {
    
    const board = [
        ["E", "M", "E"],
        ["D", { }, "D"],
        ["M", { }, "E"],
    ];

    expect(sortBoard(board, "E", "D")).toStrictEqual({
        availableSquares: ["0,0", "2,0", "2,2"],
        damagedSquares: ["0,1", "2,1"],
    });
});

test("AI Brain halves the gameboard by checkering", () => {

    const board = [
        ["E", "E", "E"],
        ["E", "E", "E"],
        ["E", "E", "E"],
    ];

    expect(checkerEmptySquares(board, "E", true)).toStrictEqual(["0,1", "1,0", "1,2", "2,1"]);
});

test("AI Brain halves the gameboard by checkering and ignores occupied squares", () => {

    const board = [
        ["E", "D", "E", "E"],
        [{ }, "E", "M", "E"],
        ["E", { }, "E", "E"],
        ["E", "E", "E", "E"],
    ];

    expect(checkerEmptySquares(board, "E", true)).toStrictEqual(["0,3", "2,3", "3,0", "3,2"]);
});