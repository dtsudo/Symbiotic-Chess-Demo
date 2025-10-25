import { Chess } from "../ChessJs/chess.js";
import { convertMoveLanToMoveInfo } from "./MoveInfo.js";
import { getOpponentSkillLevel } from "./Opponent.js";
let getOpponentAI = function ({ globalState }) {
    const TIME_TO_THINK_IN_MILLISECONDS = 1000;
    let elapsedMicros = 0;
    let isThinking = false;
    let opponentMoveLan = null;
    let processFrame = function ({ gameState, elapsedMicrosThisFrame }) {
        if (gameState.isGameCompleted)
            return { moveInfo: null };
        if (gameState.boardState.isPlayerWhite === gameState.boardState.isWhiteTurn)
            return { moveInfo: null };
        if (!isThinking) {
            isThinking = true;
            elapsedMicros = 0;
            opponentMoveLan = null;
            let opponentStrength = gameState.opponent === 5 /* Opponent.OpponentCustom */
                ? gameState.customOpponentSkillLevel
                : getOpponentSkillLevel(gameState.opponent);
            globalState.stockfishWrapper.getBestMove({
                previousMoves: gameState.previousMoves,
                timeToThinkInMilliseconds: TIME_TO_THINK_IN_MILLISECONDS,
                stockfishSkillLevel: opponentStrength
            }).then(result => {
                opponentMoveLan = result;
            });
        }
        elapsedMicros += elapsedMicrosThisFrame;
        if (opponentMoveLan !== null && elapsedMicros >= TIME_TO_THINK_IN_MILLISECONDS * 1000) {
            if (gameState.previousMoves.length <= 1) {
                let chess = new Chess(gameState.boardState.fen);
                let moves = chess.moves({ verbose: true });
                let move = moves[Math.floor(Math.random() * moves.length) % moves.length];
                opponentMoveLan = move.lan;
            }
            let moveInfo = convertMoveLanToMoveInfo({ moveLan: opponentMoveLan, isWhiteTurn: gameState.boardState.isWhiteTurn });
            let returnValue = { moveInfo: moveInfo };
            elapsedMicros = 0;
            isThinking = false;
            opponentMoveLan = null;
            return returnValue;
        }
        return { moveInfo: null };
    };
    return {
        processFrame
    };
};
export { getOpponentAI };
