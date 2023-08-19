"use strict";

import { Game } from "./game";
import { ConsoleScreen, uiScreen } from "./screen";
import "./css/style.css";
import { encodeCoord } from "./positionUtility";

newGame();

function newGame()
{
    const game = Game();
    const screen = uiScreen();
    let availableShots;
    let encodedAttackCoords = [];

    screen.loadGameSettings();
    screen.openGameSettings();

    document.addEventListener("gameSettingsClosed", (e) => {

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

    document.addEventListener("playerAttackInbound", (e) => {

        screen.disableFireButton();
        game.humanPlay(encodedAttackCoords);
    });

    document.addEventListener("aiBoardChanged", (e) => {

        screen.refreshAiBoard(game.aiBoard, game.pinBox, e.detail.encodedAttackCoord, game.aiFleet.ships);
    });

    document.addEventListener("playerBoardChanged", (e) => {

        screen.refreshPlayerBoard(game.humanBoard, game.pinBox, e.detail.encodedAttackCoord, game.humanFleet.ships);
    });

    document.addEventListener("turnSwitched", (e) => {

        if (e.detail.aiTurn)
        {
            game.aiPlay();
        }
        else
        {
            encodedAttackCoords = [];
            availableShots = game.players.human.getAvailableShots();
        }
    });

    document.addEventListener("attackMarkToggled", (e) => {

        availableShots = game.players.human.getAvailableShots();

        if (e.detail.uiSquare.isMarked())
        {
            e.detail.uiSquare.unmark();
            const removeIndex = encodedAttackCoords.findIndex(element => element === encodeCoord(e.detail.decodedCoord));
            encodedAttackCoords.splice(removeIndex, 1);
            screen.disableFireButton();
            screen.updateRemainingShots(availableShots - encodedAttackCoords.length);
        }
        else
        {
            if (!(encodedAttackCoords.length === availableShots))
            {
                e.detail.uiSquare.mark();
                encodedAttackCoords.push(encodeCoord(e.detail.decodedCoord));

                if (encodedAttackCoords.length === availableShots) screen.enableFireButton();
                screen.updateRemainingShots(availableShots - encodedAttackCoords.length);
            }
        }
    });

    document.addEventListener("keydown", quickInit);

    function quickInit(e)
    {
        if (e.code === "NumpadDivide")
        {
            screen.closeGameSettings();
            game.init("Human", 1);
            screen.loadMainUi(game.rules.BOARD_SIZE);
            screen.setAiName(game.aiName);
            screen.setPlayerName(game.humanName);
            screen.initBoards(game.humanBoard, game.aiBoard);
            screen.disableFireButton();
            screen.initBoards(game.humanBoard, game.aiBoard);
            document.removeEventListener("keydown", quickInit);
        }
    }
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