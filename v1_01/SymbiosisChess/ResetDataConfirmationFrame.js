import { black, white } from "../DTLibrary/DTColor.js";
import { clearSessionState } from "./SessionState.js";
import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { getTitleScreenFrame } from "./TitleScreenFrame.js";
import { getEmptyKeyboard } from "../DTLibrary/EmptyKeyboard.js";
import { getEmptyMouse } from "../DTLibrary/EmptyMouse.js";
let getResetDataConfirmationFrame = function ({ underlyingFrame, globalState, sessionState, soundOutput, musicOutput, displayProcessing }) {
    let yesButton = getButton({
        x: 0,
        y: 0,
        width: 150,
        height: 40,
        backgroundColor: STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "Yes",
        textXOffset: 59,
        textYOffset: 13,
        font: 1 /* GameFont.Roboto */,
        fontSize: 20,
        isDesktop: globalState.isDesktop
    });
    let noButton = getButton({
        x: 0,
        y: 0,
        width: 150,
        height: 40,
        backgroundColor: STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "No",
        textXOffset: 62,
        textYOffset: 13,
        font: 1 /* GameFont.Roboto */,
        fontSize: 20,
        isDesktop: globalState.isDesktop
    });
    let updateUI = function (displayProcessing) {
        yesButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 200);
        yesButton.setY(displayProcessing.getCanvasHeight() - 430);
        noButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) + 50);
        noButton.setY(displayProcessing.getCanvasHeight() - 430);
    };
    updateUI(displayProcessing);
    let getNextFrame = function ({ elapsedMicrosThisFrame, keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {
        updateUI(displayProcessing);
        underlyingFrame = underlyingFrame.getNextFrame({
            elapsedMicrosThisFrame,
            keyboardInput: getEmptyKeyboard(),
            mouseInput: getEmptyMouse(),
            previousKeyboardInput: getEmptyKeyboard(),
            previousMouseInput: getEmptyMouse(),
            displayProcessing,
            soundOutput,
            musicOutput,
            thisFrame: underlyingFrame
        });
        let clickedYesButton = yesButton.processFrame({ mouseInput }).wasClicked;
        let clickedNoButton = noButton.processFrame({ mouseInput }).wasClicked;
        if (clickedYesButton) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            clearSessionState(sessionState);
            globalState.saveAndLoadData.saveSessionState({ sessionState });
            return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
        }
        if (clickedNoButton || keyboardInput.isPressed(45 /* Key.Esc */) && !previousKeyboardInput.isPressed(45 /* Key.Esc */)) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
        }
        return thisFrame;
    };
    let render = function (displayOutput) {
        underlyingFrame.render(displayOutput);
        displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), { r: 0, g: 0, b: 0, alpha: 175 }, true);
        displayOutput.drawRectangle(Math.floor(displayOutput.getCanvasWidth() / 2) - 300, displayOutput.getCanvasHeight() - 450, 600, 200, white, true);
        displayOutput.drawRectangle(Math.floor(displayOutput.getCanvasWidth() / 2) - 300, displayOutput.getCanvasHeight() - 450, 600, 200, black, false);
        displayOutput.drawText(Math.floor(displayOutput.getCanvasWidth() / 2) - 290, displayOutput.getCanvasHeight() - 260, "Are you sure you want to reset your \n" + "progress?", 1 /* GameFont.Roboto */, 28, black);
        yesButton.render(displayOutput);
        noButton.render(displayOutput);
    };
    return {
        getNextFrame,
        render,
        getClickUrl: function () { return null; },
        getCompletedAchievements: function () { return null; }
    };
};
export { getResetDataConfirmationFrame };
