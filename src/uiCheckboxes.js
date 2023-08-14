"use strict";

import { CheckMark } from "./uiImages";
import { addClasses } from "./uiUtility";

export { CheckBox };

function CheckBox(cssClasses, labelText)
{
    let checked = false;

    const checkBoxContainer = CheckBoxContainer(cssClasses.checkBoxContainer);
    const lbl = CheckBoxLabel(cssClasses.checkBoxLabel, labelText);
    const btnCheck = checkBoxButton(cssClasses.checkButton, cssClasses.checkMark);
    btnCheck.toggle(checked);

    checkBoxContainer.element.append(
        lbl.element,
        btnCheck.element
    )

    lbl.element.addEventListener("click", () => {

        toggle();
    });

    btnCheck.element.addEventListener("click", () => {

        toggle();
    });

    function toggle()
    {
        checked = !checked;
        btnCheck.toggle(checked);
    }

    function isChecked()
    {
        return checked;
    }

    return {
        element: checkBoxContainer.element,
        
        toggle,
        isChecked,
    }
}

function CheckBoxContainer(checkBoxContainerClasses)
{
    const divContainer = document.createElement("div");
    addClasses(divContainer, checkBoxContainerClasses);

    return {
        element: divContainer,
    }
}

function CheckBoxLabel(checkBoxLabelClasses, labelText)
{
    const lbl = document.createElement("label");
    lbl.innerText = labelText;
    addClasses(lbl, checkBoxLabelClasses);

    return {
        element: lbl,
    }
}

function checkBoxButton(checkButtonClasses, checkMarkClasses)
{
    const divSquare = document.createElement("div");
    addClasses(divSquare, checkButtonClasses);

    const checkMark = CheckMark(checkMarkClasses);

    divSquare.append(checkMark.element);
    
    function toggle(checked)
    {
        checkMark.toggle(checked);
    }

    return {
        element: divSquare,

        toggle,
    }
}