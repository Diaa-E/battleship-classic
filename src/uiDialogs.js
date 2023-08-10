"use strict";

import { addClasses, appendToParent } from "./uiUtility";

export {
    Dialog,
    DialogForm
};

function DialogForm(formClasses)
{
    const form = document.createElement("form");
    form.method = "dialog";
    addClasses(form, formClasses);

    function appendElements(elements)
    {
        appendToParent(form, elements);
    }

    return {
        element: form,
        appendElements,
    }
}

function Dialog(dialogClasses)
{
    const dialog = document.createElement("dialog");
    addClasses(dialog, dialogClasses);

    function open()
    {
        dialog.showModal();
    }

    function close()
    {
        dialog.close();
    }

    function appendElements(elements)
    {
        appendToParent(dialog, elements);
    }

    return {
        element: dialog,
        open,
        close,
        appendElements
    }
}