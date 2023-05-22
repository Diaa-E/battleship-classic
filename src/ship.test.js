import {expect, jest, test} from '@jest/globals';
import { ship } from "./ship";

test("Evaluates position", () => {
    
    const carrier = ship("Carrier", 5, [0, 3]);
    
    expect(carrier.position).toStrictEqual([[0, 3], [0, 4], [0, 5], [0, 6], [0, 7]]);
});

test("Registers a single hit", () => {

    const carrier = ship("Carrier", 5, [0, 3]);

    expect(carrier.checkHits([[0, 5]])).toEqual([[0, 5]]);
});

test("Registers multiple hits", () => {

    const carrier = ship("Carrier", 5, [0, 3]);

    expect(carrier.checkHits([[0, 5]])).toEqual([[0, 5], [0, 4], [0, 6]]);
});

test("Ignores missed shots", () => {

    const carrier = ship("Carrier", 5, [0, 3]);

    expect(carrier.checkHits([[0, 0]])).toEqual([]);
});

test("Moves to a new location", () => {

    const carrier = ship("Carrier", 5, [0, 3]);

    expect(carrier.move([2, 3])).toEqual([[2, 3], [2, 4], [2, 5], [2, 6], [2, 7]]);
});

test("Sinks when all squares have been hit", () => {

    const carrier = ship("Carrier", 5, [0, 3]);
    carrier.checkHits([[0, 3], [0, 4], [0, 5], [0, 6], [0, 7]]);

    expect(carrier.isSunk).toBeTruthy();
});