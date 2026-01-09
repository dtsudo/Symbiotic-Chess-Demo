let getCanvasDisplayRectangle = function ({ getCurrentCanvasHeight, canvas }) {
    let context = null;
    let drawRectangle = function (x, y, width, height, color, fill) {
        y = getCurrentCanvasHeight() - y - height;
        let red = color.r;
        let green = color.g;
        let blue = color.b;
        let alpha = color.alpha;
        if (context === null)
            context = canvas.getContext("2d", { alpha: false });
        context.fillStyle = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", " + (alpha / 255).toString() + ")";
        context.strokeStyle = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", " + (alpha / 255).toString() + ")";
        if (fill)
            context.fillRect(x, y, width, height);
        else
            context.strokeRect(x, y, width, height);
    };
    return {
        drawRectangle
    };
};
export { getCanvasDisplayRectangle };
