"use strict";

import { addClasses, randomSnapRotation, initBoard, initEditorBoard, removeClasses, updateSquare } from "./uiUtility";
import { DamagedImg, MissedImg, ShipImg, SunkImg } from "./uiImages";
import { decodeCoord } from "./positionUtility";

export {
    PlayerBoard,
    AiBoard,
    EditorBoard
};

function EditorBoard(cssClasses, boardSize)
{
    const playerBoardContainer = PlayerBoardContainer(cssClasses.playerContainer);
    const editorGrid = EditorGrid(cssClasses, boardSize);
    const playerNameTag = NameTag(cssClasses.nameTag);

    function highlightShip(encodedShipPosition)
    {
        encodedShipPosition.forEach(codedPair => {

            editorGrid.highlightSquare(decodeCoord(codedPair.coord));
        });
    }

    function unhighlightShip(encodedShipPosition)
    {
        encodedShipPosition.forEach(codedPair => {

            editorGrid.unhighlightSquare(decodeCoord(codedPair.coord));
        });
    }

    function getSquare(decodedCoord)
    {
        return editorGrid.getSquare(decodedCoord);
    }

    function init(board)
    {
        for (let y = 0; y < board.length; y++)
    {
        for (let x = 0; x < board.length; x++)
        {
            if (typeof board[y][x] === "object")
            {
                editorGrid.unhighlightSquare([x, y]);
            }
            else
            {
                editorGrid.clearSquare([x, y]);
            }
        }
    }
    }

    function setName(newName)
    {
        playerNameTag.setName(newName);
    }

    playerBoardContainer.element.append(
        editorGrid.element,
        playerNameTag.element
    );

    return {
        element: playerBoardContainer.element,
        
        setName,
        init,
        highlightShip,
        unhighlightShip,
        getSquare,
    };
}

function EditorGrid(cssClasses, boardSize)
{
    const divBoard = document.createElement("div");
    const uiSquares = [];
    addClasses(divBoard, cssClasses.board);
    divBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    divBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

    for (let y = 0; y < boardSize; y++)
    {
        uiSquares.push([]);
        for (let x = 0; x < boardSize; x++)
        {
            const square = EditorSquare(cssClasses);
            uiSquares[y].push(square);
            divBoard.appendChild(square.element);
        }
    }

    function highlightSquare(decodedCoord)
    {
        uiSquares[decodedCoord[1]][decodedCoord[0]].highlight();
    }

    function unhighlightSquare(decodedCoord)
    {
        uiSquares[decodedCoord[1]][decodedCoord[0]].removeHighlight();
    }

    function clearSquare(decodedCoord)
    {
        uiSquares[decodedCoord[1]][decodedCoord[0]].clear();
    }

    function getSquare(decodedCoord)
    {
        return uiSquares[decodedCoord[1]][decodedCoord[0]];
    }

    return {
        element: divBoard,

        highlightSquare,
        unhighlightSquare,
        clearSquare,
        getSquare,
    }
}

function EditorSquare(cssClasses)
{
    const divSquare = document.createElement("div");
    addClasses(divSquare, cssClasses.boardSquare);

    const shipImg = ShipImg(cssClasses.ship);
    const highlightImg = ShipImg(cssClasses.highlight);

    randomSnapRotation(divSquare);

    divSquare.append(
        shipImg.element,
        highlightImg.element
    );

    function highlight()
    {
        removeClasses(shipImg.element, cssClasses.visible);
        addClasses(highlightImg.element, cssClasses.visible);
    }

    function removeHighlight()
    {
        addClasses(shipImg.element, cssClasses.visible);
        removeClasses(highlightImg.element, cssClasses.visible);
    }

    function clear()
    {
        removeClasses(shipImg.element, cssClasses.visible);
        removeClasses(highlightImg.element, cssClasses.visible);
    }

    return {
        element: divSquare,

        highlight,
        removeHighlight,
        clear,
    }
}

function PlayerBoard(cssClasses, boardSize)
{
    const playerBoardContainer = PlayerBoardContainer(cssClasses.playerContainer);
    const playerGrid = PlayerGrid(cssClasses, boardSize);
    const playerNameTag = NameTag(cssClasses.nameTag);

    function refreshBoard(board, pinBox, encodedAttackCoord, ships)
    {
        playerGrid.refreshBoard(board, pinBox, cssClasses, false, encodedAttackCoord, ships);
    }

    function toggleActive(active)
    {
        playerNameTag.toggleActive(active, cssClasses.nameTagActive);
    }

    function init(board)
    {
        initGrid(false, playerGrid, board);
    }

    function setName(newName)
    {
        playerNameTag.setName(newName);
    }

    function refreshBoard(board, pinBox, encodedAttackCoord, ships)
    {
        playerGrid.refreshGrid(board, pinBox, encodedAttackCoord, ships);
    }

    playerBoardContainer.element.append(
        playerGrid.element,
        playerNameTag.element
    );

    return {
        element: playerBoardContainer.element,

        refreshBoard,
        setName,
        init,
        toggleActive,
    };
}

