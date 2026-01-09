import { black } from "../DTLibrary/DTColor.js";
import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
let getChooseOpponentButton = function ({ x, y, opponentName, elo, isDesktop }) {
    let button = getButton({
        x: x,
        y: y,
        width: 600,
        height: 70,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "",
        textXOffset: 0,
        textYOffset: 0,
        font: 1 /* GameFont.Roboto */,
        fontSize: 32,
        isDesktop: isDesktop
    });
    let setX = function (newX) {
        x = newX;
        button.setX(newX);
    };
    let setY = function (newY) {
        y = newY;
        button.setY(newY);
    };
    let setElo = function (newElo) {
        elo = newElo;
    };
    let processFrame = function ({ mouseInput }) {
        let wasClicked = button.processFrame({ mouseInput }).wasClicked;
        return {
            wasClicked: wasClicked
        };
    };
    let render = function (displayOutput) {
        button.render(displayOutput);
        displayOutput.drawText(x + 10, y + 60, opponentName, 1 /* GameFont.Roboto */, 32, black);
        displayOutput.drawText(x + 10, y + 30, "Elo: " + elo, 1 /* GameFont.Roboto */, 24, black);
    };
    return {
        processFrame,
        render,
        setX,
        setY,
        setElo
    };
};
export { getChooseOpponentButton };
