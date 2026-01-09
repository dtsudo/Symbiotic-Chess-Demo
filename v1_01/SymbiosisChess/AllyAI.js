import { convertMoveLanToMoveInfo } from "./MoveInfo.js";
let getAllyAI = function ({ globalState }) {
    const TIME_TO_THINK_IN_MILLISECONDS = 1000;
    let elapsedMicros = 0;
    let isThinking = false;
    let moveLan = null;
    let processFrame = function ({ gameState, boardPositionInfo, elapsedMicrosThisFrame }) {
        if (gameState.isGameCompleted)
            return { moveInfo: null };
        if (gameState.boardState.isStockfishTurn === null || gameState.boardState.isStockfishTurn === false)
            return { moveInfo: null };
        if (gameState.boardState.isPlayerWhite !== gameState.boardState.isWhiteTurn)
            return { moveInfo: null };
        if (!isThinking) {
            isThinking = true;
            elapsedMicros = 0;
            moveLan = null;
            globalState.stockfishWrapper.getBestMove({
                previousMoves: gameState.previousMoves,
                timeToThinkInMilliseconds: TIME_TO_THINK_IN_MILLISECONDS,
                stockfishElo: null
            }).then(result => {
                moveLan = result;
            });
        }
        elapsedMicros += elapsedMicrosThisFrame;
        if (moveLan !== null && elapsedMicros >= TIME_TO_THINK_IN_MILLISECONDS * 1000) {
            let moveInfo;
            if (boardPositionInfo !== null && boardPositionInfo.bestMove !== null)
                moveInfo = boardPositionInfo.bestMove;
            else
                moveInfo = convertMoveLanToMoveInfo({ moveLan: moveLan, isWhiteTurn: gameState.boardState.isWhiteTurn });
            let returnValue = { moveInfo: moveInfo };
            elapsedMicros = 0;
            isThinking = false;
            moveLan = null;
            return returnValue;
        }
        return { moveInfo: null };
    };
    return {
        processFrame
    };
};
export { getAllyAI };
