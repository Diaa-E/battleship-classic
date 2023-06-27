import {expect, jest, test} from '@jest/globals';
import {GameBoard, EmptyBoard, pinBox, processShot} from "../gameBoard";
import { Ship } from '../ship';
import { updateFleet } from '../fleet';

test("EmptyBoard returns a square 2D array filled with an empty pin character", () => {

    expect(EmptyBoard(3, "E")).toStrictEqual([["E", "E", "E"], ["E", "E", "E"], ["E", "E", "E"]]);
});

test("pinBox returns an object with pins for empty, missed and hit squares", () => {

    expect(pinBox("E", "M", "H")).toStrictEqual({empty: "E", missed: "M", hit: "H"});
});

test("A shot is marked as missed when the target is an empty square", () => {

    const board = [["E", "E"], ["E", "E"]];

    expect(processShot(board, [0, 0], [])).toStrictEqual([[0, 0]]);
});

test("A shot passes damage to ship if a ship exists at the target coordinates", () => {

    const boat = Ship("boat", 2, [0, 0], true);
    const board = [[boat, "E"], [boat, "E"]];

    expect(processShot(board, [0, 0], [])).toStrictEqual([]);
    expect(updateFleet([boat], board, "D")).toStrictEqual([["D", "E"], [boat, "E"]]);
});