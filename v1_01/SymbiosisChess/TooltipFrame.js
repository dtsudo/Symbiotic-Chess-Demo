import { black, white } from "../DTLibrary/DTColor.js";
import { STANDARD_BACKGROUND_COLOR } from "./GlobalConstants.js";
import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
let getTooltipFrame = function ({ tooltipType, isStartOfGame, gameFrame, globalState, sessionState, soundOutput, musicOutput, displayProcessing }) {
    let gameFrameWidth = displayProcessing.getCanvasWidth();
    let gameFrameHeight = displayProcessing.getCanvasHeight();
    let title;
    let description;
    let titleXOffset;
    switch (tooltipType) {
        case 0 /* TooltipType.AskStockfish */:
            sessionState.hasDisplayedAskStockfishTooltip = true;
            title = "Ask Stockfish";
            description = "Ask Stockfish to play your next move.";
            titleXOffset = 152;
            break;
        case 1 /* TooltipType.GetEval */:
            sessionState.hasDisplayedGetEvalTooltip = true;
            title = "Get evaluation";
            description = "Get Stockfish's analysis of the current board \n" + "position.";
            titleXOffset = 155;
            break;
        case 2 /* TooltipType.GetPieceToMove */:
            sessionState.hasDisplayedGetPieceToMoveTooltip = true;
            title = "Get piece to move";
            description = "Reveals which piece you should move.";
            titleXOffset = 181;
            break;
        case 3 /* TooltipType.GetOpponentResponse */:
            sessionState.hasDisplayedGetOpponentResponseTooltip = true;
            title = "Get opponent's response";
            description = "Reveals your opponent's next move in the \n" + "principal variation.";
            titleXOffset = 230;
            break;
        case 4 /* TooltipType.DoublePower */:
            sessionState.hasDisplayedDoublePowerTooltip = true;
            title = "Double power";
            description = "Each power can now be used twice per game.";
            titleXOffset = 202;
            break;
    }
    globalState.saveAndLoadData.saveSessionState({ sessionState });
    if (isStartOfGame) {
        if (tooltipType !== 4 /* TooltipType.DoublePower */) {
            title = "New Power: " + title;
            titleXOffset += 34;
            description = description + "\n\n" + "This power can be used once per game.";
        }
        else {
            title = "New Upgrade: " + title;
        }
    }
    else {
        title = "Power: " + title;
    }
    let okButton = getButton({
        x: 0,
        y: 0,
        width: 300,
        height: 100,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "OK",
        textXOffset: 131,
        textYOffset: 40,
        font: 1 /* GameFont.Roboto */,
        fontSize: 28,
        isDesktop: globalState.isDesktop
    });
    let updateUI = function (displayProcessing) {
        okButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 150);
        okButton.setY(displayProcessing.getCanvasHeight() - 500);
    };
    updateUI(displayProcessing);
    let getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame, elapsedMicrosThisFrame }) {
        updateUI(displayProcessing);
        let wasButtonClicked = okButton.processFrame({ mouseInput }).wasClicked;
        if (wasButtonClicked) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return gameFrame;
        }
        return thisFrame;
    };
    let render = function (displayOutput) {
        if (displayOutput.getCanvasWidth() === gameFrameWidth && displayOutput.getCanvasHeight() === gameFrameHeight)
            gameFrame.render(displayOutput);
        else
            displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);
        displayOutput.drawRectangle(Math.floor(displayOutput.getCanvasWidth() / 2) - 300, displayOutput.getCanvasHeight() - 600, 600, 500, white, true);
        displayOutput.drawRectangle(Math.floor(displayOutput.getCanvasWidth() / 2) - 300, displayOutput.getCanvasHeight() - 600, 600, 500, black, false);
        displayOutput.drawText(Math.floor(displayOutput.getCanvasWidth() / 2) - titleXOffset, displayOutput.getCanvasHeight() - 125, title, 1 /* GameFont.Roboto */, 32, black);
        displayOutput.drawText(Math.floor(displayOutput.getCanvasWidth() / 2) - 200, displayOutput.getCanvasHeight() - 175, description, 1 /* GameFont.Roboto */, 20, black);
        okButton.render(displayOutput);
    };
    return {
        getNextFrame,
        render,
        getClickUrl: null,
        getCompletedAchievements: null
    };
};
export { getTooltipFrame };
