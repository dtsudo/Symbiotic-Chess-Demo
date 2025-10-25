import { black } from "../DTLibrary/DTColor.js";
import { STANDARD_BACKGROUND_COLOR } from "./GlobalConstants.js";
import { getTitleScreenFrame } from "./TitleScreenFrame.js";
import { getChessboardUI } from "./ChessboardUI.js";
import { processMove } from "./GameState.js";
import { getMoveHistoryDisplay } from "./MoveHistoryDisplay.js";
import { getTranslatedDisplayOutput } from "../DTLibrary/TranslatedDisplayOutput.js";
import { getTranslatedMouse } from "../DTLibrary/TranslatedMouse.js";
import { getPausedGameFrame } from "./PausedGameFrame.js";
import { getResignConfirmationFrame } from "./ResignConfirmationFrame.js";
import { getGameCompletedPanel } from "./GameCompletedPanel.js";
import { getOpponentAI } from "./OpponentAI.js";
import { getAllyAI } from "./AllyAI.js";
import { getPowerTextDisplay } from "./PowerTextDisplay.js";
import { getGameFrameButtons } from "./GameFrameButtons.js";
let getCustomMouse = function ({ x, y }) {
    return {
        isLeftMouseButtonPressed: function () { return false; },
        isRightMouseButtonPressed: function () { return false; },
        getX: function () { return x; },
        getY: function () { return y; }
    };
};
let getGameFrame = function ({ globalState, sessionState, soundOutput, musicOutput, displayProcessing }) {
    let CHESSBOARD_UI_WIDTH_IN_PIXELS = 552;
    let chessboardUI = getChessboardUI({ boardState: sessionState.gameState.boardState, widthInPixels: CHESSBOARD_UI_WIDTH_IN_PIXELS });
    let gameFrameButtons = getGameFrameButtons({ globalState: globalState, gameState: sessionState.gameState, isLandscapeOrientation: displayProcessing.isLandscapeOrientation() });
    let opponentAI = getOpponentAI({ globalState });
    let allyAI = getAllyAI({ globalState });
    let boardPositionInfoResults = {};
    let moveHistoryDisplay = getMoveHistoryDisplay();
    let gameCompletedPanel = null;
    let chessboardUI_xOffset = 0;
    let chessboardUI_yOffset = 0;
    let gameFrameButtons_xOffset = 0;
    let gameFrameButtons_yOffset = 0;
    let moveHistory_xOffset = 0;
    let moveHistory_yOffset = 0;
    let powerTextDisplay_xOffset = 0;
    let powerTextDisplay_yOffset = 0;
    let updateUI = function (displayProcessing) {
        let canvasWidth = displayProcessing.getCanvasWidth();
        let canvasHeight = displayProcessing.getCanvasHeight();
        if (displayProcessing.isLandscapeOrientation()) {
            chessboardUI_xOffset = 54 + Math.floor((canvasWidth - 1000) / 2);
            chessboardUI_yOffset = canvasHeight - 39 - CHESSBOARD_UI_WIDTH_IN_PIXELS;
            gameFrameButtons_xOffset = chessboardUI_xOffset + CHESSBOARD_UI_WIDTH_IN_PIXELS + 20;
            gameFrameButtons_yOffset = chessboardUI_yOffset;
            moveHistory_xOffset = chessboardUI_xOffset + CHESSBOARD_UI_WIDTH_IN_PIXELS + 240;
            moveHistory_yOffset = canvasHeight - 39 - 500;
            powerTextDisplay_xOffset = chessboardUI_xOffset + 2;
            powerTextDisplay_yOffset = chessboardUI_yOffset - 10;
        }
        else {
            chessboardUI_xOffset = 14;
            chessboardUI_yOffset = canvasHeight - 10 - CHESSBOARD_UI_WIDTH_IN_PIXELS;
            gameFrameButtons_xOffset = 14;
            gameFrameButtons_yOffset = chessboardUI_yOffset - 278;
            moveHistory_xOffset = chessboardUI_xOffset + CHESSBOARD_UI_WIDTH_IN_PIXELS + 20;
            moveHistory_yOffset = canvasHeight - 10 - 500;
            powerTextDisplay_xOffset = chessboardUI_xOffset + 2;
            powerTextDisplay_yOffset = chessboardUI_yOffset - 10;
        }
    };
    updateUI(displayProcessing);
    let getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame, elapsedMicrosThisFrame }) {
        var _a, _b, _c;
        updateUI(displayProcessing);
        sessionState.hasStarted = true;
        if (sessionState.gameState.isGameCompleted && gameCompletedPanel === null)
            gameCompletedPanel = getGameCompletedPanel({ globalState, gameState: sessionState.gameState, displayProcessing });
        let gameCompletedPanelResult = null;
        if (gameCompletedPanel !== null) {
            gameCompletedPanelResult = gameCompletedPanel.processFrame({ mouseInput, previousMouseInput, displayProcessing, elapsedMicrosThisFrame });
            if (gameCompletedPanelResult.wasButtonClicked) {
                soundOutput.playSound(0 /* GameSound.Click */, 100);
                sessionState.gameState = null;
                sessionState.hasStarted = false;
                return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
            }
        }
        if (sessionState.gameState.boardState.usedGetEvalPowerThisTurn
            || sessionState.gameState.boardState.usedGetPieceToMovePowerThisTurn
            || sessionState.gameState.boardState.usedGetOpponentResponsePowerThisTurn) {
            let numPreviousMoves = sessionState.gameState.previousMoves.length;
            if (!boardPositionInfoResults[numPreviousMoves]) {
                boardPositionInfoResults[numPreviousMoves] = globalState.stockfishWrapper.getBoardPositionInfo({ previousMoves: sessionState.gameState.previousMoves, timeToThinkInMilliseconds: 5000 });
            }
        }
        let opponentMoveInfo = opponentAI.processFrame({ gameState: sessionState.gameState, elapsedMicrosThisFrame }).moveInfo;
        if (opponentMoveInfo !== null) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            sessionState.gameState = processMove({ gameState: sessionState.gameState, moveInfo: opponentMoveInfo, boardPositionInfo: null });
        }
        let allyMoveInfo = allyAI.processFrame({
            gameState: sessionState.gameState,
            boardPositionInfo: (_a = boardPositionInfoResults[sessionState.gameState.previousMoves.length]) !== null && _a !== void 0 ? _a : null,
            elapsedMicrosThisFrame: elapsedMicrosThisFrame
        }).moveInfo;
        if (allyMoveInfo !== null) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            sessionState.gameState = processMove({ gameState: sessionState.gameState, moveInfo: allyMoveInfo, boardPositionInfo: (_b = boardPositionInfoResults[sessionState.gameState.previousMoves.length]) !== null && _b !== void 0 ? _b : null });
        }
        if (keyboardInput.isPressed(45 /* Key.Esc */) && !previousKeyboardInput.isPressed(45 /* Key.Esc */) && !sessionState.gameState.isGameCompleted) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return getPausedGameFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing, underlyingFrame: thisFrame });
        }
        chessboardUI.updateBoardState({ boardState: sessionState.gameState.boardState });
        let playerMoveInfo = chessboardUI.processFrame({
            mouseInput: gameCompletedPanelResult !== null && gameCompletedPanelResult.isHoverOverPanel
                ? getCustomMouse({ x: -5, y: -5 })
                : getTranslatedMouse(mouseInput, chessboardUI_xOffset, chessboardUI_yOffset),
            previousMouseInput: getTranslatedMouse(previousMouseInput, chessboardUI_xOffset, chessboardUI_yOffset),
            displayProcessing,
            soundOutput
        });
        if (playerMoveInfo !== null) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            sessionState.gameState = processMove({ gameState: sessionState.gameState, moveInfo: playerMoveInfo, boardPositionInfo: (_c = boardPositionInfoResults[sessionState.gameState.previousMoves.length]) !== null && _c !== void 0 ? _c : null });
        }
        let gameFrameButtonsResult = gameFrameButtons.processFrame({
            gameState: sessionState.gameState,
            isLandscapeOrientation: displayProcessing.isLandscapeOrientation(),
            mouseInput: gameCompletedPanelResult !== null && gameCompletedPanelResult.isHoverOverPanel
                ? getCustomMouse({ x: -5, y: -5 })
                : getTranslatedMouse(mouseInput, gameFrameButtons_xOffset, gameFrameButtons_yOffset),
            soundOutput: soundOutput
        });
        sessionState.gameState = gameFrameButtonsResult.newGameState;
        moveHistoryDisplay.setPreviousMoves({ previousMoves: sessionState.gameState.previousMoves });
        let moveHistoryDisplayResult = moveHistoryDisplay.processFrame({
            mouseInput: gameCompletedPanelResult !== null && gameCompletedPanelResult.isHoverOverPanel
                ? getCustomMouse({ x: -5, y: -5 })
                : getTranslatedMouse(mouseInput, moveHistory_xOffset, moveHistory_yOffset),
            isDesktop: globalState.isDesktop
        });
        if (moveHistoryDisplayResult.selectedBoardState !== null)
            chessboardUI.updateBoardState({ boardState: moveHistoryDisplayResult.selectedBoardState });
        else
            chessboardUI.updateBoardState({ boardState: sessionState.gameState.boardState });
        if (gameFrameButtonsResult.clickedResignButton) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return getResignConfirmationFrame({ globalState, sessionState, displayProcessing, underlyingFrame: thisFrame });
        }
        return thisFrame;
    };
    let render = function (displayOutput) {
        var _a;
        displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);
        chessboardUI.render(getTranslatedDisplayOutput(displayOutput, chessboardUI_xOffset, chessboardUI_yOffset));
        gameFrameButtons.render(getTranslatedDisplayOutput(displayOutput, gameFrameButtons_xOffset, gameFrameButtons_yOffset));
        moveHistoryDisplay.render(getTranslatedDisplayOutput(displayOutput, moveHistory_xOffset, moveHistory_yOffset));
        let numPreviousMoves = sessionState.gameState.previousMoves.length;
        displayOutput.drawText(powerTextDisplay_xOffset, powerTextDisplay_yOffset, getPowerTextDisplay({ boardState: sessionState.gameState.boardState, boardPositionInfo: (_a = boardPositionInfoResults[numPreviousMoves]) !== null && _a !== void 0 ? _a : null }), 1 /* GameFont.Roboto */, 22, black);
        if (gameCompletedPanel !== null)
            gameCompletedPanel.render(displayOutput);
    };
    return {
        getNextFrame,
        render,
        getClickUrl: null,
        getCompletedAchievements: null
    };
};
export { getGameFrame };
