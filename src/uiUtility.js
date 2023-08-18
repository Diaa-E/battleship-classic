"use strict";

import { EmptyImg, CrossedImg, DamagedImg, ShipImg, MissedImg, SunkImg, EmptyEditorImg } from "./uiImages";

export {
    addClasses,
    removeClasses,
    randomRotation,
    randomSnapRotation,
    appendToParent,
    updateSquare,
    initBoard,
    initEditorBoard,
    dispatchCustomEvent,
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

function updateSquare(uiSquare, pinBox, board, decodedCoord, cssClasses, hideShips)
{
    const boardSquare = board[decodedCoord[1]][decodedCoord[0]];

    uiSquare.clear();
    if (boardSquare === pinBox.empty)
    {
        drawEmpty(uiSquare.element, cssClasses.empty);
    }
    else if (boardSquare === pinBox.sunk)
    {
        if (!hideShips) drawShip(uiSquare.element, cssClasses.ship);
        drawSunk(uiSquare.element, cssClasses.sunk);
    }
    else if (boardSquare === pinBox.hit)
    {
        if (!hideShips) drawShip(uiSquare.element, cssClasses.ship);
        drawDamaged(uiSquare.element, cssClasses.damaged);
    }
    else if (boardSquare === pinBox.missed)
    {
        drawMissed(uiSquare.element, cssClasses.missed);
    }
    else if (typeof boardSquare === "object")
    {
        if (hideShips)
        {
            drawEmpty(uiSquare.element, cssClasses.empty);
        }
        else
        {
            drawShip(uiSquare.element, cssClasses.ship);
        } 
    }
}

function drawEmpty(uiSquare, emptyClasses)
{
    const imgEmpty = EmptyImg(emptyClasses);
    uiSquare.appendChild(imgEmpty.element);
}

function drawEditorEmpty(uiSquare, emptyEditorClasses)
{
    const imgEmpty = EmptyEditorImg(emptyEditorClasses);
    uiSquare.appendChild(imgEmpty.element);
}

function drawShip(uiSquare, shipClasses)
{
    const imgShip = ShipImg(shipClasses);
    uiSquare.append(imgShip.element);
}

function drawDamaged(uiSquare, damagedClasses)
{
    const imgDamaged = DamagedImg(damagedClasses);
    uiSquare.append(imgDamaged.element);
}

function drawSunk(uiSquare, sunkClasses)
{
    const imgCrossed = CrossedImg(sunkClasses);
    const imgSunk = SunkImg(sunkClasses);
    uiSquare.append(imgCrossed.element, imgSunk.element);
}

function drawMissed(uiSquare, missedClasses)
{
    const imgMissed = MissedImg(missedClasses);
    uiSquare.append(imgMissed.element);
}

function initBoard(hideShips, uiBoard, board, cssClasses)
{
    uiBoard.clearAllSquares();
    for (let y = 0; y < board.length; y++)
    {
        for (let x = 0; x < board.length; x++)
        {
            const uiSquare = uiBoard.getSquare([x, y]).element;

            if (typeof board[y][x] === "object")
            {
                if (!hideShips)
                {
                    drawShip(uiSquare, cssClasses.ship);
                }
                else
                {
                    drawEmpty(uiSquare, cssClasses.empty);
                }
            }
            else
            {
                drawEmpty(uiSquare, cssClasses.empty);
            }
        }
    }
}

function initEditorBoard(uiBoard, board, cssClasses)
{
    uiBoard.clearAllSquares();
    for (let y = 0; y < board.length; y++)
    {
        for (let x = 0; x < board.length; x++)
        {
            const uiSquare = uiBoard.getSquare([x, y]).element;

            if (typeof board[y][x] === "object")
            {
                drawShip(uiSquare, cssClasses.ship);
            }
            else
            {
                drawEditorEmpty(uiSquare, cssClasses.empty);
            }
        }
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