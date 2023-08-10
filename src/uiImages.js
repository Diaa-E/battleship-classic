"use strict";

import { addClasses, randomRotation } from "./uiUtility";

import shipImagePath from "../assets/images/ship.svg";
import emptyImagePath from "../assets/images/empty.svg";
import crossedImagePath from "../assets/images/sunk.svg";
import sunkImagePath from "../assets/images/sunk.svg";
import missedImagePath from "../assets/images/missed.svg";
import damagedImagePath from "../assets/images/damaged.svg";

export {
    CurrentShipImage,
    AppLogo,
    MissedImg,
    CrossedImg,
    DamagedImg,
    EmptyImg,
    ShipImg,
    SunkImg,
    EmptyEditorImg
}

function CurrentShipImage(selectedShipClasses)
{
    const imgShip = new Image();
    addClasses(imgShip, selectedShipClasses);

    function setSrc(newSrc)
    {
        imgShip.src = newSrc;
    }

    return {
        element: imgShip,
        setSrc,
    }
}

function AppLogo(logoPath, logoClasses)
{
    const imgLogo = new Image();
    imgLogo.src = logoPath;
    addClasses(imgLogo, logoClasses);

    return {
        element: imgLogo
    };
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

function CrossedImg(crossedClasses)
{
    const imgCrossed = new Image();
    imgCrossed.src = crossedImagePath;
    addClasses(imgCrossed, crossedClasses);
    randomSnapRotation(imgCrossed);

    return {
        element: imgCrossed
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