import { black } from "../DTLibrary/DTColor.js";
import { STANDARD_BACKGROUND_COLOR } from "./GlobalConstants.js";
import { generateInitialSessionState } from "./SessionState.js";
import { getTitleScreenFrame } from "./TitleScreenFrame.js";
let getInitialLoadingScreenFrame = function ({ globalState }) {
    let getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {
        let isDoneLoadingDisplayProcessing = displayProcessing.load();
        let isDoneLoadingSounds = soundOutput.loadSounds();
        let isDoneLoadingMusic = musicOutput.loadMusic();
        if (!isDoneLoadingDisplayProcessing || !isDoneLoadingSounds || !isDoneLoadingMusic)
            return thisFrame;
        let soundVolume = globalState.saveAndLoadData.loadSoundVolume();
        let musicVolume = globalState.saveAndLoadData.loadMusicVolume();
        soundOutput.setSoundVolume(soundVolume !== null ? soundVolume : 50);
        musicOutput.setMusicVolume(musicVolume !== null ? musicVolume : 50);
        let sessionState = generateInitialSessionState();
        globalState.saveAndLoadData.loadSessionState({ sessionState: sessionState });
        return getTitleScreenFrame({ globalState: globalState, sessionState: sessionState, soundOutput: soundOutput, musicOutput: musicOutput, displayProcessing: displayProcessing });
    };
    let render = function (displayOutput) {
        displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);
        displayOutput.tryDrawText(Math.floor(displayOutput.getCanvasWidth() / 2) - 80, Math.floor(displayOutput.getCanvasHeight() / 2) + 33, "Loading...", 0 /* GameFont.SimpleFont */, 32, black);
    };
    return {
        getNextFrame,
        render,
        getClickUrl: null,
        getCompletedAchievements: null
    };
};
export { getInitialLoadingScreenFrame };
