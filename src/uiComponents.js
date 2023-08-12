"use strict";

import battleshipLogo from "../assets/images/logo.svg";
import carrierImagePath from "../assets/images/carrier.svg";
import destroyerImagePath from "../assets/images/destroyer.svg";
import submarineImagePath from "../assets/images/submarine.svg";
import cruiserImagePath from "../assets/images/cruiser.svg";
import battleshipImagePath from "../assets/images/battleship.svg";

import { AppLogo } from "./uiImages";
import { PlayerBoard, AiBoard, EditorBoard } from "./uiBoard";
import { Controls } from "./uiGameControls";
import { CurrentShipImage } from "./uiImages";
import { Dialog, DialogForm } from "./uiDialogs";
import { DialogButton, ImageButton } from "./uiButtons";

export { MainUi, FleetEditor };

function MainUi(boardSize)
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
    };

    const logo = AppLogo(battleshipLogo, cssClasses.logo);
    const playerBoard = PlayerBoard(cssClasses, boardSize);
    const aiBoard = AiBoard(cssClasses, boardSize);
    const controls = Controls(cssClasses);

    function mount()
    {
        document.body.append(
            logo.element,
            playerBoard.element,
            aiBoard.element,
            controls.element,
        );
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
    }
}

function FleetEditor(boardSize)
{
    const cssClasses = {
        dialog: ["dialog"],
        dialogButton: ["dialog-button"],
        fleetEditorForm: ["fleet-editor-form"],
        currentShip: ["current-ship"],
        nextButton: ["editor-button", "next-button"],
        prevButton: ["editor-button", "prev-button"],
        randomButton: ["editor-button", "random-button"],
        rotateButton: ["editor-button", "rotate-button"],
        playerContainer: ["sticker", "player-sticker"],
        nameTag: ["name-tag"],
        board: ["board-container"],
        boardSquare: ["square"],
        empty: ["editor-empty"],
        ship: ["ship"],
        highlight: ["ship-highlight"],
    };

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
    const board = EditorBoard(cssClasses, boardSize);
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

    btnNextShip.element.addEventListener("click", (e) => {

        selectNextShip();
        updateCurrentShipImage();
        dispatchCustomEvent("currentShipChanged", {shipIndex: currentShipIndex}, e.target);
    });

    btnPrevShip.element.addEventListener("click", (e) => {

        selectPreviousShip();
        updateCurrentShipImage();
        dispatchCustomEvent("currentShipChanged", {shipIndex: currentShipIndex}, e.target);
    });

    function dispatchCustomEvent(eventType, data, dispatcherElement, bubbles = true)
    {
        const event = new CustomEvent(eventType, {
            bubbles: bubbles,
            detail: data
        });

        dispatcherElement.dispatchEvent(event);
    }

    function highLightShip(encodedShipPosition)
    {
        board.highlightShip(cssClasses.highlight, encodedShipPosition);
    }

    function unhighlightShip(encodedShipPosition)
    {
        board.unhighlightShip(cssClasses.highlight, encodedShipPosition);
    }

    function refreshBoard(playerBoard)
    {
        board.init(playerBoard);
    }

    function mount()
    {
        document.body.append(dialog.element);
    }

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
        mount,
        refreshBoard,
        highLightShip,
        unhighlightShip,
    }
}