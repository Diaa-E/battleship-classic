import {expect, jest, test} from '@jest/globals';
import {GameBoard, EmptyBoard, pinBox} from "../gameBoard";

test("EmptyBoard returns a square 2D array filled with an empty pin character", () => {

    expect(EmptyBoard(3, "E")).toStrictEqual([["E", "E", "E"], ["E", "E", "E"], ["E", "E", "E"]]);
});

test("pinBox returns an object with pins for empty, missed and hit squares", () => {

    expect(pinBox("E", "M", "H")).toStrictEqual({empty: "E", missed: "M", hit: "H"});
});