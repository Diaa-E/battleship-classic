"use strict";

import { addClasses, randomSnapRotation, initBoard, initEditorBoard, removeClasses } from "./uiUtility";
import { decodeCoord } from "./positionUtility";

export {
    PlayerBoard,
    AiBoard,
    EditorBoard
};

function EditorBoard(cssClasses, boardSize)
{
    const playerBoardContainer = PlayerBoardContainer(cssClasses.playerContainer);
    const playerBoard = Board(cssClasses.board, cssClasses.boardSquare, boardSize);
    const playerNameTag = NameTag(cssClasses.nameTag);

    function refreshBoard(board)
    {

    }

    function highlightShip(highlightClasses, encodedShipPosition)
    {
        encodedShipPosition.forEach(codedPair => {

            const uiSquare = playerBoard.getSquare(decodeCoord(codedPair.coord));
            addClasses(uiSquare.firstChild, highlightClasses);
        });
    }

    function unhighlightShip(highlightClasses, encodedShipPosition)
    {
        encodedShipPosition.forEach(codedPair => {

            const uiSquare = playerBoard.getSquare(decodeCoord(codedPair.coord));
            removeClasses(uiSquare.firstChild, highlightClasses);
        });
    }

    function init(board)
    {
        initEditorBoard(playerBoard, board, cssClasses);
    }

    function setName(newName)
    {
        playerNameTag.setName(newName);
    }

    playerBoardContainer.element.append(
        playerBoard.element,
        playerNameTag.element
    );

    return {
        element: playerBoardContainer.element,
        refreshBoard,
        setName,
        init,
        highlightShip,
        unhighlightShip,
    };
}

function PlayerBoard(cssClasses, boardSize)
{
    const playerBoardContainer = PlayerBoardContainer(cssClasses.playerContainer);
    const playerBoard = Board(cssClasses.board, cssClasses.boardSquare, boardSize);
    const playerNameTag = NameTag(cssClasses.nameTag);

    function refreshBoard(board)
    {

    }

    function init(board)
    {
        initBoard(false, playerBoard, board, cssClasses);
    }

    function setName(newName)
    {
        playerNameTag.setName(newName);
    }

    playerBoardContainer.element.append(
        playerBoard.element,
        playerNameTag.element
    );

    return {
        element: playerBoardContainer.element,
        refreshBoard,
        setName,
        init,
    };
}

function PlayerBoardContainer(playerContainerClasses)
{
    const divContainer = document.createElement("div");
    addClasses(divContainer, playerContainerClasses);
        
    return {
        element: divContainer
    }
}

function AiBoard(cssClasses, boardSize)
{
    const aiBoardContainer = AiBoardContainer(cssClasses.aiContainer);
    const aiBoard = Board(cssClasses.board, cssClasses.boardSquare, boardSize);
    const aiNameTag = NameTag(cssClasses.nameTag);

    aiBoardContainer.element.append(
        aiBoard.element,
        aiNameTag.element
    );

    function refreshBoard(board)
    {

    }

    function init(board)
    {
        initBoard(true, aiBoard, board, cssClasses);
    }

    function setName(newName)
    {
        aiNameTag.setName(newName);
    }

    return {
        element: aiBoardContainer.element,
        refreshBoard,
        setName,
        init,
    };
}

function AiBoardContainer(aiContainerClasses)
{
    const divContainer = document.createElement("div");
    addClasses(divContainer, aiContainerClasses);

    return {
        element: divContainer
    }
}

function NameTag(nameTagClasses)
{
    const h1 = document.createElement("h1");
    addClasses(h1, nameTagClasses);

    function setName(newName)
    {
        h1.innerText = newName
    }

    return {
        element: h1,
        setName,
    }
}

function Board(boardClasses, boardSquareClasses, boardSize)
{
    const divBoard = document.createElement("div");
    const uiSquares = [];
    addClasses(divBoard, boardClasses);
    divBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    divBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

    for (let y = 0; y < boardSize; y++)
    {
        uiSquares.push([]);
        for (let x = 0; x < boardSize; x++)
        {
            const square = BoardSquare(boardSquareClasses);
            uiSquares[y].push(square.element);
            randomSnapRotation(square.element);
            divBoard.appendChild(square.element);
        }
    }

    function getSquare(decodedCoord)
    {
        return uiSquares[decodedCoord[1]][decodedCoord[0]];
    }

    function clearAllSquares()
    {
        uiSquares.forEach(row => {

            row.forEach(square => {

                square.innerHTML = "";
            });
        });
    }

    return {
        element: divBoard,
        getSquare,
        clearAllSquares,
    }
}

function BoardSquare(boardSquareClasses)
{
    const divSquare = document.createElement("div");
    addClasses(divSquare, boardSquareClasses);

    return {
        element: divSquare,
    }
}