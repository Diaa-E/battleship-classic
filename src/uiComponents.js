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
import { encodeCoord } from "./positionUtility";
import { TextBox } from "./uiTextboxes";
import { NamePrompt } from "./uiPrompts";
import { CheckBox } from "./uiCheckboxes";
import { dispatchCustomEvent } from "./uiUtility";

export { MainUi, FleetEditor, GameSettings };

function MainUi(boardSize)
{
    const cssClasses = {
        logo: ["logo"],
        playerContainer: ["sticker", "player-sticker"],
        aiContainer: ["sticker", "ai-sticker"],
        nameTag: ["name-tag"],
        board: ["board-container"],
        boardSquare: ["square"],
        boardSquareMarked: ["marked"],
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

    for (let y = 0; y < boardSize; y++)
    {
        for (let x = 0; x < boardSize; x++)
        {
            const square = aiBoard.getSquare([x, y]);
            square.element.addEventListener("click", (e) => {

                dispatchCustomEvent("attackMarkToggled", {uiSquare: square, decodedCoord: [x, y]}, square.element, true);
            });
        }
    }

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

function GameSettings()
{
    const cssClasses = {
        dialog: ["dialog"],
        dialogButton: ["dialog-button"],
        settingsForm: ["settings-form"],
        nameTextbox: ["name-textbox"],
        namePrompt: ["name-prompt"],
        namePromptContainer: ["name-prompt-container"],
        checkBoxContainer: ["checkbox-container"],
        checkButton: ["check-button"],
        checkMark: ["check-mark"],
        checkBoxLabel: ["checkbox-label"],
    };

    const dialog = Dialog(cssClasses.dialog);
    const form = DialogForm(cssClasses.settingsForm);
    const btnNext = DialogButton(cssClasses.dialogButton, "Next", "submit");
    const txtName = TextBox(cssClasses.nameTextbox, "Your name...", 10, true);
    const namePrompt = NamePrompt(cssClasses);
    const checkAdvancedMode = CheckBox(cssClasses, "Advanced mode");

    form.appendElements([
        btnNext.element,
        txtName.element,
        namePrompt.element,
        checkAdvancedMode.element
    ]);

    dialog.appendElements([
        form.element,
    ]);

    btnNext.element.addEventListener("click", (e) => {

        dispatchCustomEvent(
            "gameSettingsClosed",
            {playerName: txtName.getValue(), gameMode: checkAdvancedMode.isChecked() ? 1 : 0},
            e.target,
            true
        );
    })

    function getPlayerName()
    {
        return txtName.getValue();
    }

    function openDialog()
    {
        dialog.open();
    }

    function closeDialog()
    {
        dialog.close();
    }

    function mount()
    {
        document.body.appendChild(dialog.element);
    }

    return {
        element: dialog.element,

        mount,
        closeDialog,
        openDialog,
        getPlayerName,
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

    btnNext.element.addEventListener("click", (e) => {

        dispatchCustomEvent("fleetEditorClosed", {}, e.target, true);
    });

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

    for (let y = 0; y < boardSize; y++)
    {
        for (let x = 0; x < boardSize; x++)
        {
            const square = board.getSquare([x, y]).element;
            square.addEventListener("click", () => {

                dispatchCustomEvent("shipMoved", {shipIndex: currentShipIndex, newPivot: encodeCoord([x, y])}, square, true);
            });
        }
    }

    btnRotate.element.addEventListener("click", (e) => {

        dispatchCustomEvent("shipRotated", {shipIndex: currentShipIndex}, e.target, true);
    });

    btnRandomize.element.addEventListener("click", (e) => {

        dispatchCustomEvent("fleetRandomized", {shipIndex: currentShipIndex}, e.target, true);
    });

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