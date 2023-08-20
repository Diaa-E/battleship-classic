"use strict";

import { addClasses } from "./uiUtility";

export { 
    NamePrompt,
    Paragraph,
};

function Paragraph(paragraphClasses)
{
    const p = document.createElement("p");
    addClasses(p, paragraphClasses);

    function setText(newText)
    {
        p.innerText = newText;
    }

    return {
        element: p,

        setText,
    }
}

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