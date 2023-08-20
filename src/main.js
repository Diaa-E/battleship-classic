"use strict";

import { Game } from "./game";
import { ConsoleScreen, uiScreen } from "./screen";
import "./css/style.css";
import { encodeCoord } from "./positionUtility";

newGame();

function newGame()
{
    const events = [
        {
            type: "gameSettingsClosed",
            handler: openFleetEditor,
        },
        {
            type: "fleetEditorClosed",
            handler: startGame,
        },
        {
            type: "currentShipChanged",
            handler: changeCurrentShip,
        },
        {
            type: "shipMoved",
            handler: moveCurrentShip,
        },
        {
            type: "shipRotated",
            handler: rotateCurrentShip,
        },
        {
            type: "fleetRandomized",
            handler: randomizeFleet,
        },
        {
            type: "playerAttackInbound",
            handler: handlePlayerAttack,
        },
        {
            type: "aiBoardChanged",
            handler: refreshAiBoard,
        },
        {
            type: "playerBoardChanged",
            handler: refreshPlayerBoard,
        },
        {
            type: "turnSwitched",
            handler: handleTurnSwitch
        },
        {
            type: "attackMarkToggled",
            handler: toggleAttackMark,
        },
        {
            type: "keydown",
            handler: quickInit,
        },
        {
            type: "gameOver",
            handler: endGame,
        },
        {
            type: "playAgain",
            handler: playAgain,
        }
    ]

    const game = Game();
    const screen = uiScreen();
    let availableShots;
    let encodedAttackCoords = [];
    
    openGameSettings();
    addAllEvents();
    
    function addAllEvents()
    {
        for (const event of events)
        {
            document.addEventListener(event.type, event.handler, false);
        }
    }

    function removeAllEvents()
    {
        events.forEach(event => {

            document.removeEventListener(event.type, event.handler);
        });
    }

    function playAgain()
    {
        location.reload();
    }

    function endGame(e)
    {
        screen.loadGameover();
        screen.openGameover();
        screen.setWinnerName(e.detail.winner);
        screen.setWinnerTotalShots(e.detail.winnerShots);
        screen.setLoserName(e.detail.loser);
        screen.setLoserTotalShots(e.detail.loserShots);
    }

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

    function handlePlayerAttack(e)
    {
        screen.disableFireButton();
        game.humanPlay(encodedAttackCoords);
    }

    function randomizeFleet(e)
    {
        game.players.human.randomizeFleet();
        screen.refreshEditorBoard(game.humanBoard);
        screen.highLightShip(game.humanFleet.ships[e.detail.shipIndex].position);
    }

    function moveCurrentShip(e)
    {
        game.movePlayerShip(game.humanFleet.ships[e.detail.shipIndex].position[0].coord, e.detail.newPivot);
        screen.refreshEditorBoard(game.humanBoard);
        screen.highLightShip(game.humanFleet.ships[e.detail.shipIndex].position);
    }

    function changeCurrentShip(e)
    {
        game.humanFleet.ships.forEach(ship => {

            screen.unhighLightShip(ship.position);
        });
        screen.highLightShip(game.humanFleet.ships[e.detail.shipIndex].position);
    }

    function openFleetEditor(e)
    {
        game.init(e.detail.playerName, e.detail.gameMode);
        screen.loadFleetEditor(game.rules.BOARD_SIZE);
        screen.openFleetEditor();
        screen.refreshEditorBoard(game.humanBoard);
        screen.highLightShip(game.humanFleet.ships[0].position);
    }

    function startGame(e)
    {
        screen.loadMainUi(game.rules.BOARD_SIZE);
        screen.setAiName(game.aiName);
        screen.setPlayerName(game.humanName);
        screen.initBoards(game.humanBoard, game.aiBoard);
        screen.disableFireButton();
        screen.initBoards(game.humanBoard, game.aiBoard);
    }

    function openGameSettings()
    {
        screen.loadGameSettings();
        screen.openGameSettings();    
    }

    function rotateCurrentShip(e)
    {
        game.rotatePlayerShip(game.humanFleet.ships[e.detail.shipIndex].position[0].coord);
        screen.refreshEditorBoard(game.humanBoard);
        screen.highLightShip(game.humanFleet.ships[e.detail.shipIndex].position);
    }

    function refreshAiBoard(e)
    {
        screen.refreshAiBoard(game.aiBoard, game.pinBox, e.detail.encodedAttackCoord, game.aiFleet.ships);
    }

    function refreshPlayerBoard(e)
    {
        screen.refreshPlayerBoard(game.humanBoard, game.pinBox, e.detail.encodedAttackCoord, game.humanFleet.ships);
    }

    function handleTurnSwitch(e)
    {
        game.checkGameOver();
        
        if (e.detail.aiTurn)
        {
            game.aiPlay();
        }
        else
        {
            encodedAttackCoords = [];
            availableShots = game.players.human.getAvailableShots();
        }
    }

    function toggleAttackMark(e)
    {
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