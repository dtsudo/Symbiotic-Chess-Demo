import { MINIMUM_WINDOW_SHORT_EDGE, MINIMUM_WINDOW_LONG_EDGE } from "./SymbioticChess/GlobalConstants.js";
let createHtmlElements = function ({ showFps, browserDocument }) {
    browserDocument.body.style.overflow = "hidden";
    let fpsWrapperDiv = browserDocument.createElement("div");
    fpsWrapperDiv.style.position = "absolute";
    fpsWrapperDiv.style.padding = "5px";
    let fpsLabel = browserDocument.createElement("span");
    if (showFps) {
        let textNode = browserDocument.createTextNode("FPS: ");
        fpsLabel.appendChild(textNode);
    }
    fpsWrapperDiv.appendChild(fpsLabel);
    let fpsNode = browserDocument.createElement("span");
    fpsWrapperDiv.appendChild(fpsNode);
    browserDocument.body.appendChild(fpsWrapperDiv);
    let canvasWrapperDiv = browserDocument.createElement("div");
    canvasWrapperDiv.style.textAlign = "center";
    let canvas = browserDocument.createElement("canvas");
    canvas.width = MINIMUM_WINDOW_LONG_EDGE;
    canvas.height = MINIMUM_WINDOW_SHORT_EDGE;
    canvasWrapperDiv.appendChild(canvas);
    browserDocument.body.appendChild(canvasWrapperDiv);
    return {
        canvas: canvas,
        fpsNode: fpsNode
    };
};
export { createHtmlElements };
