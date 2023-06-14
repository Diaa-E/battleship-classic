import {expect, jest, test} from '@jest/globals';
import {
    generatePosition,
    encodeCoord,
    decodeCoord,
    findCoordPair,
    checkSunk
} from '../positionUtility';

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