"use strict";

export {
    addClasses,
    removeClasses,
    randomRotation,
    randomSnapRotation,
    appendToParent,
    dispatchCustomEvent,
    initGrid,
    refreshSquare,
};

function addClasses(element, cssClasses = [])
{
    if (cssClasses.length === 0) return

    cssClasses.forEach(cssClass => {

        element.classList.add(cssClass);
    });
};

function removeClasses(element, cssClasses = [])
{
    if (cssClasses.length === 0) return
    
    cssClasses.forEach(cssClass => {

        element.classList.remove(cssClass);
    });
};

function randomSnapRotation(element)
{
    element.style.transform = `rotate(${Math.floor(Math.random() * 4) * 90}deg)`;
}

function randomRotation(element, maxAngle, minAngle)
{
    element.style.transform = `rotate(${Math.floor(Math.random() * (maxAngle - minAngle + 1)) + minAngle}deg)`;
}

function appendToParent(parent, children)
{
    children.forEach(child => {

        parent.appendChild(child);
    });
}

function initGrid(hideShips, uiBoard, board)
{
    for (let y = 0; y < board.length; y++)
    {
        for (let x = 0; x < board.length; x++)
        {
            const uiSquare = uiBoard.getSquare([x, y]);

            if (typeof board[y][x] === "object")
            {
                if (!hideShips)
                {
                    uiSquare.drawShip();
                }
            }
        }
    }
}

function refreshSquare(uiSquare, pinBox, board, decodedCoord)
{
    const boardSquare = board[decodedCoord[1]][decodedCoord[0]];

    if (boardSquare === pinBox.empty)
    {
        return;
    }
    else if (boardSquare === pinBox.sunk)
    {
        uiSquare.sink();
    }
    else if (boardSquare === pinBox.hit)
    {
        uiSquare.damage();
    }
    else if (boardSquare === pinBox.missed)
    {
        uiSquare.miss();
    }
}

function dispatchCustomEvent(eventType, data, dispatcherElement, bubbles = true)
{
    const event = new CustomEvent(eventType, {
        bubbles: bubbles,
        detail: data
    });

    dispatcherElement.dispatchEvent(event);
}