"use strict";

import battleshipLogo from "../assets/images/logo.svg";

export { buildUi };

function buildUi(boardSize, players)
{
    const cssClasses = {
        logo: ["logo"],
        playerContainer: ["sticker", "player-sticker"],
        aiContainer: ["sticker", "ai-sticker"],
        nameTag: ["name-tag"],
        board: ["board-container"],
        boardSquare: ["square"],
        ships: ["ship"],
    }

    const logo = AppLogo(battleshipLogo, cssClasses.logo);

    const playerBoardContainer = PlayerBoardContainer(cssClasses.playerContainer);
    const playerBoard = Board(cssClasses.board, cssClasses.boardSquare, boardSize);
    const playerNameTag = NameTag(cssClasses.nameTag, players.human.NAME);

    playerBoardContainer.element.append(
        playerBoard.element,
        playerNameTag.element
    );

    const aiBoardContainer = AiBoardContainer(cssClasses.aiContainer);
    const aiBoard = Board(cssClasses.board, cssClasses.boardSquare, boardSize);
    const aiNameTag = NameTag(cssClasses.nameTag, players.ai.NAME);

    aiBoardContainer.element.append(
        aiBoard.element,
        aiNameTag.element
    );

    document.body.append(
        logo.element,
        playerBoardContainer.element,
        aiBoardContainer.element
    );
}

function ShipSticker(shipClasses)
{
    
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

function NameTag(nameTagClasses, name)
{
    const h1 = document.createElement("h1");
    h1.innerText = name;
    addClasses(h1, nameTagClasses);

    return {
        element: h1,
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