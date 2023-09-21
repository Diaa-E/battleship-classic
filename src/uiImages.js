"use strict";

import { addClasses, randomRotation, randomSnapRotation } from "./uiUtility";

import shipImagePath from "../assets/images/ship.svg";
import emptyImagePath from "../assets/images/empty.svg";
import sunkImagePath from "../assets/images/sunk.svg";
import missedImagePath from "../assets/images/missed.svg";
import damagedImagePath from "../assets/images/damaged.svg";

export {
    CurrentShipImage,
    MissedImg,
    DamagedImg,
    EmptyImg,
    ShipImg,
    SunkImg,
    EmptyEditorImg,
    CheckMark
}

function CheckMark(checkMarkClasses)
{
    const imgMark = new Image();
    imgMark.src = missedImagePath;
    addClasses(imgMark, checkMarkClasses);
    randomSnapRotation(imgMark);

    function toggle(checked)
    {
        checked ? imgMark.style.opacity = "100%" : imgMark.style.opacity = "0%";
    }

    return {
        element: imgMark,

        toggle,
    };
}

function CurrentShipImage(selectedShipClasses, srcPath)
{
    const imgShip = new Image();
    addClasses(imgShip, selectedShipClasses);
    imgShip.src = srcPath;

    function setSrc(newSrc)
    {
        imgShip.src = newSrc;
    }

    function toggleVisibility(visibilityClasses)
    {
        imgShip.classList.toggle(visibilityClasses);
    }

    return {
        element: imgShip,
        setSrc,
        toggleVisibility,
    }
}

function EmptyImg(emptyClasses)
{
    const imgEmpty = new Image();
    imgEmpty.src = emptyImagePath;
    addClasses(imgEmpty, emptyClasses);
    randomRotation(imgEmpty, 45, -45);

    return {
        element: imgEmpty
    };
}

function EmptyEditorImg(emptyEditorClasses)
{
    const imgEditorEmpty = new Image();
    imgEditorEmpty.src = shipImagePath;
    addClasses(imgEditorEmpty, emptyEditorClasses);
    randomRotation(imgEditorEmpty, 360, 0);

    return {
        element: imgEditorEmpty
    };
}

function ShipImg(shipClasses)
{
    const imgShip = new Image();
    imgShip.src = shipImagePath;
    addClasses(imgShip, shipClasses);
    randomRotation(imgShip, 360, 0);

    return {
        element: imgShip
    };
}

function SunkImg(sunkClasses)
{
    const imgSunk = new Image();
    imgSunk.src = sunkImagePath;
    addClasses(imgSunk, sunkClasses);
    randomSnapRotation(imgSunk);

    return {
        element: imgSunk
    };
}

function MissedImg(missedClasses)
{
    const imgMissed = new Image();
    imgMissed.src = missedImagePath;
    addClasses(imgMissed, missedClasses);
    randomSnapRotation(imgMissed);

    return {
        element: imgMissed
    };
}

function DamagedImg(damagedClasses)
{
    const imgDamaged = new Image();
    imgDamaged.src = damagedImagePath;
    addClasses(imgDamaged, damagedClasses);
    randomSnapRotation(imgDamaged);

    return {
        element: imgDamaged
    };
}