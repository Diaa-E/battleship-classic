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
    }

    const logo = AppLogo(battleshipLogo, cssClasses.logo);
    const playerBoard = PlayerBoardContainer(cssClasses.playerContainer);
    const aiBoard = AiBoardContainer(cssClasses.aiContainer);

    playerBoard.element.append(NameTag(cssClasses.nameTag, playerName).element);
    aiBoard.element.append(NameTag(cssClasses.nameTag, aiName).element);

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

function PlayerBoard(boardSize)
{

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