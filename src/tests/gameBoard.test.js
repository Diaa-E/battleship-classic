import {expect, jest, test} from '@jest/globals';
import {GameBoard, emptyBoard} from "../gameBoard";

test("EmptyBoard returns a square 2D array filled with an empty pin character", () => {

    expect(emptyBoard(3, "E")).toStrictEqual([["E", "E", "E"], ["E", "E", "E"], ["E", "E", "E"]]);
});