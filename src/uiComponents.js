"use strict";

import battleshipLogo from "../assets/images/logo.svg";
import shipImagePath from "../assets/images/ship.svg";
import emptyImagePath from "../assets/images/empty.svg";
import sunkImagePath from "../assets/images/sunk.svg";
import missedImagePath from "../assets/images/missed.svg";
import damagedImagePath from "../assets/images/damaged.svg";

export { DocumentUi };

function DocumentUi(boardSize)
{
    const cssClasses = {
        logo: ["logo"],
        playerContainer: ["sticker", "player-sticker"],
        aiContainer: ["sticker", "ai-sticker"],
        nameTag: ["name-tag"],
        board: ["board-container"],
        boardSquare: ["square"],
        empty: ["empty"],
        ship: ["ship"],
        sunk: ["sunk"],
        damaged: ["damaged"],
        missed: ["missed"],
    };

    const logo = AppLogo(battleshipLogo, cssClasses.logo);
    const playerBoard = PlayerBoard(cssClasses, boardSize);
    const aiBoard = AiBoard(cssClasses, boardSize);

    function mount()
    {
        document.body.append(
            logo.element,
            playerBoard.element,
            aiBoard.element,
        );
    }

    function refreshAiBoard(pinBox, board, decodedCoord)
    {
        updateSquare(pinBox, board, decodedCoord, aiBoard.element, cssClasses, true);
    }

    function refreshPlayerBoard(pinBox, board, decodedCoord)
    {
        updateSquare(pinBox, board, decodedCoord, playerBoard.element, cssClasses, false);
    }

    function setPlayerName(newName)
    {
        playerBoard.setName(newName);
    }

    function setAiName(newName)
    {
        aiBoard.setName(newName);
    }

    function initAiBoard(board)
    {
        aiBoard.init(board);
    }

    function initPlayerBoard(board)
    {
        playerBoard.init(board);
    }

    return {
        refreshAiBoard,
        refreshPlayerBoard,
        setPlayerName,
        setAiName,
        mount,
        initAiBoard,
        initPlayerBoard,
    }
}

function getUiSquare(decodedCoord, uiBoard)
{
    return uiBoard.querySelector(`[data-xy="${decodedCoord[0]},${decodedCoord[1]}"]`);
}

function initBoard(hideShips, uiBoard, board, cssClasses)
{
    for (let y = 0; y < board.length; y++)
    {
        for (let x = 0; x < board.length; x++)
        {
            const uiSquare = getUiSquare([x, y], uiBoard);

            if (typeof board[y][x] === "object")
            {
                if (!hideShips)
                {
                    drawShip(uiSquare, cssClasses.ship);
                }
                else
                {
                    drawEmpty(uiSquare, cssClasses.empty);
                }
            }
            else
            {
                drawEmpty(uiSquare, cssClasses.empty);
            }
        }
    }
}

function updateSquare(pinBox, board, decodedCoord, uiBoard, cssClasses, hideShips)
{
    const boardSquare = board[decodedCoord[1]][decodedCoord[0]];
    const uiSquare = getUiSquare(decodedCoord, uiBoard);

    if (boardSquare === pinBox.empty)
    {
        uiSquare.innerHTML = "";
        drawEmpty(uiSquare, cssClasses.empty);
    }
    else if (boardSquare === pinBox.sunk)
    {
        uiSquare.innerHTML = "";
        if (!hideShips) drawShip(uiSquare, cssClasses.ship);
        drawSunk(uiSquare, cssClasses.sunk);
    }
    else if (boardSquare === pinBox.hit)
    {
        uiSquare.innerHTML = "";
        if (!hideShips) drawShip(uiSquare, cssClasses.ship);
        drawDamaged(uiSquare, cssClasses.damaged);
    }
    else if (boardSquare === pinBox.missed)
    {
        uiSquare.innerHTML = "";
        drawMissed(uiSquare, cssClasses.missed);
    }
    else if (typeof boardSquare === "object")
    {
        uiSquare.innerHTML = "";
        if (!hideShips) drawShip(uiSquare, cssClasses.ship);
    }
}

