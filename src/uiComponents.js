"use strict";

import battleshipLogo from "../assets/images/logo.svg";
import shipImagePath from "../assets/images/ship.svg";
import emptyImagePath from "../assets/images/empty.svg";
import crossedImagePath from "../assets/images/sunk.svg";
import sunkImagePath from "../assets/images/sunk.svg";
import missedImagePath from "../assets/images/missed.svg";
import damagedImagePath from "../assets/images/damaged.svg";
import carrierImagePath from "../assets/images/carrier.svg";
import destroyerImagePath from "../assets/images/destroyer.svg";
import submarineImagePath from "../assets/images/submarine.svg";
import cruiserImagePath from "../assets/images/cruiser.svg";
import battleshipImagePath from "../assets/images/battleship.svg";


export { DocumentUi };

function DocumentUi(boardSize)
{
    const cssClasses = {
        logo: ["logo"],
        playerContainer: ["sticker", "player-sticker"],
        aiContainer: ["sticker", "ai-sticker"],
        nameTag: ["name-tag"],
        board: ["board-container"],
        boardSquare: ["square"],
        empty: ["empty"],
        ship: ["ship"],
        sunk: ["sunk"],
        damaged: ["damaged"],
        missed: ["missed"],
        controls: ["controls-container"],
        fireButton: ["fire-button"],
        shotsCounter: ["shot-counter"],
        dialog: ["dialog"],
        dialogButton: ["dialog-button"],
        fleetEditorForm: ["fleet-editor-form"],
        currentShip: ["current-ship"],
        nextButton: ["editor-button", "next-button"],
        prevButton: ["editor-button", "prev-button"],
        randomButton: ["editor-button", "random-button"],
        rotateButton: ["editor-button", "rotate-button"],
    };

    const logo = AppLogo(battleshipLogo, cssClasses.logo);
    const playerBoard = PlayerBoard(cssClasses, boardSize);
    const aiBoard = AiBoard(cssClasses, boardSize);
    const controls = Controls(cssClasses);
    const fleetEditor = FleetEditor(cssClasses, boardSize);

    function mount()
    {
        document.body.append(
            logo.element,
            playerBoard.element,
            aiBoard.element,
            controls.element,
            fleetEditor.element
        );
    }

    function openFleetEditor()
    {
        fleetEditor.openDialog();
    }

    function closeFleetEditor()
    {
        fleetEditor.closeDialog();
    }

    function updateRemainingShots(newNumber)
    {
        controls.setNumber(newNumber);
    }

    function refreshAiBoard(pinBox, board, decodedCoord)
    {
        updateSquare(pinBox, board, decodedCoord, aiBoard.element, cssClasses, true);
    }

    function refreshPlayerBoard(pinBox, board, decodedCoord)
    {
        updateSquare(pinBox, board, decodedCoord, playerBoard.element, cssClasses, false);
    }

    function setPlayerName(newName)
    {
        playerBoard.setName(newName);
    }

    function setAiName(newName)
    {
        aiBoard.setName(newName);
    }

    function initAiBoard(board)
    {
        aiBoard.init(board);
    }

    function initPlayerBoard(board)
    {
        playerBoard.init(board);
    }

    function disableFireButton()
    {
        controls.disableFireButton();
    }

    function enableFireButton()
    {
        controls.enableFireButton();
    }

    return {
        refreshAiBoard,
        refreshPlayerBoard,
        setPlayerName,
        setAiName,
        mount,
        initAiBoard,
        initPlayerBoard,
        updateRemainingShots,
        enableFireButton,
        disableFireButton,
        closeFleetEditor,
        openFleetEditor
    }
}

function FleetEditor(cssClasses, boardSize)
{
    const fleetImages = [
        carrierImagePath,
        battleshipImagePath,
        cruiserImagePath,
        submarineImagePath,
        destroyerImagePath,
    ];

    let currentShipIndex = 0;
    const currentShipImg = CurrentShipImage(cssClasses.currentShip);
    const dialog = Dialog(cssClasses.dialog);
    const btnNext = DialogButton(cssClasses.dialogButton, "Next", "submit");
    const form = DialogForm(cssClasses.fleetEditorForm);
    const board = PlayerBoard(cssClasses, boardSize);
    const btnNextShip = ImageButton(cssClasses.nextButton);
    const btnPrevShip = ImageButton(cssClasses.prevButton);
    const btnRandomize = ImageButton(cssClasses.randomButton);
    const btnRotate = ImageButton(cssClasses.rotateButton);
    
    board.setName("Deploy fleet!");
    updateCurrentShipImage();

    form.appendElements([
        btnNext.element,
        board.element,
        currentShipImg.element,
        btnNextShip.element,
        btnPrevShip.element,
        btnRandomize.element,
        btnRotate.element
    ]);

    dialog.appendElements([
        form.element
    ]);

    btnNextShip.element.addEventListener("click", () => {

        selectNextShip();
        updateCurrentShipImage();
    });

    btnPrevShip.element.addEventListener("click", () => {

        selectPreviousShip();
        updateCurrentShipImage();
    });

    function updateCurrentShipImage()
    {
        currentShipImg.setSrc(fleetImages[currentShipIndex]);
    }

    function selectNextShip()
    {
        if (currentShipIndex === fleetImages.length - 1)
        {
            currentShipIndex = 0;
        }
        else
        {
            currentShipIndex++;
        }
    }

    function selectPreviousShip()
    {
        if (currentShipIndex === 0)
        {
            currentShipIndex = fleetImages.length - 1;
        }
        else
        {
            currentShipIndex--;
        }
    }

    function openDialog()
    {
        dialog.open();
    }

    function closeDialog()
    {
        dialog.close();
    }

    btnNext.element.addEventListener("click", () => {

    });

    return {
        element: dialog.element,
        openDialog,
        closeDialog,
    }
}

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

