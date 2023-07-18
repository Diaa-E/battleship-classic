"use strict";

import { Game } from "./game";
import { Screen } from "./screen";

newConsoleGame();

function newConsoleGame()
{
    const screen = Screen();
    const game = Game(screen.getUserInput("Enter your name"), +screen.getUserInput("Choose game mode:\n0 for normal \n1 for advanced"));
}