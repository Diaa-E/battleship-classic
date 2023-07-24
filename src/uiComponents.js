"use strict";

import battleshipLogo from "../assets/images/logo.svg";

export { buildUi };

function buildUi(boardSize, aiName, playerName)
{
    const cssClasses = {
        logo: ["logo"],
        playerContainer: ["sticker", "player-sticker"],
        aiContainer: ["sticker", "ai-sticker"],
        nameTag: ["name-tag"],
        board: ["board-container"],
        boardSquare: ["square"],
    }

    const logo = AppLogo(battleshipLogo, cssClasses.logo);
    const playerBoard = PlayerBoardContainer(
        cssClasses.playerContainer,
        cssClasses.nameTag, playerName,
        cssClasses.boardSquare,
        cssClasses.board,
        boardSize
    );
    const aiBoard = AiBoardContainer(
        cssClasses.aiContainer,
        cssClasses.nameTag,
        aiName,
        cssClasses.boardSquare,
        cssClasses.board,
        boardSize
    );

    document.body.append(
        logo.element,
        playerBoard.element,
        aiBoard.element
    )
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

function PlayerBoardContainer(playerContainerClasses, nameTagClasses, playerName, boardSquareClasses, boardClasses, boardSize)
{
    const divContainer = document.createElement("div");
    addClasses(divContainer, playerContainerClasses);

    divContainer.append(
        NameTag(nameTagClasses, playerName).element,
        Board(boardClasses, boardSquareClasses, boardSize).element,
    );

    return {
        element: divContainer
    }
}

function AiBoardContainer(aiContainerClasses, nameTagClasses, aiName, boardSquareClasses, boardClasses, boardSize)
{
    const divContainer = document.createElement("div");
    addClasses(divContainer, aiContainerClasses);

    divContainer.append(
        NameTag(nameTagClasses, aiName).element,
        Board(boardClasses, boardSquareClasses, boardSize).element,
    );

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