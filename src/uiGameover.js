"use strict";

import { Paragraph } from "./uiPrompts";
import { addClasses } from "./uiUtility";

export {
    GameoverSticker,
};

function GameoverSticker(winnerContainerClasses)
{
    const divContainer = document.createElement("div");
    addClasses(divContainer, winnerContainerClasses);

    return {
        element: divContainer,
    };
}