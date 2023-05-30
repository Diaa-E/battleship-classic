
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

    1. `position[]`: ship's current position, encoded as a string "x,y".
    2. `isVertical`: ship's orientation.
    3. `damage[]`: ship's damaged squares, encoded as a string "x,y".
    4. `isSunk`: ship's status.
    5. `name`: ship's name/class.
    6. `length`: ship's length.
    7. `receiveDamage(hits[])`: register damaged squares by pushing encoded position into `damage[]`.
    8. `changePosition(newPivot, rotate)`: update ship's position.
    10. `pivot`: ship's origin square.
    11. `_drawShip(newPivot)`: generate new position array from given data.
    
* ### Gameboard Object

    1. `board`: gameboard's grid, includes ships, empty squares, ship squares, missed shots, damaged ship squares and sunk ship squares. Used to render the board.
    2. `boardTokens{}`: contains all the symbols used to build. the board. `empty, hit, sunk, missed, ship`
    3. `checkHits(newShots)`: Check whether a shot hit a ship.
    4. `rotateShip(ship)`: toggle a ship's rotation to -90d or 0d around its pivot.
    5. `moveShip(ship, newPivot)`: move a ship to a new location.
    6. `locationConflict(ship, shipLength)`: checks if the ship is clear to move or rotate.
    7. `updateBoard()`: update each board square.
    8. `createShips(newShipList)`: creates ships based on list passed from main game function.
    9. `shipList{}`: keeps a list of ships for the creation process. each key has `name` and `length`.