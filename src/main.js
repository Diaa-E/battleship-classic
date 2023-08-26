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
            handler: enableDebugging,
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
    let logging = false;
    
    openGameSettings();
    addEvents(events);
    
    function addEvents(eventList)
    {
        for (const event of eventList)
        {
            document.addEventListener(event.type, event.handler, false);
        }
    }

    function removeEvents(eventList)
    {
        eventList.forEach(event => {

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

    function enableDebugging(e)
    {
        if (e.code === "NumpadDivide")
        {
            const debugEvents = [
                {
                    type: "keydown",
                    handler: runDebuggerCommand,
                }
            ];

            console.warn("Debugging mode enabled, Press numpad '*' to enter commands");
            addEvents(debugEvents);
            document.removeEventListener("keydown", enableDebugging);
        }
    }

    function runDebuggerCommand(e)
    {
        if (e.code === "NumpadMultiply")
        {
            const commands = {
                "q1": {
                    desc: "Bypass dialogs and start a game (advanced mode, fleet initial position, default name)",
                    handler: debug_quickInit,
                    args: [1],
                    msg: "Quick game initiated."
                },
                "q0": {
                    desc: "Bypass dialogs and start a game (regular mode, fleet initial position, default name)",
                    handler: debug_quickInit,
                    args: [0],
                    msg: "Quick game initiated."
                },
                "kAi": {
                    desc: "Destroy AI's fleet",
                    handler: debug_killAI,
                    args: [],
                    msg: "Ai kill in progress."
                },
                "sAi": {
                    desc: "Display Ai stats and moves so far",
                    handler: debug_showAiLogs,
                    args: [],
                    msg: "Showing game logs"
                },
                "eLog": {
                    desc: "Enable logging",
                    handler: debug_enableLogging,
                    args: [],
                    msg: "Logging enabled"
                },
            };

            console.table(commands);
            const command = prompt("Enter command.\nCheck console for command list.");

            if (commands.hasOwnProperty(command))
            {
                commands[command].handler(...commands[command].args);
                console.warn(commands[command].msg);
            }
            else
            {
                console.error(`The command "${command}" does not exist.`);
            }
        }
    }

    function debug_enableLogging()
    {
        logging = true;
    }

    function debug_showAiLogs()
    {
        console.log(game.log);
    }

    function debug_killAI()
    {
        if (!game.aiTurn)
        {
            const preciseAttacks = [];
            
            for (const ship of game.aiFleet.ships)
            {
                ship.position.forEach(pair => {
                    
                    if (!pair.sunk) preciseAttacks.push(pair.coord);
                });
            }
            
            game.humanPlay(preciseAttacks);
        }
    }

    function debug_quickInit(gameMode)
    {
        screen.closeGameSettings();
        game.init("Human", gameMode);
        screen.loadMainUi(game.rules.BOARD_SIZE);
        screen.setAiName(game.aiName);
        screen.setPlayerName(game.humanName);
        screen.initBoards(game.humanBoard, game.aiBoard);
        screen.disableFireButton();
        screen.initBoards(game.humanBoard, game.aiBoard);
        game.debug_setLogging(logging);
        
        if (game.aiTurn)
        {
            handleAiTurn();
        }
        else
        {
            handleHumanTurn();
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
        game.setAnimationSpeed(screen.getAnimationSpeed());
        screen.loadFleetEditor(game.rules.BOARD_SIZE);
        screen.openFleetEditor();
        screen.refreshEditorBoard(game.humanBoard);
        screen.highLightShip(game.humanFleet.ships[0].position);
        game.debug_setLogging(logging);
    }

    function startGame(e)
    {
        screen.loadMainUi(game.rules.BOARD_SIZE);
        screen.setAiName(game.aiName);
        screen.setPlayerName(game.humanName);
        screen.initBoards(game.humanBoard, game.aiBoard);
        screen.disableFireButton();
        screen.initBoards(game.humanBoard, game.aiBoard);

        if (game.aiTurn)
        {
            screen.activateAiBoard();
            handleAiTurn();
        }
        else
        {
            screen.activatePlayerBoard();
            handleHumanTurn();
        }
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
            screen.activateAiBoard();
            handleAiTurn();
        }
        else
        {
            screen.activatePlayerBoard();
            handleHumanTurn();
        }
    }

    function handleAiTurn()
    {
        screen.updateRemainingShots("N/A");
        game.aiPlay();
    }

    function handleHumanTurn()
    {
        encodedAttackCoords = [];
        availableShots = game.players.human.getAvailableShots();
        screen.updateRemainingShots(availableShots);
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