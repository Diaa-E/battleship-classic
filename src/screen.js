"use strict";

import { FleetEditor, MainUi, GameSettings, GameOver, Tutorial } from "./uiComponents";

export { ConsoleScreen, uiScreen };

function uiScreen()
{
    let mainUi;
    let fleetEditor;
    let gameSettings;
    let tutorial;
    let gameover;

    function loadTutorial()
    {
        tutorial = Tutorial();
        tutorial.mount();
    }

    function openTutorial()
    {
        tutorial.openDialog();
    }

    function closeTutorial()
    {
        tutorial.closeDialog();
    }

    function loadGameover()
    {
        gameover = GameOver();
        gameover.mount();
    }

    function openGameover()
    {
        gameover.openDialog();
    }

    function closeGameover()
    {
        gameover.closeDialog();
    }

    function setWinnerName(newName)
    {
        gameover.setWinnerName(newName);
    }

    function setWinnerTotalShots(newTotalShots)
    {
        gameover.setWinnerTotalShots(newTotalShots);
    }

    function setWinnerRemainingShips(newRemainingShips)
    {
        gameover.setWinnerRemainingShips(newRemainingShips);
    }

    function setLoserRemainingShips(newRemainingShips)
    {
        gameover.setLoserRemainingShips(newRemainingShips);
    }

    function setLoserName(newName)
    {
        gameover.setLoserName(newName);
    }

    function setLoserTotalShots(newTotalShots)
    {
        gameover.setLoserTotalShots(newTotalShots);
    }

    function loadMainUi(boardSize)
    {
        mainUi = MainUi(boardSize);
        mainUi.mount();
    }

    function loadFleetEditor(boardSize)
    {
        fleetEditor = FleetEditor(boardSize);
        fleetEditor.mount();
    }

    function loadGameSettings()
    {
        gameSettings = GameSettings();
        gameSettings.mount();
    }

    function openGameSettings()
    {
        gameSettings.openDialog();
    }

    function closeGameSettings()
    {
        gameSettings.closeDialog();
    }

    function highLightShip(encodedShipPosition)
    {
        fleetEditor.highLightShip(encodedShipPosition);
    }

    function unhighLightShip(encodedShipPosition)
    {
        fleetEditor.unhighlightShip(encodedShipPosition);
    }

    function refreshEditorBoard(playerBoard)
    {
        fleetEditor.refreshBoard(playerBoard);
    }

    function openFleetEditor()
    {
        fleetEditor.openDialog();
    }

    function closeFleetEditor()
    {
        fleetEditor.closeDialog();
    }

    function refreshAiBoard(board, pinBox, encodedAttackCoord, ships)
    {
        mainUi.refreshAiBoard(board, pinBox, encodedAttackCoord, ships);
    }

    function refreshPlayerBoard(board, pinBox, encodedAttackCoord, ships)
    {
        mainUi.refreshPlayerBoard(board, pinBox, encodedAttackCoord, ships);
    }

    function setPlayerName(newName)
    {
        mainUi.setPlayerName(newName);
    }

    function setAiName(newName)
    {
        mainUi.setAiName(newName);
    }

    function initBoards(playerBoard, aiBoard)
    {
        mainUi.initAiBoard(aiBoard);
        mainUi.initPlayerBoard(playerBoard);
    }

    function updateRemainingShots(newNumber)
    {
        mainUi.updateRemainingShots(newNumber);
    }

    function enableFireButton()
    {
        mainUi.enableFireButton();
    }

    function disableFireButton()
    {
        mainUi.disableFireButton();
    }

    function getAnimationSpeed()
    {
        return gameSettings.getAnimationSpeed();
    }

    function activateAiBoard()
    {
        mainUi.activateAiBoard();
    }

    function activatePlayerBoard()
    {
        mainUi.activatePlayerBoard();
    }

    function toggleFullScreenButtons(isFullScreen)
    {
        mainUi.toggleFullScreenButtons(isFullScreen);
    }

    return{
        refreshAiBoard,
        refreshPlayerBoard,
        setPlayerName,
        setAiName,
        initBoards,
        updateRemainingShots,
        enableFireButton,
        disableFireButton,
        openFleetEditor,
        closeFleetEditor,
        refreshEditorBoard,
        highLightShip,
        unhighLightShip,
        openGameSettings,
        closeGameSettings,
        loadFleetEditor,
        loadGameSettings,
        loadMainUi,
        loadGameover,
        openGameover,
        closeGameover,
        setWinnerName,
        setWinnerTotalShots,
        setLoserName,
        setLoserTotalShots,
        getAnimationSpeed,
        activateAiBoard,
        activatePlayerBoard,
        loadTutorial,
        closeTutorial,
        openTutorial,
        toggleFullScreenButtons,
        setWinnerRemainingShips,
        setLoserRemainingShips,
    }
}

function ConsoleScreen(pinBox)
{
    function refresh(playerBoard, AiBoard, aiTurn)
    {
        console.group(aiTurn? "Human's turn" : "AI's Turn");
        console.group("Your Board");
        console.table(_processBoard(playerBoard, pinBox));
        console.groupEnd();
    
        console.group("AI's Board");
        console.table(_processBoard(AiBoard, pinBox));
        console.groupEnd()
        console.groupEnd();
    }

    function _processBoard(board, pinBox)
    {
        const newBoard = [];

        for (let y = 0; y < board.length; y++)
        {
            newBoard.push([]);

            for (let x = 0; x < board.length; x++)
            {
                if (board[y][x] === pinBox.empty)
                {
                    newBoard[y].push(" ");
                }
                else if (board[y][x] === pinBox.hit)
                {
                    newBoard[y].push("X");
                }
                else if (board[y][x] === pinBox.sunk)
                {
                    newBoard[y].push("/");
                }
                else if (board[y][x] === pinBox.missed)
                {
                    newBoard[y].push("O");
                }
                else if (typeof board[y][x] === "object")
                {
                    newBoard[y].push("@");
                }
            }
        }

        return newBoard;
    }
    
    function getUserInput(promptMEssage)
    {
        return prompt(promptMEssage);
    }

    return {

        refresh,
        getUserInput
    }
}