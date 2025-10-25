import { getFirstFrame } from "./SymbioticChess/GameEntryFrame.js";
import { getKeyboard } from "./DTLibrary/GameKeyboard.js";
import { getMouse } from "./DTLibrary/GameMouse.js";
import { getEmptyKeyboard } from "./DTLibrary/EmptyKeyboard.js";
import { getEmptyMouse } from "./DTLibrary/EmptyMouse.js";
import { getSoundOutput } from "./DTLibrary/GameSoundOutput.js";
import { getMusicOutput } from "./DTLibrary/GameMusicOutput.js";
import { getSnapshot as getKeyboardSnapshot } from "./DTLibrary/CopiedKeyboard.js";
import { getSnapshot as getMouseSnapshot } from "./DTLibrary/CopiedMouse.js";
import { getDisplay } from "./DTLibrary/CanvasDisplay.js";
import { getClearCanvasManager } from "./GameInitializer_ClearCanvas.js";
import { initializeCanvasResizing } from "./GameInitializer_CanvasResizing.js";
import { getAchievementsManager } from "./GameInitializer_AchievementsManager.js";
let getGameManager = function ({ canvas, canvasScalingFactor, buildType, isDesktop, debugMode, browserWindow, browserDocument, stockfishLocation }) {
    let canvasResizing = initializeCanvasResizing({
        debugMode: debugMode,
        browserDocument: browserDocument,
        browserWindow: browserWindow,
        canvasScalingFactor: canvasScalingFactor,
        canvas: canvas
    });
    let browserLocalStorage = {
        setItem: function (key, value) {
            try {
                browserWindow.localStorage.setItem(key, value);
            }
            catch (error) {
                // do nothing
            }
        },
        getItem: function (key) {
            try {
                let item = browserWindow.localStorage.getItem(key);
                return item;
            }
            catch (error) {
                return null;
            }
        }
    };
    let clearCanvasManager = getClearCanvasManager({ canvas: canvas });
    let gameFrame = getFirstFrame({ buildType: buildType, isDesktop: isDesktop, debugMode: debugMode, browserLocalStorage: browserLocalStorage, stockfishLocation: stockfishLocation });
    let gameKeyboard = getKeyboard({
        disableArrowKeyScrolling: buildType === 1 /* BuildType.WebEmbedded */ || buildType === 2 /* BuildType.Electron */,
        browserWindow: browserWindow,
        browserDocument: browserDocument
    });
    let gameMouse = getMouse({ canvas: canvas, canvasScalingFactor: canvasScalingFactor, browserDocument: browserDocument });
    let display = getDisplay({
        getCurrentCanvasWidth: function () { return canvasResizing.getCurrentCanvasWidth(); },
        getCurrentCanvasHeight: function () { return canvasResizing.getCurrentCanvasHeight(); },
        imageSmoothingEnabled: true,
        canvasScalingFactor: canvasScalingFactor,
        canvas: canvas,
        browserDocument: browserDocument
    });
    let soundOutput = getSoundOutput();
    let musicOutput = getMusicOutput();
    let previousGameKeyboard = getEmptyKeyboard();
    let previousGameMouse = getEmptyMouse();
    clearCanvasManager.clearCanvas();
    gameFrame.render(display);
    let clickUrl = null;
    browserDocument.addEventListener("click", function (e) {
        if (clickUrl !== null && clickUrl !== "")
            browserWindow.open(clickUrl, "_blank");
    }, false);
    let achievementsManager = getAchievementsManager({ browserWindow: browserWindow });
    let computeAndRenderNextFrame = function ({ elapsedMicrosThisFrame }) {
        let currentKeyboard = getKeyboardSnapshot(gameKeyboard);
        let currentMouse = getMouseSnapshot(gameMouse);
        let getNextFrameFunc = gameFrame.getNextFrame;
        gameFrame = getNextFrameFunc({
            elapsedMicrosThisFrame: elapsedMicrosThisFrame,
            keyboardInput: currentKeyboard,
            mouseInput: currentMouse,
            previousKeyboardInput: previousGameKeyboard,
            previousMouseInput: previousGameMouse,
            displayProcessing: display,
            soundOutput: soundOutput,
            musicOutput: musicOutput,
            thisFrame: gameFrame
        });
        soundOutput.processFrame({ elapsedMicrosThisFrame: elapsedMicrosThisFrame });
        musicOutput.processFrame({ elapsedMicrosThisFrame: elapsedMicrosThisFrame });
        clearCanvasManager.clearCanvas();
        gameFrame.render(display);
        let achievements = gameFrame.getCompletedAchievements !== null ? gameFrame.getCompletedAchievements() : null;
        achievementsManager.addAchievements({ achievements: achievements });
        clickUrl = gameFrame.getClickUrl !== null ? gameFrame.getClickUrl() : null;
        previousGameKeyboard = currentKeyboard;
        previousGameMouse = currentMouse;
    };
    return {
        computeAndRenderNextFrame
    };
};
export { getGameManager };
