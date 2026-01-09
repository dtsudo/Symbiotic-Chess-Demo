import { getSnapshot as getMouseSnapshot } from "../DTLibrary/CopiedMouse.js";
import { black, white } from "../DTLibrary/DTColor.js";
import { STANDARD_HOVER_COLOR } from "./Button.js";
import { MAXIMUM_STOCKFISH_ELO, MINIMUM_STOCKFISH_ELO } from "./StockfishHelper.js";
let getEloSlider = function ({ x, y, elo }) {
    let previousMouseInput = null;
    let isHoverOverSlider = false;
    let isMovingSlider = false;
    let setX = function (newX) {
        x = newX;
    };
    let setY = function (newY) {
        y = newY;
    };
    let getSelectedElo = function () {
        return elo;
    };
    let processFrame = function ({ mouseInput }) {
        if (previousMouseInput === null) {
            previousMouseInput = getMouseSnapshot(mouseInput);
            return { isInteractingWithSlider: false };
        }
        let mouseX = mouseInput.getX();
        let mouseY = mouseInput.getY();
        isHoverOverSlider = x <= mouseX && mouseX <= (x + 300) && y <= mouseY && mouseY <= (y + 50);
        if (mouseInput.isLeftMouseButtonPressed() && !previousMouseInput.isLeftMouseButtonPressed() && isHoverOverSlider)
            isMovingSlider = true;
        if (isMovingSlider && mouseInput.isLeftMouseButtonPressed()) {
            let delta = mouseX - x;
            if (delta < 0)
                delta = 0;
            if (delta > 300)
                delta = 300;
            elo = MINIMUM_STOCKFISH_ELO + Math.round(delta * (MAXIMUM_STOCKFISH_ELO - MINIMUM_STOCKFISH_ELO) / 300);
            if (elo < MINIMUM_STOCKFISH_ELO)
                elo = MINIMUM_STOCKFISH_ELO;
            if (elo > MAXIMUM_STOCKFISH_ELO)
                elo = MAXIMUM_STOCKFISH_ELO;
        }
        if (!mouseInput.isLeftMouseButtonPressed())
            isMovingSlider = false;
        previousMouseInput = getMouseSnapshot(mouseInput);
        return {
            isInteractingWithSlider: isHoverOverSlider || isMovingSlider
        };
    };
    let render = function (displayOutput) {
        if (isHoverOverSlider || isMovingSlider) {
            displayOutput.drawRectangle(x, y, 300, 50, STANDARD_HOVER_COLOR, true);
        }
        displayOutput.drawRectangle(x, y + 24, 300, 2, { r: 150, g: 150, b: 150, alpha: 255 }, true);
        let range = MAXIMUM_STOCKFISH_ELO - MINIMUM_STOCKFISH_ELO;
        let delta = elo - MINIMUM_STOCKFISH_ELO;
        let xPixel = Math.round(delta * 300 / range);
        if (xPixel > 0) {
            displayOutput.drawRectangle(x, y + 23, xPixel, 5, black, true);
        }
        displayOutput.drawRectangle(x + xPixel - 5, y + 13, 10, 25, white, true);
        displayOutput.drawRectangle(x + xPixel - 5, y + 13, 10, 25, black, false);
    };
    return {
        setX,
        setY,
        getSelectedElo,
        processFrame,
        render
    };
};
export { getEloSlider };
