import { black } from "../DTLibrary/DTColor.js";
import { STANDARD_BACKGROUND_COLOR } from "./GlobalConstants.js";
import { getSoundAndMusicVolumePicker } from "./SoundAndMusicVolumePicker.js";
import { getCreditsFrame } from "./CreditsFrame.js";
import { getInstructionsScreenFrame } from "./InstructionsScreenFrame.js";
import { getGameFrame } from "./GameFrame.js";
import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR, STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { getCurrentVersion } from "../DTLibrary/VersionInfo.js";
import { getChooseOpponentFrame } from "./ChooseOpponentFrame.js";
import { getResetDataConfirmationFrame } from "./ResetDataConfirmationFrame.js";
import { getYouWinFrame } from "./YouWinFrame.js";
let getTitleScreenFrame = function ({ globalState, sessionState, soundOutput, musicOutput, displayProcessing }) {
    let volumePicker = getSoundAndMusicVolumePicker({
        xPos: 0,
        yPos: 0,
        initialSoundVolume: soundOutput.getSoundVolume(),
        initialMusicVolume: musicOutput.getMusicVolume(),
        color: 0 /* VolumePickerColor.Black */,
        scalingFactor: globalState.isDesktop ? 1 : 2
    });
    let startOrContinueButton = getButton({
        x: 0,
        y: 0,
        width: 300,
        height: 100,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "",
        textXOffset: 0,
        textYOffset: 0,
        font: 1 /* GameFont.Roboto */,
        fontSize: 32,
        isDesktop: globalState.isDesktop
    });
    let creditsButton = getButton({
        x: 0,
        y: 5,
        width: 145,
        height: 80,
        backgroundColor: STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "Credits",
        textXOffset: 40,
        textYOffset: 33,
        font: 1 /* GameFont.Roboto */,
        fontSize: 20,
        isDesktop: globalState.isDesktop
    });
    let resetDataButton = getButton({
        x: globalState.isDesktop ? 170 : 320,
        y: globalState.isDesktop ? 10 : 20,
        width: 145,
        height: 81,
        backgroundColor: STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "Reset data",
        textXOffset: 25,
        textYOffset: 33,
        font: 1 /* GameFont.Roboto */,
        fontSize: 20,
        isDesktop: globalState.isDesktop
    });
    let updateUI = function (displayProcessing) {
        startOrContinueButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 150);
        startOrContinueButton.setY(displayProcessing.getCanvasHeight() - 400);
        startOrContinueButton.setText(sessionState.hasStarted ? "Continue" : "Start");
        startOrContinueButton.setTextXOffset(sessionState.hasStarted ? 86 : 115);
        startOrContinueButton.setTextYOffset(38);
        creditsButton.setX(displayProcessing.getCanvasWidth() - 150);
    };
    updateUI(displayProcessing);
    let getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {
        updateUI(displayProcessing);
        musicOutput.playMusic(1 /* GameMusic.ChiptuneLevel3 */, 100);
        volumePicker.processFrame({ mouseInput, previousMouseInput });
        soundOutput.setSoundVolume(volumePicker.getCurrentSoundVolume());
        musicOutput.setMusicVolume(volumePicker.getCurrentMusicVolume());
        globalState.saveAndLoadData.saveSoundAndMusicVolume({ soundVolume: soundOutput.getSoundVolume(), musicVolume: musicOutput.getMusicVolume() });
        let wasStartOrContinueButtonClicked = startOrContinueButton.processFrame({ mouseInput }).wasClicked;
        if (wasStartOrContinueButtonClicked) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            if (sessionState.gameState)
                return getGameFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
            else if (sessionState.hasStarted && sessionState.highestUnlockedOpponent === 5 /* Opponent.OpponentCustom */ && !sessionState.hasDisplayedYouWinTooltip)
                return getYouWinFrame({
                    underlyingFrame: getChooseOpponentFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing }),
                    globalState,
                    sessionState,
                    soundOutput,
                    musicOutput,
                    displayProcessing
                });
            else if (sessionState.hasStarted)
                return getChooseOpponentFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
            else
                return getInstructionsScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
        }
        let wasCreditsButtonClicked = creditsButton.processFrame({ mouseInput }).wasClicked;
        if (wasCreditsButtonClicked) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return getCreditsFrame({ globalState, sessionState, displayProcessing });
        }
        if (sessionState.hasStarted) {
            let wasResetDataButtonClicked = resetDataButton.processFrame({ mouseInput }).wasClicked;
            if (wasResetDataButtonClicked) {
                soundOutput.playSound(0 /* GameSound.Click */, 100);
                return getResetDataConfirmationFrame({ underlyingFrame: thisFrame, globalState, sessionState, soundOutput, musicOutput, displayProcessing });
            }
        }
        return thisFrame;
    };
    let render = function (displayOutput) {
        displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);
        displayOutput.drawText(Math.floor(displayOutput.getCanvasWidth() / 2) - 236, displayOutput.getCanvasHeight() - 100, "Symbiosis Chess", 1 /* GameFont.Roboto */, 64, black);
        volumePicker.render(displayOutput);
        startOrContinueButton.render(displayOutput);
        creditsButton.render(displayOutput);
        let version = getCurrentVersion().version;
        displayOutput.drawText(displayOutput.getCanvasWidth() - 55, 105, "v" + version, 1 /* GameFont.Roboto */, 20, black);
        if (sessionState.hasStarted)
            resetDataButton.render(displayOutput);
    };
    return {
        getNextFrame,
        render,
        getClickUrl: null,
        getCompletedAchievements: null
    };
};
export { getTitleScreenFrame };
