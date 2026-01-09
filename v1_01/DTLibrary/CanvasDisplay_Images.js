import { getImageNames, getFilename } from "./GameImage.js";
let getCanvasDisplayImages = function ({ getCurrentCanvasHeight, imageSmoothingEnabled, canvasScalingFactor, canvas }) {
    let imgDict = {};
    let widthDict = {};
    let heightDict = {};
    let context = null;
    let radianConversion = 1.0 / 128.0 * (2.0 * Math.PI / 360.0);
    let numberOfImagesLoaded = 0;
    let loadImages = function () {
        let imageNamesArray = getImageNames();
        let count = 0;
        for (let imageName of imageNamesArray) {
            if (imgDict[imageName])
                continue;
            let fileName = getFilename(imageName);
            let imgPath = "Data/Images/" + fileName;
            let img = new Image();
            img.addEventListener("load", function () {
                numberOfImagesLoaded++;
                widthDict[imageName] = img.naturalWidth;
                heightDict[imageName] = img.naturalHeight;
            });
            img.src = imgPath;
            imgDict[imageName] = img;
            count++;
            if (count === 15) // arbitrary
                return false;
        }
        return numberOfImagesLoaded === imageNamesArray.length;
    };
    let drawImageRotatedClockwise = function (image, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled) {
        if (context === null) {
            context = canvas.getContext("2d", { alpha: false });
            context.imageSmoothingEnabled = imageSmoothingEnabled;
        }
        let scaledHeight = imageHeight * scalingFactorScaled / 128;
        y = Math.floor(getCurrentCanvasHeight() - y - scaledHeight);
        let img = imgDict[image];
        let scalingFactor = scalingFactorScaled / 128.0;
        context.translate(x, y);
        context.scale(scalingFactor, scalingFactor);
        if (degreesScaled !== 0) {
            context.translate(imageWidth / 2, imageHeight / 2);
            context.rotate(degreesScaled * radianConversion);
            context.translate(-imageWidth / 2, -imageHeight / 2);
        }
        context.drawImage(img, imageX, imageY, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);
        context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
    };
    let getWidth = function (image) {
        return widthDict[image];
    };
    let getHeight = function (image) {
        return heightDict[image];
    };
    let drawImage = function (image, x, y) {
        drawImageRotatedClockwise(image, 0, 0, widthDict[image], heightDict[image], x, y, 0, 128);
    };
    return {
        loadImages,
        drawImage,
        drawImageRotatedClockwise,
        getWidth,
        getHeight
    };
};
export { getCanvasDisplayImages };
