
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
        1. `position[]`: ship's current position, ~~encoded as a string "x,y"~~.
        2. `isVertical`: ship's orientation.
        3. `damage[]`: ship's damaged squares, ~~encoded as a string "x,y"~~.
        4. `isSunk`: ship's status.
        5. `name`: ship's name/class (i.e Cruiser).
        6. `length`: ship's length.
        7. `pivot`: ship's origin square.

    * #### **Functions**
        1. `receiveDamage(hits[])`: register damaged squares by pushing encoded position into `damage[]`.
        2. `changePosition(newPivot, rotate)`: update ship's position.
        3. `_drawShip(newPivot)`: generate new position array from given data.
    
* ### Gameboard Object

    * #### **Properties**
        1. `_TOKENS{empty, damaged, missed}`: characters used to populate the gameboard 2D array.
        2. `board[]`: all gameboard squares held in a 2D array. **Note: X and Y are inverted when calling a square from the array (i.e `board[y][x]`)**.
        3. `_ships[]`: reference to all ships.

    * #### **Functions**
        1. `updateBoard()`: add new changes to the board array.
        2. `updateEmpty()`: assign the `_TOKENS.empty` to empty squares on the board.
        3. `updateShip()`: assign a reference of each ship to its corresponding board squares.
        4. `updateDamage()`: assign the `_TOKENS.damaged` to damaged ship squares.
        5. `updateMissed()`: assign the `_TOKENS.missed` to missed shots on the board.
        6. `moveShip(ship, newPivot, rotate)`: move or rotate ship by calling `ship.changePosition(newPivot, rotate)` after checking for illegal positions.
        7. `_positionConflict(shipLength, newPivot)`: returns `true` if the new position overlaps with another ship or is outside the board.
        8. `_rotationConflict(shipLength, newPivot, isVertical)`: returns `true` if the new rotation overlaps with another ship or is outside the board.
        9. `gameOver()`: returns `true` if all `ships[i].isSunk` are `true`.
        10. `_createShips(shipList[{name, length}])`: creates ship objects and pushes them into `_ships[]` based on requirement list passed from the player object.
        11. `_initBoard(size, shipList)`: create board array, create ships and place them on the board.