function drawEmpty(uiSquare, emptyClasses)
{
    const imgEmpty = EmptyImg(emptyClasses);
    uiSquare.appendChild(imgEmpty.element);
}

function drawShip(uiSquare, shipClasses)
{
    const imgShip = ShipImg(shipClasses);
    uiSquare.append(imgShip.element);
}

function drawDamaged(uiSquare, damagedClasses)
{
    const imgDamaged = DamagedImg(damagedClasses);
    uiSquare.append(imgDamaged.element);
}

function drawSunk(uiSquare, sunkClasses)
{
    const imgEmpty = EmptyImg(sunkClasses);
    const imgSunk = SunkImg(sunkClasses);
    uiSquare.append(imgEmpty.element, imgSunk.element);
}

function drawMissed(uiSquare, missedClasses)
{
    const imgMissed = MissedImg(missedClasses);
    uiSquare.append(imgMissed.element);
}

function EmptyImg(emptyClasses)
{
    const imgEmpty = new Image();
    imgEmpty.src = emptyImagePath;
    addClasses(imgEmpty, emptyClasses);
    randomSnapRotation(imgEmpty);

    return {
        element: imgEmpty
    };
}

function ShipImg(shipClasses)
{
    const imgShip = new Image();
    imgShip.src = shipImagePath;
    addClasses(imgShip, shipClasses);
    randomSnapRotation(imgShip);

    return {
        element: imgShip
    };
}

function SunkImg(sunkClasses)
{
    const imgSunk = new Image();
    imgSunk.src = sunkImagePath;
    addClasses(imgSunk, sunkClasses);
    randomSnapRotation(imgSunk);

    return {
        element: imgSunk
    };
}

function MissedImg(missedClasses)
{
    const imgMissed = new Image();
    imgMissed.src = missedImagePath;
    addClasses(imgMissed, missedClasses);
    randomSnapRotation(imgMissed);

    return {
        element: imgMissed
    };
}

function DamagedImg(damagedClasses)
{
    const imgDamaged = new Image();
    imgDamaged.src = damagedImagePath;
    addClasses(imgDamaged, damagedClasses);
    randomSnapRotation(imgDamaged);

    return {
        element: imgDamaged
    };
}

function AppLogo(logoPath, logoClasses)
{
    const imgLogo = new Image();
    imgLogo.src = logoPath;
    addClasses(imgLogo, logoClasses);

    return {
        element: imgLogo
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
        initBoard(false, playerBoard.element, board, cssClasses);
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
        initBoard(true, aiBoard.element, board, cssClasses);
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
    addClasses(divBoard, boardClasses);
    divBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    divBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

    for (let y = 0; y < boardSize; y++)
    {
        for (let x = 0; x < boardSize; x++)
        {
            const square = boardSquare(boardSquareClasses, [x, y]);
            randomSnapRotation(square.element);
            divBoard.appendChild(square.element);
        }
    }

    return {
        element: divBoard,
    }
}

function boardSquare(boardSquareClasses, coord)
{
    const divSquare = document.createElement("div");
    divSquare.setAttribute("data-xy", `${coord[0]},${coord[1]}`);
    addClasses(divSquare, boardSquareClasses);

    return {
        element: divSquare,
    }
}

function addClasses(element, cssClasses = [])
{
    if (cssClasses.length === 0) return

    cssClasses.forEach(cssClass => {

        element.classList.add(cssClass);
    });
};

function removeClasses(element, cssClasses = [])
{
    if (cssClasses.length === 0) return
    
    cssClasses.forEach(cssClass => {

        element.classList.remove(cssClass);
    });
};

function randomSnapRotation(element)
{
    element.style.transform = `rotate(${Math.floor(Math.random() * 4) * 90}deg)`;
}