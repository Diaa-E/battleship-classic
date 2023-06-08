import {expect, jest, test} from '@jest/globals';
import { Ship } from "../ship";

// 1
test("Ship's position is generated correctly.", () => {
    
    const carrier = Ship("Carrier", 5, [0, 3], true);
    
    expect(carrier.position.map(element => element.coord)).toStrictEqual(["0,3", "0,4", "0,5", "0,6", "0,7"]);
});

// 2 
test("Ship's length is assigned correctly.", () => {

    const carrier = Ship("Carrier", 5, [0, 3], true);

    expect(carrier.LENGTH).toStrictEqual(5);
});

// 3
test("Ship's name is assigned correctly", () => {

    const carrier = Ship("Carrier", 5, [0, 3], true);

    expect(carrier.NAME).toStrictEqual("Carrier");
});

// 4
test("Ship's pivot is assigned correctly.", () => {

    const carrier = Ship("Carrier", 5, [0, 3], true);

    expect(carrier.pivot).toStrictEqual([0,3]);
});

// 5
test("Draws ship vertically.", () => {

    const carrier = Ship("Carrier", 5, [0, 3], true);

    expect(carrier.position.map(element => element.coord)).toStrictEqual(["0,3", "0,4", "0,5", "0,6", "0,7"]);
});

// 6
test("Draws ship horizontally.", () => {

    const carrier = Ship("Carrier", 5, [0, 3], false);

    expect(carrier.position.map(element => element.coord)).toStrictEqual(["0,3", "1,3", "2,3", "3,3", "4,3"]);
});

// 7
test("Ship receives a single hit and assigns it to correct position pairs.", () => {

    const carrier = Ship("Carrier", 5, [1, 3], true);
    carrier.receiveDamage([[1, 5]]);

    expect(carrier.position[carrier.position.indexOf["1,5"]].isDamaged).toStrictEqual(true);
});

// 8
test("Ship receives multiple hits and assigns them to correct position pairs.", () => {

    const carrier = Ship("Carrier", 5, [1, 3], false);
    carrier.receiveDamage([[1, 5], [1, 3], [1, 2]]);

    expect(carrier.position[carrier.position.indexOf["1,5"]].isDamaged).toStrictEqual(true);
    expect(carrier.position[carrier.position.indexOf["1,3"]].isDamaged).toStrictEqual(true);
    expect(carrier.position[carrier.position.indexOf["1,2"]].isDamaged).toStrictEqual(true);
});

// 9
test("Ship is announced sunk when all squares are damaged.", () => {

    const carrier = Ship("Carrier", 5, [0, 3], true);
    carrier.receiveDamage([[0, 3], [0, 4], [0, 5], [0, 6], [0, 7]]);

    expect(carrier.isSunk).toStrictEqual(true);
});

// 10
test("Ship moves to a new position.", () => {

    const carrier = Ship("Carrier", 5, [0, 3], true);
    carrier.changePosition([1, 3], false)
    
    expect(carrier.position.map(element => element.coord)).toStrictEqual(["1,3", "1,4", "1,5", "1,6", "1,7"]);
});

// 11
test("Ship rotates -90d.", () => {

    const carrier = Ship("Carrier", 5, [0, 3], false);
    carrier.changePosition([0, 3], true)

    expect(carrier.position.map(element => element.coord)).toStrictEqual(["0,3", "0,4", "0,5", "0,6", "0,7"]);
});

// 12
test("Ship rotates +90d.", () => {

    const carrier = Ship("Carrier", 5, [0, 3], true);
    carrier.changePosition([0, 3], true)

    expect(carrier.position.map(element => element.coord)).toStrictEqual(["0,3", "1,3", "2,3", "3,3", "4,3"]);
});