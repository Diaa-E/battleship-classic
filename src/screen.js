"use strict";

import { FleetEditor, MainUi } from "./uiComponents";

export { ConsoleScreen, uiScreen };

function uiScreen(boardSize)
{
    const mainUi = MainUi(boardSize);
    const fleetEditor = FleetEditor(boardSize);

    function openFleetEditor()
    {
        fleetEditor.openDialog();
    }

    function closeFleetEditor()
    {
        fleetEditor.closeDialog();
    }

    function refreshAiBoard(pinBox, aiBoard, decodedCoord)
    {
        mainUi.refreshAiBoard(pinBox, aiBoard, decodedCoord);
    }

    function refreshPlayerBoard(pinBox, playerBoard, decodedCoord)
    {
        mainUi.refreshPlayerBoard(pinBox, playerBoard, decodedCoord)
    }

    function setPlayerName(newName)
    {
        mainUi.setPlayerName(newName);
    }

    function setAiName(newName)
    {
        mainUi.setAiName(newName);
    }

    function mount()
    {
        mainUi.mount();
        fleetEditor.mount();
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

    return{
        refreshAiBoard,
        refreshPlayerBoard,
        setPlayerName,
        setAiName,
        mount,
        initBoards,
        updateRemainingShots,
        enableFireButton,
        disableFireButton,
        openFleetEditor,
        closeFleetEditor,
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