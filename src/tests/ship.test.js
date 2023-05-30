import {expect, jest, test} from '@jest/globals';
import { ship } from "../ship";

test("Initializes position", () => {
    
    const carrier = ship("Carrier", 5, [0, 3], true);
    
    expect(carrier.position).toStrictEqual([[0, 3], [0, 4], [0, 5], [0, 6], [0, 7]]);
});

test("Moves to a new location", () => {

    const carrier = ship("Carrier", 5, [0, 3], true);
    carrier.changePosition([2, 3], false);

    expect(carrier.position).toStrictEqual([[2, 3], [2, 4], [2, 5], [2, 6], [2, 7]]);
});

test("Rotates -90d", () => {

    const carrier = ship("Carrier", 5, [1, 3], true);
    carrier.changePosition([1, 3], true);

    expect(carrier.position).toStrictEqual([[1, 3], [2, 3], [3, 3], [4, 3], [5, 3]]);
});

test("Rotates +90d", () => {

    const carrier = ship("Carrier", 5, [1, 3], false);
    carrier.changePosition([1, 3], true);

    expect(carrier.position).toStrictEqual(["1,3", "1,4", "1,5", "1,6", "1,7"]);
});

test("Registers a single hit", () => {

    const carrier = ship("Carrier", 5, [0, 3]);
    carrier.receiveDamage([[0, 5]]);

    expect(carrier.damage).toStrictEqual([[0, 5]]);
});

test("Registers multiple hits", () => {

    const carrier = ship("Carrier", 5, [0, 3]);
    carrier.receiveDamage([[0, 5], [0, 4], [0, 6]]);
    
    expect(carrier.damage).toStrictEqual([[0, 5], [0, 4], [0, 6]]);
});

test("Ignores missed shots", () => {

    const carrier = ship("Carrier", 5, [0, 3]);
    carrier.receiveDamage([[0, 0], [0, 5]]);

    expect(carrier.damage).toStrictEqual([[0, 5]]);
});

test("Sinks when all squares have been hit", () => {

    const carrier = ship("Carrier", 5, [0, 3]);
    carrier.receiveDamage([[0, 3], [0, 4], [0, 5], [0, 6], [0, 7]]);

    expect(carrier.isSunk).toStrictEqual(true);
});