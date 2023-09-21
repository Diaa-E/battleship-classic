"use strict";

import carrierImagePath from "../assets/images/carrier.svg";
import destroyerImagePath from "../assets/images/destroyer.svg";
import submarineImagePath from "../assets/images/submarine.svg";
import cruiserImagePath from "../assets/images/cruiser.svg";
import battleshipImagePath from "../assets/images/battleship.svg";
import tutImgPath_1 from "../assets/images/tut_1.svg";
import tutImgPath_2 from "../assets/images/tut_2.svg";
import tutImgPath_3 from "../assets/images/tut_3.svg";
import tutImgPath_4 from "../assets/images/tut_4.svg";
import tutImgPath_5 from "../assets/images/tut_5.svg";
import tutImgPath_6 from "../assets/images/tut_6.svg";
import tutImgPath_7 from "../assets/images/tut_7.svg";
import tutImgPath_8 from "../assets/images/tut_8.svg";

import { PlayerBoard, AiBoard, EditorBoard } from "./uiBoard";
import { Controls } from "./uiGameControls";
import { CurrentShipImage } from "./uiImages";
import { Dialog, DialogForm } from "./uiDialogs";
import { DialogButton, ImageButton } from "./uiButtons";
import { encodeCoord } from "./positionUtility";
import { TextBox } from "./uiTextboxes";
import { NamePrompt, Paragraph } from "./uiPrompts";
import { CheckBox } from "./uiCheckboxes";
import { dispatchCustomEvent, randomRotation, randomSnapRotation } from "./uiUtility";
import { GameoverSticker } from "./uiGameover";
import { Slider } from "./uiSliders";
import { TutorialCard } from "./uiTutorial";

export { MainUi, FleetEditor, GameSettings, GameOver, Tutorial };

function MainUi(boardSize)
{
    const cssClasses = {
        logo: ["logo"],
        playerContainer: ["sticker", "player-sticker"],
        aiContainer: ["sticker", "ai-sticker"],
        nameTag: ["name-tag"],
        nameTagActive:["name-tag-active"],
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
        enableFullScreen: ["full-screen", "enable-full-screen"],
        disableFullScreen: ["full-screen", "disable-full-screen"],
        visible: ["visible"],
    };

    const STICKER_TILT = 5;
    const playerBoard = PlayerBoard(cssClasses, boardSize);
    const aiBoard = AiBoard(cssClasses, boardSize);
    const controls = Controls(cssClasses);
    const btnEnableFull = ImageButton(cssClasses.enableFullScreen, "button");
    const btnDisableFull = ImageButton(cssClasses.disableFullScreen, "button");

    if (document.fullscreenElement === null)
    {
        btnEnableFull.enable();
        btnDisableFull.disable();
    }
    else
    {
        btnEnableFull.disable();
        btnDisableFull.enable();
    }

    btnEnableFull.element.addEventListener("click", () => {

        document.documentElement.requestFullscreen();
    });

    btnDisableFull.element.addEventListener("click", () => {

        document.exitFullscreen();
    });

    randomRotation(playerBoard.element, STICKER_TILT, -STICKER_TILT);
    randomRotation(aiBoard.element, STICKER_TILT, -STICKER_TILT);
    randomRotation(controls.element, STICKER_TILT, -STICKER_TILT);

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
            playerBoard.element,
            aiBoard.element,
            controls.element,
            btnDisableFull.element,
            btnEnableFull.element,
        );
    }

    function toggleFullScreenButtons(isFullScreen)
    {
        if (isFullScreen)
        {
            btnDisableFull.enable();
            btnEnableFull.disable();
        }
        else
        {
            btnDisableFull.disable();
            btnEnableFull.enable();
        }
    }

    function activateAiBoard()
    {
        aiBoard.toggleActive(true);
        playerBoard.toggleActive(false);
    }

    function activatePlayerBoard()
    {
        aiBoard.toggleActive(false);
        playerBoard.toggleActive(true);
    }

    function updateRemainingShots(newNumber)
    {
        controls.setNumber(newNumber);
    }

    function refreshAiBoard(board, pinBox, encodedAttackCoord, ships)
    {
        aiBoard.refreshBoard(board, pinBox, encodedAttackCoord, ships);
    }

    function refreshPlayerBoard(board, pinBox, encodedAttackCoord, ships)
    {
        playerBoard.refreshBoard(board, pinBox, encodedAttackCoord, ships);
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
        activateAiBoard,
        activatePlayerBoard,
        toggleFullScreenButtons,
    }
}

