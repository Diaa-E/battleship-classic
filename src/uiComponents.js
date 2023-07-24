"use strict";

import battleshipLogo from "../assets/images/logo.svg";
import playerSticker from "..//assets/images/card_player.svg";

export { buildUi };

function buildUi(boardSize)
{
    const cssClasses = {
        logo: ["logo"],
        playerContainer: ["sticker", "player-sticker"],
        aiContainer: ["sticker", "ai-sticker"],
    }

    const logo = AppLogo(battleshipLogo, cssClasses.logo);
    const playerBoard = PlayerBoardContainer(cssClasses.playerContainer);
    const aiBoard = AiBoardContainer(cssClasses.aiContainer);

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