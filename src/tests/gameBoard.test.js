import {expect, jest, test} from '@jest/globals';
import {GameBoard, EmptyBoard, PinBox, processShot, calculateAvailableShots, getLongestShipAlive} from "../gameBoard";
import { Ship } from '../ship';
import { updateFleet } from '../fleet';

test("EmptyBoard returns a square 2D array filled with an empty pin character", () => {

    expect(EmptyBoard(3, "E")).toStrictEqual([["E", "E", "E"], ["E", "E", "E"], ["E", "E", "E"]]);
});

test("pinBox returns an object with pins for empty, missed and hit squares", () => {

    expect(PinBox("E", "M", "H", "S")).toStrictEqual({empty: "E", missed: "M", hit: "H", sunk: "S"});
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

test("Number of available shots gets reduced when a ship is sunk", () => {

    const fleet = [
        Ship("boat", 2, [0, 0], true),
        Ship("boat2", 3, [1, 0], true)
    ];

    expect(calculateAvailableShots(fleet)).toStrictEqual(2);

    fleet[0].receiveDamage([0, 0]);
    fleet[0].receiveDamage([0, 1]);

    expect(calculateAvailableShots(fleet)).toStrictEqual(1);
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