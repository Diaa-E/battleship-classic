import {expect, jest, test} from '@jest/globals';
import { encodeCoord, decodeCoord } from "../coordConverter";

test("Encodes coord to a 'x,y' format.", () => {

    expect(encodeCoord([2, 3])).toStrictEqual("2,3");
});

test("Decodes coord to a [x, y] format.", () => {

    expect(decodeCoord("5,4")).toStrictEqual([5, 4]);
});