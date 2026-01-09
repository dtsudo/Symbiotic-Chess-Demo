import { getStockfishHelper, MINIMUM_STOCKFISH_ELO } from "./StockfishHelper.js";
let getStockfishWrapper = function ({ stockfishLocation }) {
    let stockfishHelperCustomStrength = getStockfishHelper({ stockfishLocation: stockfishLocation, stockfishElo: MINIMUM_STOCKFISH_ELO /* arbitrary */ });
    let stockfishHelperMaxStrength = getStockfishHelper({ stockfishLocation: stockfishLocation, stockfishElo: null });
    let getBestMove = function ({ previousMoves, timeToThinkInMilliseconds, stockfishElo }) {
        if (stockfishElo === null) {
            if (!stockfishHelperMaxStrength.isIdle()) {
                stockfishHelperMaxStrength.quit();
                stockfishHelperMaxStrength = getStockfishHelper({ stockfishLocation: stockfishLocation, stockfishElo: null });
            }
            return stockfishHelperMaxStrength.getBestMove({ previousMoves, timeToThinkInMilliseconds });
        }
        if (!stockfishHelperCustomStrength.isIdle() || stockfishHelperCustomStrength.getElo() !== stockfishElo) {
            stockfishHelperCustomStrength.quit();
            stockfishHelperCustomStrength = getStockfishHelper({ stockfishLocation: stockfishLocation, stockfishElo: stockfishElo });
        }
        return stockfishHelperCustomStrength.getBestMove({ previousMoves, timeToThinkInMilliseconds });
    };
    let getBoardPositionInfo = function ({ previousMoves, timeToThinkInMilliseconds }) {
        if (!stockfishHelperMaxStrength.isIdle()) {
            stockfishHelperMaxStrength.quit();
            stockfishHelperMaxStrength = getStockfishHelper({ stockfishLocation: stockfishLocation, stockfishElo: null });
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
