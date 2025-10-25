import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { processAskStockfishPower, processGetEvalPower, processGetOpponentResponsePower, processGetPieceToMovePower } from "./GameState.js";
let getGameFrameButtons = function ({ globalState, gameState, isLandscapeOrientation }) {
    let askStockfishPowerButton = getButton({
        x: 0,
        y: 0,
        width: 200,
        height: 80,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "Ask Stockfish",
        textXOffset: 18,
        textYOffset: 30,
        font: 1 /* GameFont.Roboto */,
        fontSize: 27,
        isDesktop: globalState.isDesktop
    });
    let getEvalButton = getButton({
        x: 0,
        y: 0,
        width: 200,
        height: 80,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "Get evaluation",
        textXOffset: 14,
        textYOffset: 30,
        font: 1 /* GameFont.Roboto */,
        fontSize: 27,
        isDesktop: globalState.isDesktop
    });
    let getPieceToMoveButton = getButton({
        x: 0,
        y: 0,
        width: 200,
        height: 80,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "Get piece" + "\n" + "to move",
        textXOffset: 44,
        textYOffset: 16,
        font: 1 /* GameFont.Roboto */,
        fontSize: 27,
        isDesktop: globalState.isDesktop
    });
    let getBestOpponentResponseButton = getButton({
        x: 0,
        y: 0,
        width: 200,
        height: 80,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "Get opponent's" + "\n" + "response",
        textXOffset: 9,
        textYOffset: 16,
        font: 1 /* GameFont.Roboto */,
        fontSize: 27,
        isDesktop: globalState.isDesktop
    });
    let resignButton = getButton({
        x: 0,
        y: 0,
        width: 200,
        height: 80,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "Resign",
        textXOffset: 59,
        textYOffset: 30,
        font: 1 /* GameFont.Roboto */,
        fontSize: 27,
        isDesktop: globalState.isDesktop
    });
    let updateUI = function () {
        if (isLandscapeOrientation) {
            askStockfishPowerButton.setX(0);
            askStockfishPowerButton.setY(472);
            getEvalButton.setX(0);
            getEvalButton.setY(354);
            getPieceToMoveButton.setX(0);
            getPieceToMoveButton.setY(236);
            getBestOpponentResponseButton.setX(0);
            getBestOpponentResponseButton.setY(118);
            resignButton.setX(0);
            resignButton.setY(0);
        }
        else {
            askStockfishPowerButton.setX(0);
            askStockfishPowerButton.setY(118);
            getEvalButton.setX(0);
            getEvalButton.setY(0);
            getPieceToMoveButton.setX(236);
            getPieceToMoveButton.setY(118);
            getBestOpponentResponseButton.setX(236);
            getBestOpponentResponseButton.setY(0);
            resignButton.setX(472);
            resignButton.setY(118);
        }
    };
    updateUI();
    let processFrame = function (input) {
        gameState = input.gameState;
        isLandscapeOrientation = input.isLandscapeOrientation;
        updateUI();
        let mouseInput = input.mouseInput;
        let soundOutput = input.soundOutput;
        let isPlayerTurn = gameState.boardState.isPlayerWhite === gameState.boardState.isWhiteTurn
            && (gameState.boardState.isStockfishTurn === false || gameState.boardState.isStockfishTurn === null)
            && !gameState.isGameCompleted;
        if (gameState.boardState.numAskStockfishPower > 0) {
            let wasClicked = askStockfishPowerButton.processFrame({ mouseInput }).wasClicked;
            if (wasClicked && isPlayerTurn) {
                soundOutput.playSound(0 /* GameSound.Click */, 100);
                gameState = processAskStockfishPower({ gameState });
            }
        }
        if (gameState.boardState.numGetEvalPower > 0) {
            let wasClicked = getEvalButton.processFrame({ mouseInput }).wasClicked;
            if (wasClicked && !gameState.boardState.usedGetEvalPowerThisTurn && isPlayerTurn) {
                soundOutput.playSound(0 /* GameSound.Click */, 100);
                gameState = processGetEvalPower({ gameState });
            }
        }
        if (gameState.boardState.numGetPieceToMovePower > 0) {
            let wasClicked = getPieceToMoveButton.processFrame({ mouseInput }).wasClicked;
            if (wasClicked && !gameState.boardState.usedGetPieceToMovePowerThisTurn && isPlayerTurn) {
                soundOutput.playSound(0 /* GameSound.Click */, 100);
                gameState = processGetPieceToMovePower({ gameState });
            }
        }
        if (gameState.boardState.numGetOpponentResponsePower > 0) {
            let wasClicked = getBestOpponentResponseButton.processFrame({ mouseInput }).wasClicked;
            if (wasClicked && !gameState.boardState.usedGetOpponentResponsePowerThisTurn && isPlayerTurn) {
                soundOutput.playSound(0 /* GameSound.Click */, 100);
                gameState = processGetOpponentResponsePower({ gameState });
            }
        }
        let clickedResignButton;
        if (gameState.isGameCompleted)
            clickedResignButton = false;
        else
            clickedResignButton = resignButton.processFrame({ mouseInput }).wasClicked;
        if (clickedResignButton)
            soundOutput.playSound(0 /* GameSound.Click */, 100);
        return {
            newGameState: gameState,
            clickedResignButton: clickedResignButton
        };
    };
    let render = function (displayOutput) {
        if (gameState.boardState.numAskStockfishPower > 0)
            askStockfishPowerButton.render(displayOutput);
        if (gameState.boardState.numGetEvalPower > 0)
            getEvalButton.render(displayOutput);
        if (gameState.boardState.numGetPieceToMovePower > 0)
            getPieceToMoveButton.render(displayOutput);
        if (gameState.boardState.numGetOpponentResponsePower > 0)
            getBestOpponentResponseButton.render(displayOutput);
        if (!gameState.isGameCompleted)
            resignButton.render(displayOutput);
    };
    return {
        processFrame,
        render
    };
};
export { getGameFrameButtons };
