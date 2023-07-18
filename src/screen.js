"use strict";

export { Screen };

function Screen()
{
    function refresh(playerBoard, AiBoard)
    {
        printToConsole(playerBoard, AiBoard);
    }

    function getUserInput(promptMessage)
    {
        return getInput(promptMessage);
    }

    return {

        refresh,
        getUserInput
    }
}

function printToConsole(playerBoard, AiBoard)
{
    console.log("Your Board");
    console.table(playerBoard);

    console.log("AI's board");
    console.table(AiBoard);
}

function getInput(promptMEssage)
{
    return prompt(promptMEssage);
}