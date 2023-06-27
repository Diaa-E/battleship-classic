import {expect, jest, test} from '@jest/globals';
import { sortBoard } from '../aiBrain';

test("AI Brain sorts empty squares correctly", () => {

    const board = [
        ["E", "E", "E"],
        ["E", "E", "E"],
        ["E", "E", "E"],
    ];

    expect(sortBoard(board, "E", "D")).toStrictEqual({
        availableSquares: ["0,0", "0,1", "0,2", "1,0", "1,1", "1,2", "2,0", "2,1", "2,2"],
        damagedSquares: [],
        otherSquares: [],
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
        otherSquares: [],
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
        otherSquares: ["0,2", "1,0", "1,1", "1,2"],
    });
})