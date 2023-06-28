import {expect, jest, test} from '@jest/globals';
import { checkerEmptySquares } from '../aiBrain';

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