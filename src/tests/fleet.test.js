import {expect, jest, test} from '@jest/globals';
import { createFleet, updateFleet, checkFleetDestroyed } from '../fleet';
import { Ship } from '../ship';

test("Fleet is initialized vertically in a row starting at (0, 0)", () => {

    const shipList = [
        {
            shipName: "carrier",
            shipLength: 5
        },
        {
            shipName: "submarine",
            shipLength: 3
        },
        {
            shipName: "destroyer",
            shipLength: 2
        }
    ];

    expect(createFleet(shipList).map(ship => ship.position.map(position => position.coord))).toStrictEqual([
        ["0,0", "0,1", "0,2", "0,3", "0,4"],
        ["1,0", "1,1", "1,2"],
        ["2,0", "2,1"],
    ]);

    expect(createFleet(shipList).map(ship => ship.NAME)).toStrictEqual(["carrier", "submarine", "destroyer"]);
});

test("Fleet is placed correctly on game board", () => {

    const boat = Ship("boat", 2, [1,0], false);
    const emptyPin = "E";
    const board = [
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin]
    ];

    expect(updateFleet([boat], board, "D")).toStrictEqual([
        [emptyPin, boat, boat, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin]
    ]);
});

test("Damaged fleet is placed correctly on game board", () => {

    const boat = Ship("boat", 2, [1,0], false);
    boat.receiveDamage([1, 0]);

    const emptyPin = "E";
    const damagedPin = "D";
    const board = [
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin]
    ];

    expect(updateFleet([boat], board, damagedPin)).toStrictEqual([
        [emptyPin, damagedPin, boat, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin],
        [emptyPin, emptyPin, emptyPin, emptyPin]
    ]);
});

test("Fleet is destroyed when all ships are sunk", () => {

    const boat = Ship("boat", 2, [0,0], true);
    const boat2 = Ship("boat", 3, [1,0], true);
    boat.receiveDamage([0, 0]);
    boat.receiveDamage([0, 1]);
    boat2.receiveDamage([1, 0]);
    boat2.receiveDamage([1, 1]);
    boat2.receiveDamage([1, 2]);

    expect(checkFleetDestroyed([boat, boat2])).toStrictEqual(true);
});

test("Fleet is not destroyed when some ships are sunk", () => {

    const boat = Ship("boat", 2, [0,0], true);
    const boat2 = Ship("boat", 3, [1,0], true);
    boat.receiveDamage([0, 0]);
    boat.receiveDamage([0, 1]);

    expect(checkFleetDestroyed([boat, boat2])).toStrictEqual(false);
})