function Tutorial()
{
    const cssClasses = {
        dialog: ["dialog"],
        dialogButton: ["dialog-button"],
        tutorialForm: ["tutorial-form"],
        tutContainer: ["tutorial-container"],
        tutContainerVisible: ["tutorial-container-visible"],
        tutImg: ["tutorial-img"],
        tutText: ["tutorial-text"],
    };

    const tutorials = [
        {
            imgPath: tutImgPath_1,
            text: "Welcome to Battleship Classic. Tap the photo for a quick tutorial."
        },
        {
            imgPath: tutImgPath_2,
            text: "Each player gets a fleet of five ships with different lengths."
        },
        {
            imgPath: tutImgPath_3,
            text: "Each ship can be moved or rotated anywhere on the grid as long as they do not overlap, bend or go off the grid."
        },
        {
            imgPath: tutImgPath_4,
            text: "If desired, Ships can be placed right next to each other. Ships cannot be moved or rotated once the game starts."
        },
        {
            imgPath: tutImgPath_5,
            text: "Players take turns guessing the location of their opponent's fleet. Mark your shot and press fire."
        },
        {
            imgPath: tutImgPath_6,
            text: "When Advanced Mode is enabled, each player must place a total of six shots per turn instead of just one."
        },
        {
            imgPath: tutImgPath_7,
            text: "While Advanced Mode is on, a player's available shots per turn will be reduced for each destroyed ship of their own fleet."
        },
        {
            imgPath: tutImgPath_8,
            text: "Destroy your opponent's fleet to win the game."
        }
    ];

    const STICKER_TILT = 5;
    const dialog = Dialog(cssClasses.dialog);
    const form = DialogForm(cssClasses.tutorialForm);
    const btnSkip = DialogButton(cssClasses.dialogButton, "Skip Tutorial", "submit");
    const tutorialCards = [];
    let currentTip = 1;

    randomRotation(btnSkip.element, STICKER_TILT, -STICKER_TILT);

    tutorials.forEach((tutorial) => {

        const currentCard = TutorialCard(cssClasses, tutorial.imgPath);
        currentCard.setText(tutorial.text);
        form.appendElements([currentCard.element]);

        currentCard.element.addEventListener("click", () => {

            showNextTip();
        });

        tutorialCards.push(currentCard);
    });

    tutorialCards[0].element.style.position = "relative";
    tutorialCards[0].element.style.left = 0;
    tutorialCards[0].show();

    form.appendElements([
        btnSkip.element
    ]);

    dialog.appendElements([
        form.element
    ]);

    form.element.addEventListener("submit", () => {

        sessionStorage.setItem("tutorialComplete", "true");
    });

    function showNextTip()
    {
        if (currentTip < tutorials.length)
        {
            tutorialCards[currentTip].show();
            currentTip++;
        }
        else
        {
            //submition from script doesn't fire the submit event for some reason
            form.element.submit();
            sessionStorage.setItem("tutorialComplete", "true");
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

    function mount()
    {
        document.body.append(dialog.element);
    }

    return {
        element: dialog.element,

        openDialog,
        closeDialog,
        mount,
    };
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
        sliderContainer: ["slider-container"],
        slider: ["slider"],
        sliderLabel: ["slider-label"],
        sliderTitle: ["slider-title"],
    };

    const STICKER_TILT = 5;
    const dialog = Dialog(cssClasses.dialog);
    const form = DialogForm(cssClasses.settingsForm);
    const btnNext = DialogButton(cssClasses.dialogButton, "Next", "submit");
    const txtName = TextBox(cssClasses.nameTextbox, "Your name...", 10, true);
    const namePrompt = NamePrompt(cssClasses);
    const checkAdvancedMode = CheckBox(cssClasses, "Advanced mode");
    const animationSpeedSlider = Slider(2000, 300, 10, cssClasses, "animation-speed", "Animation duration");

    randomRotation(btnNext.element, STICKER_TILT, -STICKER_TILT);
    randomRotation(txtName.element, STICKER_TILT, -STICKER_TILT);
    randomRotation(namePrompt.element, STICKER_TILT, -STICKER_TILT);
    randomRotation(checkAdvancedMode.element, STICKER_TILT, -STICKER_TILT);
    randomRotation(animationSpeedSlider.element, STICKER_TILT, -STICKER_TILT);

    form.appendElements([
        btnNext.element,
        txtName.element,
        namePrompt.element,
        checkAdvancedMode.element,
        animationSpeedSlider.element
    ]);

    dialog.appendElements([
        form.element,
    ]);

    form.element.addEventListener("submit", (e) => {

        dispatchCustomEvent(
            "gameSettingsClosed",
            {playerName: txtName.getValue(), gameMode: checkAdvancedMode.isChecked() ? 1 : 0},
            e.target,
            true
        );
    });

    function getPlayerName()
    {
        return txtName.getValue();
    }

    function getAnimationSpeed()
    {
        return animationSpeedSlider.getValue();
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
        getAnimationSpeed,
    }
}

function FleetEditor(boardSize)
{
    const cssClasses = {
        dialog: ["dialog"],
        dialogButton: ["dialog-button"],
        fleetEditorForm: ["fleet-editor-form"],
        currentShip: ["current-ship"],
        visible: ["visible"],
        nextButton: ["editor-button", "next-button"],
        prevButton: ["editor-button", "prev-button"],
        randomButton: ["editor-button", "random-button"],
        rotateButton: ["editor-button", "rotate-button"],
        playerContainer: ["sticker", "player-sticker", "editor-sticker"],
        nameTag: ["name-tag"],
        board: ["board-container"],
        boardSquare: ["square"],
        ship: ["ship"],
        highlight: ["ship-highlight"],
        visible: ["visible"],
    };

    const fleetImages = [
        CurrentShipImage(cssClasses.currentShip, carrierImagePath),
        CurrentShipImage(cssClasses.currentShip, battleshipImagePath),
        CurrentShipImage(cssClasses.currentShip, cruiserImagePath),
        CurrentShipImage(cssClasses.currentShip, submarineImagePath),
        CurrentShipImage(cssClasses.currentShip, destroyerImagePath),
    ];

    const STICKER_TILT = 5;
    let currentShipIndex = 0;
    const dialog = Dialog(cssClasses.dialog);
    const btnNext = DialogButton(cssClasses.dialogButton, "Start Game", "submit");
    const form = DialogForm(cssClasses.fleetEditorForm);
    const board = EditorBoard(cssClasses, boardSize);
    const btnNextShip = ImageButton(cssClasses.nextButton);
    const btnPrevShip = ImageButton(cssClasses.prevButton);
    const btnRandomize = ImageButton(cssClasses.randomButton);
    const btnRotate = ImageButton(cssClasses.rotateButton);
    
    board.setName("Deploy fleet!");
    updateCurrentShipImage();

    fleetImages.forEach(ship => {
        
        randomRotation(ship.element, STICKER_TILT, -STICKER_TILT);
    });
    randomRotation(btnNext.element, STICKER_TILT, -STICKER_TILT);
    randomRotation(board.element, STICKER_TILT, -STICKER_TILT);

    form.appendElements([
        btnNext.element,
        board.element,
        btnNextShip.element,
        btnPrevShip.element,
        btnRandomize.element,
        btnRotate.element,
        fleetImages[0].element,
        fleetImages[1].element,
        fleetImages[2].element,
        fleetImages[3].element,
        fleetImages[4].element
    ]);

    dialog.appendElements([
        form.element
    ]);

    btnNext.element.addEventListener("click", (e) => {

        dispatchCustomEvent("fleetEditorClosed", {}, e.target, true);
    });

    btnNextShip.element.addEventListener("click", (e) => {

        updateCurrentShipImage();
        selectNextShip();
        updateCurrentShipImage();
        dispatchCustomEvent("currentShipChanged", {shipIndex: currentShipIndex}, e.target);
    });

    btnPrevShip.element.addEventListener("click", (e) => {

        updateCurrentShipImage();
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
        board.highlightShip(encodedShipPosition);
    }

    function unhighlightShip(encodedShipPosition)
    {
        board.unhighlightShip(encodedShipPosition);
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
        fleetImages[currentShipIndex].toggleVisibility(cssClasses.visible)
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

function GameOver()
{
    const cssClasses = {
        dialog: ["dialog"],
        gameoverForm: ["gameover-form"],
        winnerContainer: ["gameover-sticker", "winner-sticker"],
        loserContainer: ["gameover-sticker", "loser-sticker"],
        gameoverNames: ["gameover-text", "gameover-name"],
        gameoverShots: ["gameover-text", "gameover-shots"],
        rotateButton: ["editor-button", "rotate-button"],
    };

    const STICKER_TILT = 5;
    const dialog = Dialog(cssClasses.dialog);
    const form = DialogForm(cssClasses.gameoverForm);
    const winnerSticker = GameoverSticker(cssClasses.winnerContainer);
    const loserSticker = GameoverSticker(cssClasses.loserContainer);
    const winnerName = Paragraph(cssClasses.gameoverNames);
    const loserName = Paragraph(cssClasses.gameoverNames);
    const winnerTotalShots = Paragraph(cssClasses.gameoverShots);
    const loserTotalShots = Paragraph(cssClasses.gameoverShots);
    const btnPlayAgain = ImageButton(cssClasses.rotateButton, "submit");

    randomRotation(winnerSticker.element, STICKER_TILT, -STICKER_TILT);
    randomRotation(loserSticker.element, STICKER_TILT, -STICKER_TILT);

    winnerSticker.element.append(
        winnerName.element,
        winnerTotalShots.element,
    );

    loserSticker.element.append(
        loserName.element,
        loserTotalShots.element,
    );  

    form.appendElements([
        winnerSticker.element,
        loserSticker.element,
        btnPlayAgain.element
    ]);

    dialog.appendElements([
        form.element
    ]);

    form.element.addEventListener("submit", () => {

        dispatchCustomEvent("playAgain", {}, document, true);
    });

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
        document.body.append(dialog.element);
    }

    function setWinnerName(newName)
    {
        winnerName.setText(newName);
    }

    function setWinnerTotalShots(newTotalShots)
    {
        winnerTotalShots.setText(newTotalShots);
    }

    function setLoserName(newName)
    {
        loserName.setText(newName);
    }

    function setLoserTotalShots(newTotalShots)
    {
        loserTotalShots.setText(newTotalShots);
    }

    return {
        element: dialog.element,

        openDialog,
        closeDialog,
        mount,
        setWinnerName,
        setWinnerTotalShots,
        setLoserName,
        setLoserTotalShots,
    }
}