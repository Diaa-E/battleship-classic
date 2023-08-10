"use strict";

import { addClasses } from "./uiUtility";

export {
    ImageButton,
    DialogButton,
};

function ImageButton(buttonClasses, type = "button")
{
    const btn = document.createElement("button");
    addClasses(btn, buttonClasses);
    btn.type = type;

    function disable()
    {
        btn.disabled = true;
    }

    function enable()
    {
        btn.disabled = false;
    }

    return {
        element: btn,
        disable,
        enable
    }
}

function DialogButton(dialogButtonClasses, text, type)
{
    const btnDialog = document.createElement("button");
    addClasses(btnDialog, dialogButtonClasses);
    btnDialog.innerText = text;
    btnDialog.type = type;

    return {
        element: btnDialog,
    }
}