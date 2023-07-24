"use strict";

import battleshipLogo from "../assets/images/logo.svg";

export { buildUi };

function buildUi()
{
    const cssClasses = {
        logo: ["logo"],
    }

    const logo = AppLogo(battleshipLogo, cssClasses.logo);

    document.body.append(
        logo.element,
    )
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