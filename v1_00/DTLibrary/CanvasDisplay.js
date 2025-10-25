import { getCanvasDisplayRectangle } from "./CanvasDisplay_Rectangle.js";
import { getCanvasDisplayImages } from "./CanvasDisplay_Images.js";
import { getCanvasDisplayFont } from "./CanvasDisplay_Font.js";
let getDisplay = function ({ getCurrentCanvasWidth, getCurrentCanvasHeight, imageSmoothingEnabled, canvasScalingFactor, canvas, browserDocument }) {
    let canvasDisplayRectangle = getCanvasDisplayRectangle({
        getCurrentCanvasHeight: getCurrentCanvasHeight,
        canvas: canvas
    });
    let canvasDisplayImages = getCanvasDisplayImages({
        getCurrentCanvasHeight: getCurrentCanvasHeight,
        imageSmoothingEnabled: imageSmoothingEnabled,
        canvasScalingFactor: canvasScalingFactor,
        canvas: canvas
    });
    let canvasDisplayFont = getCanvasDisplayFont({
        getCurrentCanvasHeight: getCurrentCanvasHeight,
        canvas: canvas,
        browserDocument: browserDocument
    });
    let load = function () {
        let hasFinishedLoadingImages = canvasDisplayImages.loadImages();
        let hasFinishedLoadingFonts = canvasDisplayFont.loadFonts();
        return hasFinishedLoadingImages && hasFinishedLoadingFonts;
    };
    return {
        load,
        drawRectangle: canvasDisplayRectangle.drawRectangle,
        getWidth: canvasDisplayImages.getWidth,
        getHeight: canvasDisplayImages.getHeight,
        drawImage: canvasDisplayImages.drawImage,
        drawImageRotatedClockwise: canvasDisplayImages.drawImageRotatedClockwise,
        drawText: canvasDisplayFont.drawText,
        tryDrawText: canvasDisplayFont.tryDrawText,
        getCanvasWidth: function () { return getCurrentCanvasWidth(); },
        getCanvasHeight: function () { return getCurrentCanvasHeight(); },
        isLandscapeOrientation: function () { return getCurrentCanvasWidth() > getCurrentCanvasHeight(); }
    };
};
export { getDisplay };