function DialogButton(dialogButtonClasses, text, type)
{
    const btnDialog = document.createElement("button");
    addClasses(btnDialog, dialogButtonClasses);
    btnDialog.innerText = text;
    btnDialog.type = type;

    return {
        element: btnDialog,
    }
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

function Controls(cssClasses)
{
    const controlsContainer = ControlsContainer(cssClasses.controls);
    const fireButton = ImageButton(cssClasses.fireButton);
    const shotsCounter = ShotsCounter(cssClasses.shotsCounter);
    
    controlsContainer.element.append(
        fireButton.element,
        shotsCounter.element
    )

    function setNumber(newNumber)
    {
        shotsCounter.setNumber(newNumber);
    }

    function disableFireButton()
    {
        fireButton.disable();
    }

    function enableFireButton()
    {
        fireButton.enable();
    }

    return {
        element: controlsContainer.element,
        setNumber,
        enableFireButton,
        disableFireButton
    }
}

function ControlsContainer(controlsClasses)
{
    const divContainer = document.createElement("div");
    addClasses(divContainer, controlsClasses);

    return {
        element: divContainer,
    }
}

function ShotsCounter(shotsCounterClasses)
{
    const divCounter = document.createElement("div");
    const pShots = document.createElement("p");
    pShots.innerText = "N/A";
    addClasses(divCounter, shotsCounterClasses);
    divCounter.append(pShots);

    function setNumber(newNumber)
    {
        pShots.innerText = newNumber;
    }

    return {
        element: divCounter,
        setNumber,
    }
}

function ImageButton(buttonClasses, type = "button")
{
    const btn = document.createElement("button");
    addClasses(btn, buttonClasses);
    btn.type = type;

    function disable()
    {
        btn.disabled = true;
    }

    function enable()
    {
        btn.disabled = false;
    }

    return {
        element: btn,
        disable,
        enable
    }
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

function AppLogo(logoPath, logoClasses)
{
    const imgLogo = new Image();
    imgLogo.src = logoPath;
    addClasses(imgLogo, logoClasses);

    return {
        element: imgLogo
    };
}

function PlayerBoard(cssClasses, boardSize)
{
    const playerBoardContainer = PlayerBoardContainer(cssClasses.playerContainer);
    const playerBoard = Board(cssClasses.board, cssClasses.boardSquare, boardSize);
    const playerNameTag = NameTag(cssClasses.nameTag);

    function refreshBoard(board)
    {

    }

    function init(board)
    {
        initBoard(false, playerBoard.element, board, cssClasses);
    }

    function setName(newName)
    {
        playerNameTag.setName(newName);
    }

    playerBoardContainer.element.append(
        playerBoard.element,
        playerNameTag.element
    );

    return {
        element: playerBoardContainer.element,
        refreshBoard,
        setName,
        init,
    };
}

function PlayerBoardContainer(playerContainerClasses)
{
    const divContainer = document.createElement("div");
    addClasses(divContainer, playerContainerClasses);
        
    return {
        element: divContainer
    }
}

function AiBoard(cssClasses, boardSize)
{
    const aiBoardContainer = AiBoardContainer(cssClasses.aiContainer);
    const aiBoard = Board(cssClasses.board, cssClasses.boardSquare, boardSize);
    const aiNameTag = NameTag(cssClasses.nameTag);

    aiBoardContainer.element.append(
        aiBoard.element,
        aiNameTag.element
    );

    function refreshBoard(board)
    {

    }

    function init(board)
    {
        initBoard(true, aiBoard.element, board, cssClasses);
    }

    function setName(newName)
    {
        aiNameTag.setName(newName);
    }

    return {
        element: aiBoardContainer.element,
        refreshBoard,
        setName,
        init,
    };
}

function AiBoardContainer(aiContainerClasses)
{
    const divContainer = document.createElement("div");
    addClasses(divContainer, aiContainerClasses);

    return {
        element: divContainer
    }
}

function NameTag(nameTagClasses)
{
    const h1 = document.createElement("h1");
    addClasses(h1, nameTagClasses);

    function setName(newName)
    {
        h1.innerText = newName
    }

    return {
        element: h1,
        setName,
    }
}

function Board(boardClasses, boardSquareClasses, boardSize)
{
    const divBoard = document.createElement("div");
    addClasses(divBoard, boardClasses);
    divBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    divBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

    for (let y = 0; y < boardSize; y++)
    {
        for (let x = 0; x < boardSize; x++)
        {
            const square = boardSquare(boardSquareClasses, [x, y]);
            randomSnapRotation(square.element);
            divBoard.appendChild(square.element);
        }
    }

    return {
        element: divBoard,
    }
}

function boardSquare(boardSquareClasses, coord)
{
    const divSquare = document.createElement("div");
    divSquare.setAttribute("data-xy", `${coord[0]},${coord[1]}`);
    addClasses(divSquare, boardSquareClasses);

    return {
        element: divSquare,
    }
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