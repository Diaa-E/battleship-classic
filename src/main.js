"use strict";

import { Game } from "./game";
import { ConsoleScreen, uiScreen } from "./screen";
import "./css/style.css";

newGame();

function newGame()
{
    const game = Game();
    const screen = uiScreen();
    screen.loadGameSettings();
    screen.openGameSettings();

    document.addEventListener("gameSettingsChanged", (e) => {

        game.init(e.detail.playerName, e.detail.gameMode);
        screen.loadFleetEditor(game.rules.BOARD_SIZE);
        screen.openFleetEditor();
        screen.refreshEditorBoard(game.humanBoard);
        screen.highLightShip(game.humanFleet.ships[0].position);
    });

    document.addEventListener("fleetEditorClosed", (e) => {

        screen.loadMainUi(game.rules.BOARD_SIZE);
        screen.setAiName(game.aiName);
        screen.setPlayerName(game.humanName);
        screen.initBoards(game.humanBoard, game.aiBoard);
        screen.disableFireButton();
        screen.initBoards(game.humanBoard, game.aiBoard);
    });

    document.addEventListener("currentShipChanged", (e) => {

        game.humanFleet.ships.forEach(ship => {

            screen.unhighLightShip(ship.position);
        });
        screen.highLightShip(game.humanFleet.ships[e.detail.shipIndex].position);
    });

    document.addEventListener("shipMoved", (e) => {

        game.movePlayerShip(game.humanFleet.ships[e.detail.shipIndex].position[0].coord, e.detail.newPivot);
        screen.refreshEditorBoard(game.humanBoard);
        screen.highLightShip(game.humanFleet.ships[e.detail.shipIndex].position);
    });

    document.addEventListener("shipRotated", (e) => {

        game.rotatePlayerShip(game.humanFleet.ships[e.detail.shipIndex].position[0].coord);
        screen.refreshEditorBoard(game.humanBoard);
        screen.highLightShip(game.humanFleet.ships[e.detail.shipIndex].position);
    });

    document.addEventListener("fleetRandomized", (e) => {

        game.players.human.randomizeFleet();
        screen.refreshEditorBoard(game.humanBoard);
        screen.highLightShip(game.humanFleet.ships[e.detail.shipIndex].position);
    });
    // game.humanFleet.ships.forEach(ship => {

    //     ship.position.forEach(square => {

    //         screen.refreshPlayerBoard(game.pinBox, game.humanBoard, decodeCoord(square.coord));
    //     });
    // });
}

function newConsoleGame()
{
    const game = Game("d", 0);
    const screen = ConsoleScreen(game.pinBox);

    screen.refresh(game.humanBoard, game.aiBoard, game.aiTurn);

    while (!game.gameOver)
    {
        if (game.aiTurn)
        {
            game.aiPlay();
        }
        else
        {
            const attacks = [];

            for (let i = 0; i < game.humanAvailableShots; i++)
            {
                attacks.push(screen.getUserInput(`Plot your #${i} shot in the x,y format:`));
            }

            game.humanPlay(attacks);
        }

        screen.refresh(game.humanBoard, game.aiBoard, game.aiTurn);
    }

    console.log(`${game.winner} wins!`);
    console.log(`${game.aiName} fired ${game.getTotalShots().ai} shots.`);
    console.log(`${game.humanName} fired ${game.getTotalShots().human} shots.`);
}