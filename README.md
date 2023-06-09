
# Battleship Classic

Battleship game with the original board game's rules.

----

## Rules  
1. Each Player has 5 ships :

    * Carrier (5 squares)
    * Battleship (4 squares)
    * Cruiser (3 squares)
    * Submarine (3 squares)
    * Destroyer (2 squares)  
  
2. Each player announces their ship's destruction.

3. Regular mode:
    * Each player gets to fire one shot at the opponent, hits and misses are announced.
    * Players take turns firing single shots, no extra shots are granted for successful hits.  

4. Advanced mode (Salvo):
    * Each player fires five shots at once (a salvo), after all the shots are marked, hits and misses are announced.
    * Players take turns each firing a salvo per turn.
    * Each player's salvo is reduced by one shot for each sunk ship of their own fleet (maximum 5, minimum 1).  

5. Ships may be placed horizontally or vertically but never in a diagonal.

6. Ships cannot overlap.

7. Ships cannot bend.

8. Ships do not require a proxy space (i.e can be placed right next to each other).

9. The first player to destroy their opponent's fleet wins.

-----

## Design   

* ### Ship Object  

    * #### **Properties**
        1. `position[]`: an array of objects, each has a `coord: "x,y"` and `isDamaged: boolean`.
        2. `isVertical`: ship's orientation.
        3. `isSunk`: ship's status.
        4. `name`: ship's name/class (i.e Cruiser).
        5. `length`: ship's length.
        6. `pivot`: ship's origin square.

    * #### **Functions**
        1. `receiveDamage(hits[])`: register damaged squares by pushing encoded position into `damage[]`.
        2. `changePosition(newPivot, rotate)`: update ship's position.
        3. `_drawShip(newPivot)`: generate new position array from given data.
        4. `_encodeCoord(newCoord)`: takes an `[x, y]` pair and encodes it into the `"x,y"` format for easier comparison.

    * #### **Tests**
        1. Ship's position is generated correctly.
        2. Ship's length is assigned correctly.
        3. Ship's name is assigned correctly.
        4. Ship's pivot is assigned correctly.
        5. Draws ship vertically.
        6. Draws ship horizontally.
        7. Ship receives a single hit and assigns it to correct position pairs.
        8. Ship receives multiple hits and assigns them to correct position pairs.
        9. Ship is announced sunk when all squares are damaged.
        10. Ship is not announced sunk if at least one square is intact
        11. Ship moves to a new position.
        12. Ship rotates -90d.
        13. Ship rotates +90d.

* ### Gameboard Object

    * #### **Properties**
        1. `_PINS{empty, damaged, missed}`: characters used to populate the gameboard 2D array.
        2. `board[]`: all gameboard squares held in a 2D array. **Note: X and Y are inverted when calling a square from the array (i.e `board[y][x]`)**.
        3. `_ships[]`: reference to all ships.

    * #### **Functions**
        1. `updateBoard()`: add new changes to the board array.
        2. `updateEmpty()`: assign the `_TOKENS.empty` to empty squares on the board.
        3. `updateShip()`: assign a reference of each ship to its corresponding board squares.
        4. `updateDamage()`: assign the `_TOKENS.damaged` to damaged ship squares.
        5. `updateMissed()`: assign the `_TOKENS.missed` to missed shots on the board.
        6. `moveShip(ship, newPivot)`: move or rotate ship by calling `ship.changePosition(newPivot, rotate)` after checking for illegal positions.
        7. `_positionConflict(shipLength, newPivot)`: returns `true` if the new position overlaps with another ship or is outside the board.
        8. `_rotationConflict(shipLength, newPivot, isVertical)`: returns `true` if the new rotation overlaps with another ship or is outside the board.
        9. `gameOver()`: returns `true` if all `ships[i].isSunk` are `true`.
        10. `_createShips(shipList[{name, length}])`: creates ship objects and pushes them into `_ships[]` based on requirement list passed from the player object.
        11. `_initBoard(size, shipList)`: create board array, create ships and place them on the board.
        12. `receiveAttack(hits[])`: evaluates each hit in a salvo.
        13. `_gameOver()`: Checks if the wntire fleet is sunk.
        14. `_decodeCoord(coord)`: converts coordinate pair from `"x,y"` format to `[x, y]`.
        15. `rotateShip(ship)`: rotates ship if no rotation conflict is detected.
        16. `_rotationConflict()`: checks for rotation conflict.
        17. `getSquareAt(coord)`: returns board element at specified coordinate pair, no need to switch x and y when traversing `_board`.

    * #### **Tests**
        1. Board places ships vertically next to each other starting at (0, 0) after object is initialized.
        2. Board handles missed shots correctly.
        3. Board handles hit shots correctly.
        4. Board handles mixed (includes hits and misses) attack correctly.
        5. Board moves a ship to a new position.
        6. Board rotates a ship.
        7. Board does not move ship in case of position conflict.
        8. Board does not rotate ship in case of rotation conflict.
        9. Board moves a ship to a location along it's old position.
        10. Game is over when a board's entire fleet is sunk.