import {expect, jest, test} from '@jest/globals';
import { Ship } from "../ship";

const carrier = Ship("carrier", 5, [0, 0], true);

test("Ship's name is initialized correctly.", () => {

    expect(carrier.NAME).toStrictEqual("carrier");
});

test("Ship's length is initialized correctly.", () => {

    expect(carrier.LENGTH).toStrictEqual(5);
});

test("Ship's orientation is initialized correctly", () => {

    expect(carrier.isVertical).toStrictEqual(true);
});

test("Ship's pivot is initialized correclty.", () => {

    expect(carrier.pivot).toStrictEqual([0, 0]);
});

test("Ship's position is initialized correctly.", () => {

    expect(carrier.position.map(pair => pair.coord)).toStrictEqual(["0,0", "0,1", "0,2", "0,3", "0,4"]);
    expect(carrier.position.map(pair => pair.isDamaged)).toStrictEqual([false, false, false, false, false]);
});

test("Ship changes position correctly", () => {

    carrier.changePosition([4, 4], false);

    expect(carrier.position.map(pair => pair.coord)).toStrictEqual(["4,4", "4,5", "4,6", "4,7", "4,8"]);
});

test("Ship rotates correctly.", () => {

    carrier.changePosition(carrier.pivot, true);

    expect(carrier.position.map(pair => pair.coord)).toStrictEqual(["0,0", "1,0", "2,0", "3,0", "4,0"]);
});