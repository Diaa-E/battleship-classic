"use strict";

import logo from "../assets/images/logo.svg";

export { buildUi };

function buildUi()
{
    const cssClasses = {
        logo: ["logo"],
    }

    document.body.append(
        AppLogo(logo, cssClasses.logo),
    )
}

function AppLogo(logoPath, logoClasses)
{
    const imgLogo = new Image();
    imgLogo.src = logoPath;
    addClasses(imgLogo, logoClasses);

    return imgLogo;
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