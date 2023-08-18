"use strict";

import { addClasses, dispatchCustomEvent } from "./uiUtility";
import { ImageButton } from "./uiButtons";

export {
    Controls
};

function Controls(cssClasses)
{
    const controlsContainer = ControlsContainer(cssClasses.controls);
    const fireButton = ImageButton(cssClasses.fireButton);
    const shotsCounter = ShotsCounter(cssClasses.shotsCounter);
    
    controlsContainer.element.append(
        fireButton.element,
        shotsCounter.element
    )

    fireButton.element.addEventListener("click", (e) => {

        dispatchCustomEvent("playerAttackInbound", {}, e.target, true);
    });

    function setNumber(newNumber)
    {
        shotsCounter.setNumber(newNumber);
    }

    function disableFireButton()
    {
        fireButton.disable();
    }

    function enableFireButton()
    {
        fireButton.enable();
    }

    return {
        element: controlsContainer.element,
        setNumber,
        enableFireButton,
        disableFireButton
    }
}

function ControlsContainer(controlsClasses)
{
    const divContainer = document.createElement("div");
    addClasses(divContainer, controlsClasses);

    return {
        element: divContainer,
    }
}

function ShotsCounter(shotsCounterClasses)
{
    const divCounter = document.createElement("div");
    const pShots = document.createElement("p");
    pShots.innerText = "N/A";
    addClasses(divCounter, shotsCounterClasses);
    divCounter.append(pShots);

    function setNumber(newNumber)
    {
        pShots.innerText = newNumber;
    }

    return {
        element: divCounter,
        setNumber,
    }
}