function PlayerGrid(cssClasses, boardSize)
{
    const divBoard = document.createElement("div");
    const uiSquares = [];
    addClasses(divBoard, cssClasses.board);
    divBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    divBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

    for (let y = 0; y < boardSize; y++)
    {
        uiSquares.push([]);
        for (let x = 0; x < boardSize; x++)
        {
            const square = PlayerSquare(cssClasses);
            uiSquares[y].push(square);
            divBoard.appendChild(square.element);
        }
    }

    function clearSquare(decodedCoord)
    {
        uiSquares[decodedCoord[1]][decodedCoord[0]].clear();
    }

    function getSquare(decodedCoord)
    {
        return uiSquares[decodedCoord[1]][decodedCoord[0]];
    }

    function refreshGrid(board, pinBox, encodedAttackCoord, ships)
    {
        const decodedCoord = decodeCoord(encodedAttackCoord);
        if (board[decodedCoord[1]][decodedCoord[0]] === pinBox.sunk)
        {
            let freshSunkCoords;

            for (const ship of ships)
            {
                const positionCoords = ship.position.map(element => element.coord);
                if (positionCoords.includes(encodedAttackCoord))
                {
                    freshSunkCoords = positionCoords;
                    break;
                }
            }

            freshSunkCoords.forEach(element => {

                refreshSquare(getSquare(decodeCoord(element)), pinBox, board, decodedCoord);
            });
        }
        else
        {
            refreshSquare(getSquare(decodedCoord), pinBox, board, decodedCoord);
        }
    }

    return {
        element: divBoard,

        clearSquare,
        getSquare,
        refreshGrid
    };
}

function PlayerSquare(cssClasses)
{
    const divSquare = document.createElement("div");
    addClasses(divSquare, cssClasses.boardSquare);

    const shipImg = ShipImg(cssClasses.ship);
    const missedImg = MissedImg(cssClasses.missed);
    const sunkImg = SunkImg(cssClasses.sunk);
    const damagedImg = DamagedImg(cssClasses.damaged);

    randomSnapRotation(divSquare);

    divSquare.append(
        shipImg.element,
        missedImg.element,
        sunkImg.element,
        damagedImg.element,
    );

    function sink()
    {
        removeClasses(damagedImg.element, cssClasses.visible);
        addClasses(sunkImg.element, cssClasses.visible);
    }

    function damage()
    {
        addClasses(damagedImg.element, cssClasses.visible);
    }

    function miss()
    {
        addClasses(missedImg.element, cssClasses.visible);
    }

    function drawShip()
    {
        addClasses(shipImg.element, cssClasses.visible);
    }

    function clear()
    {
        removeClasses(shipImg.element, cssClasses.visible);
        removeClasses(sunkImg.element, cssClasses.visible);
        removeClasses(damagedImg.element, cssClasses.visible);
        removeClasses(missedImg.element, cssClasses.visible);
    }

    return {
        element: divSquare,

        clear,
        sink,
        damage,
        miss,
        drawShip,
    };
}

function initGrid(hideShips, uiBoard, board)
{
    for (let y = 0; y < board.length; y++)
    {
        for (let x = 0; x < board.length; x++)
        {
            const uiSquare = uiBoard.getSquare([x, y]);

            if (typeof board[y][x] === "object")
            {
                if (!hideShips)
                {
                    uiSquare.drawShip();
                }
            }
        }
    }
}

function refreshSquare(uiSquare, pinBox, board, decodedCoord)
{
    const boardSquare = board[decodedCoord[1]][decodedCoord[0]];

    if (boardSquare === pinBox.empty)
    {
        return;
    }
    else if (boardSquare === pinBox.sunk)
    {
        uiSquare.sink();
    }
    else if (boardSquare === pinBox.hit)
    {
        uiSquare.damage();
    }
    else if (boardSquare === pinBox.missed)
    {
        uiSquare.miss();
    }
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

    function refreshBoard(board, pinBox, encodedAttackCoord, ships)
    {
        aiBoard.refreshBoard(board, pinBox, cssClasses, true, encodedAttackCoord, ships);
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

    function toggleActive(active)
    {
        aiNameTag.toggleActive(active, cssClasses.nameTagActive);
    }

    return {
        element: aiBoardContainer.element,

        refreshBoard,
        setName,
        init,
        markSquare,
        unmarkSquare,
        getSquare,
        toggleActive
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

    function toggleActive(active, activeClasses)
    {
        if (active)
        {
            addClasses(h1, activeClasses)
        }
        else
        {
            removeClasses(h1, activeClasses);
        }
    }

    return {
        element: h1,
        setName,
        toggleActive,
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

    function refreshBoard(board, pinBox, cssClasses, hideShips, encodedAttackCoord, ships)
    {
        const decodedCoord = decodeCoord(encodedAttackCoord);
        if (board[decodedCoord[1]][decodedCoord[0]] === pinBox.sunk)
        {
            const sunkShips = [];
            let freshSunkCoords;

            ships.forEach(ship => {

                if (ship.isSunk) sunkShips.push(ship);
            });

            for (const ship of ships)
            {
                const positionCoords = ship.position.map(element => element.coord);
                if (positionCoords.includes(encodedAttackCoord))
                {
                    freshSunkCoords = positionCoords;
                    break;
                }
            }

            freshSunkCoords.forEach(element => {

                updateSquare(getSquare(decodeCoord(element)), pinBox, board, decodedCoord, cssClasses, hideShips);
            });
        }
        else
        {
            updateSquare(getSquare(decodedCoord), pinBox, board, decodedCoord, cssClasses, hideShips);
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