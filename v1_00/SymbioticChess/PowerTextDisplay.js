import { getNewBoardStateAfterMove } from "./BoardState.js";
import { getMoveSanFromMoveInfo } from "./MoveInfo.js";
let getColumnName = function (i) {
    switch (i) {
        case 0: return "a";
        case 1: return "b";
        case 2: return "c";
        case 3: return "d";
        case 4: return "e";
        case 5: return "f";
        case 6: return "g";
        case 7: return "h";
        default: throw new Error("Unrecognized value");
    }
};
let getPowerTextDisplay = function ({ boardState, boardPositionInfo }) {
    let strArray = [];
    if (boardState.usedGetEvalPowerThisTurn && boardPositionInfo !== null && boardPositionInfo.positionEvaluation !== null) {
        let description;
        if (boardPositionInfo.positionEvaluation.centipawns !== null) {
            let centipawns = boardPositionInfo.positionEvaluation.centipawns;
            if (centipawns === 0)
                description = "The current evaluation is 0.00.";
            else if (centipawns > 0)
                description = "The current evaluation is +" + (centipawns / 100).toFixed(2) + ".";
            else
                description = "The current evaluation is -" + (-centipawns / 100).toFixed(2) + ".";
        }
        else {
            description = "The current evaluation is #" + boardPositionInfo.positionEvaluation.checkmate + ".";
        }
        strArray.push(description);
    }
    if (boardState.usedGetPieceToMovePowerThisTurn && boardPositionInfo !== null && boardPositionInfo.bestMove !== null) {
        let description = "You should move the piece at " + getColumnName(boardPositionInfo.bestMove.originSquareI) + (boardPositionInfo.bestMove.originSquareJ + 1) + ".";
        strArray.push(description);
    }
    if (boardState.usedGetOpponentResponsePowerThisTurn && boardPositionInfo !== null && boardPositionInfo.bestMove !== null && boardPositionInfo.bestOpponentResponse !== null) {
        let tempBoard = getNewBoardStateAfterMove({ boardState: boardState, moveInfo: boardPositionInfo.bestMove });
        let description = "Your opponent's next move in the principal variation is " + getMoveSanFromMoveInfo({ fen: tempBoard.fen, moveInfo: boardPositionInfo.bestOpponentResponse }) + ".";
        strArray.push(description);
    }
    return strArray.join("\n");
};
export { getPowerTextDisplay };
