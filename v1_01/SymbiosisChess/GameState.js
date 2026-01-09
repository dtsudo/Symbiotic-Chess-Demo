import { Chess } from "../ChessJs/chess.js";
import { getByteListBuilder, getByteListIterator } from "../DTLibrary/ByteListUtil.js";
import { deserializeBoardState, getInitialBoardState, getNewBoardStateAfterMove, serializeBoardState } from "./BoardState.js";
import { getMoveLanFromMoveInfo, getMoveSanFromMoveInfo } from "./MoveInfo.js";
import { getOpponentFromOpponentId, getOpponentIdFromOpponent } from "./Opponent.js";
import { deserializePreviousMove, serializePreviousMove } from "./PreviousMove.js";
let serializeGameState = function (gameState) {
    let byteListBuilder = getByteListBuilder();
    byteListBuilder.addByteList(serializeBoardState(gameState.boardState));
    byteListBuilder.addInt(gameState.previousMoves.length);
    for (let previousMove of gameState.previousMoves) {
        byteListBuilder.addByteList(serializePreviousMove(previousMove));
    }
    byteListBuilder.addInt(getOpponentIdFromOpponent(gameState.opponent));
    byteListBuilder.addNullableInt(gameState.customOpponentElo);
    byteListBuilder.addBool(gameState.isGameCompleted);
    let returnValue = byteListBuilder.toByteList();
    return returnValue;
};
let deserializeGameState = function (serializedGameState) {
    let byteListIterator = getByteListIterator(serializedGameState);
    let boardState = deserializeBoardState(byteListIterator.popByteList());
    let previousMovesLength = byteListIterator.popInt();
    let previousMoves = [];
    for (let i = 0; i < previousMovesLength; i++)
        previousMoves.push(deserializePreviousMove(byteListIterator.popByteList()));
    let opponent = getOpponentFromOpponentId(byteListIterator.popInt());
    let customOpponentElo = byteListIterator.popNullableInt();
    let isGameCompleted = byteListIterator.popBool();
    if (byteListIterator.hasNextByte())
        throw new Error("Invalid serializedGameState");
    return {
        boardState,
        previousMoves,
        opponent,
        customOpponentElo,
        isGameCompleted
    };
};
let processAskStockfishPower = function ({ gameState }) {
    let boardState = gameState.boardState;
    let newBoardState = {
        board: boardState.board,
        isWhiteTurn: boardState.isWhiteTurn,
        isPlayerWhite: boardState.isPlayerWhite,
        isStockfishTurn: true,
        fen: boardState.fen,
        numAskStockfishPower: boardState.numAskStockfishPower - 1,
        numGetEvalPower: boardState.numGetEvalPower,
        numGetOpponentResponsePower: boardState.numGetOpponentResponsePower,
        numGetPieceToMovePower: boardState.numGetPieceToMovePower,
        usedGetEvalPowerThisTurn: boardState.usedGetEvalPowerThisTurn,
        evalPower_boardEvaluation: boardState.evalPower_boardEvaluation,
        usedGetOpponentResponsePowerThisTurn: boardState.usedGetOpponentResponsePowerThisTurn,
        opponentResponsePower_opponentMove: boardState.opponentResponsePower_opponentMove,
        usedGetPieceToMovePowerThisTurn: boardState.usedGetPieceToMovePowerThisTurn,
        pieceToMovePower_bestPieceToMove: boardState.pieceToMovePower_bestPieceToMove
    };
    return {
        boardState: newBoardState,
        previousMoves: gameState.previousMoves,
        opponent: gameState.opponent,
        customOpponentElo: gameState.customOpponentElo,
        isGameCompleted: gameState.isGameCompleted
    };
};
let processGetEvalPower = function ({ gameState }) {
    let boardState = gameState.boardState;
    let newBoardState = {
        board: boardState.board,
        isWhiteTurn: boardState.isWhiteTurn,
        isPlayerWhite: boardState.isPlayerWhite,
        isStockfishTurn: boardState.isStockfishTurn,
        fen: boardState.fen,
        numAskStockfishPower: boardState.numAskStockfishPower,
        numGetEvalPower: boardState.numGetEvalPower - 1,
        numGetOpponentResponsePower: boardState.numGetOpponentResponsePower,
        numGetPieceToMovePower: boardState.numGetPieceToMovePower,
        usedGetEvalPowerThisTurn: true,
        evalPower_boardEvaluation: boardState.evalPower_boardEvaluation,
        usedGetOpponentResponsePowerThisTurn: boardState.usedGetOpponentResponsePowerThisTurn,
        opponentResponsePower_opponentMove: boardState.opponentResponsePower_opponentMove,
        usedGetPieceToMovePowerThisTurn: boardState.usedGetPieceToMovePowerThisTurn,
        pieceToMovePower_bestPieceToMove: boardState.pieceToMovePower_bestPieceToMove
    };
    return {
        boardState: newBoardState,
        previousMoves: gameState.previousMoves,
        opponent: gameState.opponent,
        customOpponentElo: gameState.customOpponentElo,
        isGameCompleted: gameState.isGameCompleted
    };
};
let processGetOpponentResponsePower = function ({ gameState }) {
    let boardState = gameState.boardState;
    let newBoardState = {
        board: boardState.board,
        isWhiteTurn: boardState.isWhiteTurn,
        isPlayerWhite: boardState.isPlayerWhite,
        isStockfishTurn: boardState.isStockfishTurn,
        fen: boardState.fen,
        numAskStockfishPower: boardState.numAskStockfishPower,
        numGetEvalPower: boardState.numGetEvalPower,
        numGetOpponentResponsePower: boardState.numGetOpponentResponsePower - 1,
        numGetPieceToMovePower: boardState.numGetPieceToMovePower,
        usedGetEvalPowerThisTurn: boardState.usedGetEvalPowerThisTurn,
        evalPower_boardEvaluation: boardState.evalPower_boardEvaluation,
        usedGetOpponentResponsePowerThisTurn: true,
        opponentResponsePower_opponentMove: boardState.opponentResponsePower_opponentMove,
        usedGetPieceToMovePowerThisTurn: boardState.usedGetPieceToMovePowerThisTurn,
        pieceToMovePower_bestPieceToMove: boardState.pieceToMovePower_bestPieceToMove
    };
    return {
        boardState: newBoardState,
        previousMoves: gameState.previousMoves,
        opponent: gameState.opponent,
        customOpponentElo: gameState.customOpponentElo,
        isGameCompleted: gameState.isGameCompleted
    };
};
let processGetPieceToMovePower = function ({ gameState }) {
    let boardState = gameState.boardState;
    let newBoardState = {
        board: boardState.board,
        isWhiteTurn: boardState.isWhiteTurn,
        isPlayerWhite: boardState.isPlayerWhite,
        isStockfishTurn: boardState.isStockfishTurn,
        fen: boardState.fen,
        numAskStockfishPower: boardState.numAskStockfishPower,
        numGetEvalPower: boardState.numGetEvalPower,
        numGetOpponentResponsePower: boardState.numGetOpponentResponsePower,
        numGetPieceToMovePower: boardState.numGetPieceToMovePower - 1,
        usedGetEvalPowerThisTurn: boardState.usedGetEvalPowerThisTurn,
        evalPower_boardEvaluation: boardState.evalPower_boardEvaluation,
        usedGetOpponentResponsePowerThisTurn: boardState.usedGetOpponentResponsePowerThisTurn,
        opponentResponsePower_opponentMove: boardState.opponentResponsePower_opponentMove,
        usedGetPieceToMovePowerThisTurn: true,
        pieceToMovePower_bestPieceToMove: boardState.pieceToMovePower_bestPieceToMove
    };
    return {
        boardState: newBoardState,
        previousMoves: gameState.previousMoves,
        opponent: gameState.opponent,
        customOpponentElo: gameState.customOpponentElo,
        isGameCompleted: gameState.isGameCompleted
    };
};
let processMove = function ({ gameState, moveInfo, boardPositionInfo }) {
    let newBoardState = getNewBoardStateAfterMove({ boardState: gameState.boardState, moveInfo: moveInfo });
    let newPreviousMoves = [...gameState.previousMoves];
    newPreviousMoves.push({
        moveSan: getMoveSanFromMoveInfo({ fen: gameState.boardState.fen, moveInfo: moveInfo }),
        moveLan: getMoveLanFromMoveInfo({ moveInfo: moveInfo }),
        moveNumber: Math.floor(gameState.previousMoves.length / 2) + 1,
        previousBoardState: {
            board: gameState.boardState.board,
            isWhiteTurn: gameState.boardState.isWhiteTurn,
            isPlayerWhite: gameState.boardState.isPlayerWhite,
            isStockfishTurn: gameState.boardState.isStockfishTurn,
            fen: gameState.boardState.fen,
            numAskStockfishPower: gameState.boardState.numAskStockfishPower,
            numGetEvalPower: gameState.boardState.numGetEvalPower,
            numGetOpponentResponsePower: gameState.boardState.numGetOpponentResponsePower,
            numGetPieceToMovePower: gameState.boardState.numGetPieceToMovePower,
            usedGetEvalPowerThisTurn: gameState.boardState.usedGetEvalPowerThisTurn,
            evalPower_boardEvaluation: gameState.boardState.usedGetEvalPowerThisTurn && boardPositionInfo !== null && boardPositionInfo.positionEvaluation !== null
                ? { centipawns: boardPositionInfo.positionEvaluation.centipawns, checkmate: boardPositionInfo.positionEvaluation.checkmate }
                : null,
            usedGetOpponentResponsePowerThisTurn: gameState.boardState.usedGetOpponentResponsePowerThisTurn,
            opponentResponsePower_opponentMove: gameState.boardState.usedGetOpponentResponsePowerThisTurn && boardPositionInfo !== null
                ? boardPositionInfo.bestOpponentResponse
                : null,
            usedGetPieceToMovePowerThisTurn: gameState.boardState.usedGetPieceToMovePowerThisTurn,
            pieceToMovePower_bestPieceToMove: gameState.boardState.usedGetPieceToMovePowerThisTurn && boardPositionInfo !== null && boardPositionInfo.bestMove !== null
                ? { i: boardPositionInfo.bestMove.originSquareI, j: boardPositionInfo.bestMove.originSquareJ }
                : null
        }
    });
    let chess = new Chess();
    for (let previousMove of newPreviousMoves)
        chess.move(previousMove.moveSan);
    return {
        boardState: newBoardState,
        previousMoves: newPreviousMoves,
        opponent: gameState.opponent,
        customOpponentElo: gameState.customOpponentElo,
        isGameCompleted: chess.isGameOver()
    };
};
let getInitialGameState = function ({ isPlayerWhite, numAskStockfishPower, numGetEvalPower, numGetOpponentResponsePower, numGetPieceToMovePower, opponent, customOpponentElo }) {
    return {
        boardState: getInitialBoardState({ isPlayerWhite, numAskStockfishPower, numGetEvalPower, numGetOpponentResponsePower, numGetPieceToMovePower }),
        previousMoves: [],
        opponent: opponent,
        customOpponentElo: customOpponentElo,
        isGameCompleted: false
    };
};
export { serializeGameState, deserializeGameState, getInitialGameState, processMove, processAskStockfishPower, processGetEvalPower, processGetOpponentResponsePower, processGetPieceToMovePower };
