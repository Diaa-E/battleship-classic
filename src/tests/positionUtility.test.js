import {expect, jest, test} from '@jest/globals';
import {
    generatePosition,
    encodeCoord,
    decodeCoord,
    findCoordPair,
    checkSunk,
    positionConflict,
} from '../positionUtility';
import { Ship } from '../ship';

test("generates position correctly", () => {

    expect(generatePosition([0, 0], true, 5).map(element => element.coord)).toStrictEqual(["0,0", "0,1", "0,2", "0,3", "0,4"]);
    expect(generatePosition([0, 0], true, 5).map(element => element.isDamaged)).toStrictEqual([false, false, false, false, false]);
});

test("Encodes coord to a 'x,y' format.", () => {

    expect(encodeCoord([2, 3])).toStrictEqual("2,3");
});

test("Decodes coord to a [x, y] format.", () => {

    expect(decodeCoord("5,4")).toStrictEqual([5, 4]);
});

test("Searches for a coordinate pair in position array", () => {

    const position = [
        {
            coord: "1,3",
            isDamaged: false
        },
        {
            coord: "4,5",
            isDamaged: false
        },
        {
            coord: "0,2",
            isDamaged: false
        }
    ];
    expect(findCoordPair([0, 2], position)).toStrictEqual(position[2])
});

test("Ship is sunk only if all squares are hit", () => {

    const positionSunk = [
        {
            coord: "1,3",
            isDamaged: true
        },
        {
            coord: "4,5",
            isDamaged: true
        },
        {
            coord: "0,2",
            isDamaged: true
        }
    ];

    const position = [
        {
            coord: "1,3",
            isDamaged: true
        },
        {
            coord: "4,5",
            isDamaged: false
        },
        {
            coord: "0,2",
            isDamaged: true
        }
    ];

    expect(checkSunk(positionSunk)).toStrictEqual(true);
    expect(checkSunk(position)).toStrictEqual(false);
});

test("Position conflict is detected when moving a ship over another ship", () => {

    const boat = Ship("boat", 2, [0, 0], true);
    const anotherBoat = Ship("another boat", 3, [1, 0], true);
    const emptyPin = "E"
    const board = [
        [boat, anotherBoat, emptyPin, emptyPin],
        [boat, anotherBoat, emptyPin, emptyPin],
        [emptyPin, anotherBoat, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin]
    ];

    expect(positionConflict(boat, [1, 0], board, emptyPin, 4)).toStrictEqual(true);
});

test("Position conflict is detected when moving a ship out of the board's boundaries", () => {

    const boat = Ship("boat", 2, [0, 0], true);
    const emptyPin = "E"
    const board = [
        [boat, emptyPin, emptyPin, emptyPin],
        [boat, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin]
    ];

    expect(positionConflict(boat, [0, 10], board, emptyPin, 4)).toStrictEqual(true);
    expect(positionConflict(boat, [0, 4], board, emptyPin, 4)).toStrictEqual(true);
    expect(positionConflict(boat, [10, 0], board, emptyPin, 4)).toStrictEqual(true);
    expect(positionConflict(boat, [4, 0], board, emptyPin, 4)).toStrictEqual(true);
    expect(positionConflict(boat, [3, 3], board, emptyPin, 4)).toStrictEqual(true);
});

test("No position conflict is detected when moving a ship to an empty place", () => {

    const boat = Ship("boat", 2, [0, 0], true);
    const emptyPin = "E"
    const board = [
        [boat, emptyPin, emptyPin, emptyPin],
        [boat, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin]
    ];

    expect(positionConflict(boat, [0, 2], board, emptyPin, 4)).toStrictEqual(false);

});

test("No position conflict is detected when moving a ship over its old position", () => {

    const boat = Ship("boat", 2, [0, 0], true);
    const emptyPin = "E"
    const board = [
        [boat, emptyPin, emptyPin, emptyPin],
        [boat, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin]
    ];

    expect(positionConflict(boat, [1, 1], board, emptyPin, 4)).toStrictEqual(false);
});