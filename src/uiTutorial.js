"use strict";

import { addClasses, removeClasses } from "./uiUtility";

export { TutorialCard };

function TutorialCard(cssClasses, tutImg)
{
    const tutorialContainer = TutorialContainer(cssClasses.tutContainer, cssClasses.tutContainerVisible);
    const tutorialImg = TutorialImage(tutImg, cssClasses.tutImg);
    const tutorialText = TutorialText(cssClasses.tutText);

    tutorialContainer.element.append(
        tutorialImg.element,
        tutorialText.element,
    );

    function setText(newText)
    {
        tutorialText.setText(newText);
    }

    function show()
    {
        tutorialContainer.toggleVisibility(true);
    }

    function hide()
    {
        tutorialContainer.toggleVisibility(false);
    }

    return {
        element: tutorialContainer.element,

        setText,
        show,
        hide,
    }
}

function TutorialContainer(hiddenTutContainerClasses, visibleTutContainerClasses)
{
    const container = document.createElement("div");
    addClasses(container, hiddenTutContainerClasses);

    function toggleVisibility(visible)
    {
        if (visible)
        {
            addClasses(container, visibleTutContainerClasses);
        }
        else
        {
            removeClasses(container, visibleTutContainerClasses);
        }
    }

    return {
        element: container,

        toggleVisibility,
    }
}

function TutorialImage(tutImg, tutImgClasses)
{
    const img = new Image();
    img.src = tutImg;
    addClasses(img, tutImgClasses);

    return {
        element: img,
    }
}

function TutorialText(tutTextClasses)
{
    const p = document.createElement("p");
    p.innerText = "";
    addClasses(p, tutTextClasses);

    function setText(newText)
    {
        p.innerText = newText;
    }

    return {
        element: p,

        setText,
    }
}