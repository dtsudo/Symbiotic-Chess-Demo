import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { getEmptyMouse } from "../DTLibrary/EmptyMouse.js";
import { getEmptyKeyboard } from "../DTLibrary/EmptyKeyboard.js";
import { black, white } from "../DTLibrary/DTColor.js";
let getYouWinFrame = function ({ underlyingFrame, globalState, sessionState, soundOutput, musicOutput, displayProcessing }) {
    sessionState.hasDisplayedYouWinTooltip = true;
    globalState.saveAndLoadData.saveSessionState({ sessionState });
    let okButton = getButton({
        x: 0,
        y: 0,
        width: 200,
        height: 100,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "OK",
        textXOffset: 67,
        textYOffset: 32,
        font: 1 /* GameFont.Roboto */,
        fontSize: 48,
        isDesktop: globalState.isDesktop
    });
    let updateUI = function (displayProcessing) {
        okButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 100);
        okButton.setY(displayProcessing.getCanvasHeight() - 500);
    };
    updateUI(displayProcessing);
    let getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame, elapsedMicrosThisFrame }) {
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
        let wasButtonClicked = okButton.processFrame({ mouseInput }).wasClicked;
        if (wasButtonClicked) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return underlyingFrame;
        }
        return thisFrame;
    };
    let render = function (displayOutput) {
        underlyingFrame.render(displayOutput);
        displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), { r: 0, g: 0, b: 0, alpha: 110 }, true);
        displayOutput.drawRectangle(Math.floor(displayOutput.getCanvasWidth() / 2) - 300, displayOutput.getCanvasHeight() - 600, 600, 500, white, true);
        displayOutput.drawRectangle(Math.floor(displayOutput.getCanvasWidth() / 2) - 300, displayOutput.getCanvasHeight() - 600, 600, 500, black, false);
        displayOutput.drawText(Math.floor(displayOutput.getCanvasWidth() / 2) - 93, displayOutput.getCanvasHeight() - 150, "You Win!", 1 /* GameFont.Roboto */, 48, black);
        displayOutput.drawText(Math.floor(displayOutput.getCanvasWidth() / 2) - 250, displayOutput.getCanvasHeight() - 220, "You defeated all your opponents! \n\n"
            + "You can challenge them to a rematch or play \n"
            + "against Stockfish at a given Elo rating.", 1 /* GameFont.Roboto */, 24, black);
        okButton.render(displayOutput);
    };
    return {
        getNextFrame,
        render,
        getClickUrl: null,
        getCompletedAchievements: null
    };
};
export { getYouWinFrame };
