"use strict";

import { addClasses } from "./uiUtility";

export { NamePrompt };

function NamePrompt(cssClasses)
{
    const h1 = document.createElement("h1");
    h1.innerText = "Who are you?";
    addClasses(h1, cssClasses.namePrompt);

    const divContainer = document.createElement("div");
    addClasses(divContainer, cssClasses.namePromptContainer);

    divContainer.append(h1);

    return {
        element: divContainer
    };
}