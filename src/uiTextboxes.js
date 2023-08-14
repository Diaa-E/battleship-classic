"use strict";

import { addClasses } from "./uiUtility";

export { TextBox };

function TextBox(textboxClasses, placeHolder = "", maxLength, required = false)
{
    const txt = document.createElement("input");
    txt.type = "text";
    txt.required = required;
    if (maxLength) txt.maxLength = maxLength;
    txt.placeholder = placeHolder;
    addClasses(txt, textboxClasses);

    function getValue()
    {
        return txt.value;
    }

    return {
        element: txt,

        getValue,
    };
}