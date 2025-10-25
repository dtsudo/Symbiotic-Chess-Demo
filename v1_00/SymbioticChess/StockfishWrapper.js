import { getStockfishHelper } from "./StockfishHelper.js";
let getStockfishWrapper = function ({ stockfishLocation }) {
    let stockfishHelperCustomStrength = getStockfishHelper({ stockfishLocation: stockfishLocation, stockfishSkillLevel: 5 /* arbitrary */ });
    let stockfishHelperMaxStrength = getStockfishHelper({ stockfishLocation: stockfishLocation, stockfishSkillLevel: null });
    let getBestMove = function ({ previousMoves, timeToThinkInMilliseconds, stockfishSkillLevel }) {
        if (stockfishSkillLevel === null) {
            if (!stockfishHelperMaxStrength.isIdle()) {
                stockfishHelperMaxStrength.quit();
                stockfishHelperMaxStrength = getStockfishHelper({ stockfishLocation: stockfishLocation, stockfishSkillLevel: null });
            }
            return stockfishHelperMaxStrength.getBestMove({ previousMoves, timeToThinkInMilliseconds });
        }
        if (!stockfishHelperCustomStrength.isIdle() || stockfishHelperCustomStrength.getSkillLevel() !== stockfishSkillLevel) {
            stockfishHelperCustomStrength.quit();
            stockfishHelperCustomStrength = getStockfishHelper({ stockfishLocation: stockfishLocation, stockfishSkillLevel: stockfishSkillLevel });
        }
        return stockfishHelperCustomStrength.getBestMove({ previousMoves, timeToThinkInMilliseconds });
    };
    let getBoardPositionInfo = function ({ previousMoves, timeToThinkInMilliseconds }) {
        if (!stockfishHelperMaxStrength.isIdle()) {
            stockfishHelperMaxStrength.quit();
            stockfishHelperMaxStrength = getStockfishHelper({ stockfishLocation: stockfishLocation, stockfishSkillLevel: null });
        }
        return stockfishHelperMaxStrength.getBoardPositionInfo({ previousMoves: previousMoves, timeToThinkInMilliseconds: timeToThinkInMilliseconds });
    };
    let quit = function () {
        stockfishHelperCustomStrength.quit();
        stockfishHelperMaxStrength.quit();
    };
    return {
        getBestMove,
        getBoardPositionInfo,
        quit
    };
};
export { getStockfishWrapper };
