"use strict";

import { addClasses, randomSnapRotation, removeClasses, initGrid, refreshSquare } from "./uiUtility";
import { DamagedImg, EmptyImg, MissedImg, ShipImg, SunkImg } from "./uiImages";
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

function AiBoard(cssClasses, boardSize)
{
    const aiBoardContainer = AiBoardContainer(cssClasses.aiContainer);
    const aiGrid = AiGrid(cssClasses, boardSize);
    const aiNameTag = NameTag(cssClasses.nameTag);

    aiBoardContainer.element.append(
        aiGrid.element,
        aiNameTag.element
    );

    function toggleActive(active)
    {
        aiNameTag.toggleActive(active, cssClasses.nameTagActive);
    }

    function init(board)
    {
        initGrid(true, aiGrid, board);
    }

    function setName(newName)
    {
        aiNameTag.setName(newName);
    }

    function refreshBoard(board, pinBox, encodedAttackCoord, ships)
    {
        aiGrid.refreshGrid(board, pinBox, encodedAttackCoord, ships);
    }

    function markSquare(decodedCoord)
    {
        aiGrid.getSquare(decodedCoord).mark();
    }

    function unmarkSquare(decodedCoord)
    {
        aiGrid.getSquare(decodedCoord).unmark();
    }

    function getSquare(decodedCoord)
    {
        return aiGrid.getSquare(decodedCoord);
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

function AiGrid(cssClasses, boardSize)
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
            const square = AiSquare(cssClasses);
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

function AiSquare(cssClasses)
{
    const divSquare = document.createElement("div");
    addClasses(divSquare, cssClasses.boardSquare);

    const missedImg = MissedImg(cssClasses.missed);
    const sunkImg = SunkImg(cssClasses.sunk);
    const damagedImg = DamagedImg(cssClasses.damaged);
    const emptyImg = EmptyImg(cssClasses.empty);

    let marked = false;
    let empty = true;

    randomSnapRotation(divSquare);

    divSquare.append(
        missedImg.element,
        sunkImg.element,
        damagedImg.element,
        emptyImg.element,
    );

    function sink()
    {
        empty = false;
        removeClasses(emptyImg.element, cssClasses.visible);
        removeClasses(damagedImg.element, cssClasses.visible);
        addClasses(sunkImg.element, cssClasses.visible);
    }

    function damage()
    {
        empty = false;
        removeClasses(emptyImg.element, cssClasses.visible);
        addClasses(damagedImg.element, cssClasses.visible);
    }

    function miss()
    {
        empty = false;
        removeClasses(emptyImg.element, cssClasses.visible);
        addClasses(missedImg.element, cssClasses.visible);
    }

    function mark()
    {
        addClasses(emptyImg.element, cssClasses.visible);
        marked = true;
    }

    function unmark()
    {
        removeClasses(emptyImg.element, cssClasses.visible);
        marked = false;
    }

    function clear()
    {
        removeClasses(emptyImg.element, cssClasses.visible);
        removeClasses(sunkImg.element, cssClasses.visible);
        removeClasses(damagedImg.element, cssClasses.visible);
        removeClasses(missedImg.element, cssClasses.visible);
    }

    function isMarked()
    {
        return marked;
    }

    function isEmpty()
    {
        return empty;
    }

    return {
        element: divSquare,

        clear,
        sink,
        damage,
        miss,
        mark,
        unmark,
        isMarked,
        isEmpty
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