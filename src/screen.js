"use strict";

export { ConsoleScreen };

function ConsoleScreen(pinBox)
{
    function refresh(playerBoard, AiBoard)
    {
        console.log("Your Board");
        console.table(_processBoard(playerBoard, pinBox));
    
        console.log("AI's board");
        console.table(_processBoard(AiBoard, pinBox));
    }

    function _processBoard(board, pinBox)
    {
        let newBoard = JSON.parse(JSON.stringify(board));

        for (let x = 0; x < board.length; x++)
        {
            for (let y = 0; y < board.length; y++)
            {
                if (newBoard[y][x] === pinBox.empty)
                {
                    newBoard[y][x] = " ";
                }
                else if (newBoard[y][x] === pinBox.hit)
                {
                    newBoard[y][x] = "X";
                }
                else if (newBoard[y][x] === pinBox.sunk)
                {
                    newBoard[y][x] = "/";
                }
                else if (newBoard[y][x] === pinBox.missed)
                {
                    newBoard[y][x] = "O";
                }
            }
        }

        return newBoard;
    }
    
    function getUserInput(promptMEssage)
    {
        return prompt(promptMEssage);
    }

    return {

        refresh,
        getUserInput
    }
}