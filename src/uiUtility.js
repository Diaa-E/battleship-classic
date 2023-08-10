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

function updateSquare(pinBox, board, decodedCoord, uiBoard, cssClasses, hideShips)
{
    const boardSquare = board[decodedCoord[1]][decodedCoord[0]];
    const uiSquare = getUiSquare(decodedCoord, uiBoard);

    if (boardSquare === pinBox.empty)
    {
        uiSquare.innerHTML = "";
        drawEmpty(uiSquare, cssClasses.empty);
    }
    else if (boardSquare === pinBox.sunk)
    {
        uiSquare.innerHTML = "";
        if (!hideShips) drawShip(uiSquare, cssClasses.ship);
        drawSunk(uiSquare, cssClasses.sunk);
    }
    else if (boardSquare === pinBox.hit)
    {
        uiSquare.innerHTML = "";
        if (!hideShips) drawShip(uiSquare, cssClasses.ship);
        drawDamaged(uiSquare, cssClasses.damaged);
    }
    else if (boardSquare === pinBox.missed)
    {
        uiSquare.innerHTML = "";
        drawMissed(uiSquare, cssClasses.missed);
    }
    else if (typeof boardSquare === "object")
    {
        uiSquare.innerHTML = "";
        if (!hideShips) drawShip(uiSquare, cssClasses.ship);
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

function getUiSquare(decodedCoord, uiBoard)
{
    return uiBoard.querySelector(`[data-xy="${decodedCoord[0]},${decodedCoord[1]}"]`);
}

function initBoard(hideShips, uiBoard, board, cssClasses)
{
    for (let y = 0; y < board.length; y++)
    {
        for (let x = 0; x < board.length; x++)
        {
            const uiSquare = getUiSquare([x, y], uiBoard);

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
    for (let y = 0; y < board.length; y++)
    {
        for (let x = 0; x < board.length; x++)
        {
            const uiSquare = getUiSquare([x, y], uiBoard);

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