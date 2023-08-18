"use strict";

import { addClasses, randomSnapRotation, initBoard, initEditorBoard, removeClasses, updateSquare } from "./uiUtility";
import { decodeCoord } from "./positionUtility";

export {
    PlayerBoard,
    AiBoard,
    EditorBoard
};

function EditorBoard(cssClasses, boardSize)
{
    const playerBoardContainer = PlayerBoardContainer(cssClasses.playerContainer);
    const playerBoard = Board(cssClasses.board, cssClasses.boardSquare, boardSize, cssClasses.boardSquareMarked);
    const playerNameTag = NameTag(cssClasses.nameTag);

    function refreshBoard(board)
    {

    }

    function highlightShip(highlightClasses, encodedShipPosition)
    {
        encodedShipPosition.forEach(codedPair => {

            const uiSquare = playerBoard.getSquare(decodeCoord(codedPair.coord)).element;
            addClasses(uiSquare.firstChild, highlightClasses);
        });
    }

    function unhighlightShip(highlightClasses, encodedShipPosition)
    {
        encodedShipPosition.forEach(codedPair => {

            const uiSquare = playerBoard.getSquare(decodeCoord(codedPair.coord)).element;
            removeClasses(uiSquare.firstChild, highlightClasses);
        });
    }

    function getSquare(decodedCoord)
    {
        return playerBoard.getSquare(decodedCoord);
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
        getSquare,
    };
}

function PlayerBoard(cssClasses, boardSize)
{
    const playerBoardContainer = PlayerBoardContainer(cssClasses.playerContainer);
    const playerBoard = Board(cssClasses.board, cssClasses.boardSquare, boardSize, cssClasses.boardSquareMarked);
    const playerNameTag = NameTag(cssClasses.nameTag);

    function refreshBoard(board, pinBox)
    {
        playerBoard.refreshBoard(board, pinBox, cssClasses, false);
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
    const aiBoard = Board(cssClasses.board, cssClasses.boardSquare, boardSize, cssClasses.boardSquareMarked);
    const aiNameTag = NameTag(cssClasses.nameTag);

    aiBoardContainer.element.append(
        aiBoard.element,
        aiNameTag.element
    );

    function refreshBoard(board, pinBox)
    {
        aiBoard.refreshBoard(board, pinBox, cssClasses, true);
    }

    function getSquare(decodedCoord)
    {
        return aiBoard.getSquare(decodedCoord);
    }

    function markSquare(decodedCoord)
    {
        aiBoard.markSquare(decodedCoord, cssClasses.boardSquareMarked);
    }

    function unmarkSquare(decodedCoord)
    {
        aiBoard.markSquare(decodedCoord, cssClasses.boardSquareMarked);
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
        markSquare,
        unmarkSquare,
        getSquare
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

function Board(boardClasses, boardSquareClasses, boardSize, boardMarkedSquareClasses)
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
            const square = BoardSquare(boardSquareClasses, boardMarkedSquareClasses);
            uiSquares[y].push(square);
            randomSnapRotation(square.element);
            divBoard.appendChild(square.element);
        }
    }

    function refreshBoard(board, pinBox, cssClasses, hideShips)
    {
        for (let y = 0; y < board.length; y++)
        {
            for (let x = 0; x < board.length; x++)
            {
                updateSquare(uiSquares[y][x], pinBox, board, [x, y], cssClasses, hideShips);
            }
        }
    }

    function getSquare(decodedCoord)
    {
        return uiSquares[decodedCoord[1]][decodedCoord[0]];
    }

    function markSquare(decodedCoord, boardMarkedSquareClasses)
    {
        uiSquares[decodedCoord[1]][decodedCoord[0]].mark(boardMarkedSquareClasses);
    }

    function unmarkSquare(decodedCoord, boardMarkedSquareClasses)
    {
        uiSquares[decodedCoord[1]][decodedCoord[0]].unmark(boardMarkedSquareClasses);
    }

    function clearAllSquares()
    {
        uiSquares.forEach(row => {

            row.forEach(square => {

                square.clear();
            });
        });
    }

    return {
        element: divBoard,

        getSquare,
        clearAllSquares,
        markSquare,
        unmarkSquare,
        refreshBoard
    }
}

function BoardSquare(boardSquareClasses, boardMarkedSquareClasses)
{
    let marked = false;
    const divSquare = document.createElement("div");
    addClasses(divSquare, boardSquareClasses);

    function isMarked()
    {
        return marked;
    }

    function mark()
    {
        marked = true;
        addClasses(divSquare.firstChild, boardMarkedSquareClasses);
    }

    function unmark()
    {
        marked = false;
        removeClasses(divSquare.firstChild, boardMarkedSquareClasses);
    }

    function clear()
    {
        divSquare.innerHTML = "";
    }

    return {
        element: divSquare,

        isMarked,
        mark,
        unmark,
        clear
    }
}