import { getSnapshot as getMouseSnapshot } from "../DTLibrary/CopiedMouse.js";
import { STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { black } from "../DTLibrary/DTColor.js";
let getUsePowerButton = function ({ x, y, text, textXOffset, textYOffset, isDesktop }) {
    let width1 = 120;
    let width2 = 80;
    let height = 80;
    let previousMouseInput = null;
    let isHoverOverMainButton = false;
    let isHoverOverTooltipButton = false;
    let isClickedMainButton = false;
    let isClickedTooltipButton = false;
    let isMouseInRangeOfMainButton = function (mouseInput) {
        let mouseX = mouseInput.getX();
        let mouseY = mouseInput.getY();
        return x <= mouseX
            && mouseX <= x + width1
            && y <= mouseY
            && mouseY <= y + height;
    };
    let isMouseInRangeOfTooltipButton = function (mouseInput) {
        let mouseX = mouseInput.getX();
        let mouseY = mouseInput.getY();
        return x + width1 < mouseX
            && mouseX <= x + width1 + width2
            && y <= mouseY
            && mouseY <= y + height;
    };
    let processFrame = function ({ mouseInput }) {
        let didUserClickOnMainButton = false;
        if (isMouseInRangeOfMainButton(mouseInput)) {
            isHoverOverMainButton = true;
            if (mouseInput.isLeftMouseButtonPressed() && previousMouseInput !== null && !previousMouseInput.isLeftMouseButtonPressed())
                isClickedMainButton = true;
            if (isClickedMainButton && !mouseInput.isLeftMouseButtonPressed() && previousMouseInput !== null && previousMouseInput.isLeftMouseButtonPressed())
                didUserClickOnMainButton = true;
        }
        else {
            isHoverOverMainButton = false;
        }
        if (!mouseInput.isLeftMouseButtonPressed())
            isClickedMainButton = false;
        let didUserClickOnTooltipButton = false;
        if (isMouseInRangeOfTooltipButton(mouseInput)) {
            isHoverOverTooltipButton = true;
            if (mouseInput.isLeftMouseButtonPressed() && previousMouseInput !== null && !previousMouseInput.isLeftMouseButtonPressed())
                isClickedTooltipButton = true;
            if (isClickedTooltipButton && !mouseInput.isLeftMouseButtonPressed() && previousMouseInput !== null && previousMouseInput.isLeftMouseButtonPressed())
                didUserClickOnTooltipButton = true;
        }
        else {
            isHoverOverTooltipButton = false;
        }
        if (!mouseInput.isLeftMouseButtonPressed())
            isClickedTooltipButton = false;
        previousMouseInput = getMouseSnapshot(mouseInput);
        return {
            wasMainButtonClicked: didUserClickOnMainButton,
            wasTooltipButtonClicked: didUserClickOnTooltipButton
        };
    };
    let render = function (displayOutput) {
        let color = STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR;
        if (isHoverOverMainButton && isDesktop)
            color = STANDARD_HOVER_COLOR;
        if (isClickedMainButton)
            color = STANDARD_CLICK_COLOR;
        displayOutput.drawRectangle(x, y, width1, height, color, true);
        displayOutput.drawRectangle(x, y, width1, height, black, false);
        displayOutput.drawText(x + textXOffset, y + height - textYOffset, text, 1 /* GameFont.Roboto */, 16, black);
        color = STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR;
        if ((isHoverOverMainButton || isHoverOverTooltipButton) && isDesktop)
            color = STANDARD_HOVER_COLOR;
        if (isClickedMainButton || isClickedTooltipButton)
            color = STANDARD_CLICK_COLOR;
        displayOutput.drawRectangle(x + width1, y, width2, height, color, true);
        displayOutput.drawRectangle(x + width1, y, width2, height, black, false);
        displayOutput.drawText(x + width1 + 30, y + height - 25, "?", 1 /* GameFont.Roboto */, 42, black);
    };
    return {
        processFrame,
        render,
        setX: function (input) { x = input; },
        setY: function (input) { y = input; }
    };
};
export { getUsePowerButton };
