import {expect, jest, test} from '@jest/globals';
import { EmptyBoard, PinBox, processShot, calculateAvailableShots} from "../gameBoard";
import { Ship } from '../ship';
import { updateFleet } from '../fleet';

test("EmptyBoard returns a square 2D array filled with an empty pin character", () => {

    expect(EmptyBoard(3, "E")).toStrictEqual([["E", "E", "E"], ["E", "E", "E"], ["E", "E", "E"]]);
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

    const fleet = {ships: [
        Ship("boat", 2, [0, 0], true),
        Ship("boat2", 3, [1, 0], true)
    ]};

    expect(calculateAvailableShots(fleet)).toStrictEqual(2);

    fleet.ships[0].receiveDamage([0, 0]);
    fleet.ships[0].receiveDamage([0, 1]);

    expect(calculateAvailableShots(fleet)).toStrictEqual(1);
});