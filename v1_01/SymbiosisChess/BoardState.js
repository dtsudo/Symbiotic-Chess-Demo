import { Chess } from "../ChessJs/chess.js";
import { getByteListBuilder, getByteListIterator } from "../DTLibrary/ByteListUtil.js";
import { getMoveSanFromMoveInfo } from "./MoveInfo.js";
import { getPieceTypeFromPieceTypeId, getPieceTypeIdFromPieceType } from "./PieceType.js";
let serializeBoardState = function (boardState) {
    let byteListBuilder = getByteListBuilder();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let pieceType = boardState.board[i][j].pieceType;
            let pieceTypeId = pieceType !== null ? getPieceTypeIdFromPieceType(pieceType) : null;
            byteListBuilder.addNullableInt(pieceTypeId);
            byteListBuilder.addNullableInt(boardState.board[i][j].pieceId);
        }
    }
    byteListBuilder.addBool(boardState.isWhiteTurn);
    byteListBuilder.addBool(boardState.isPlayerWhite);
    byteListBuilder.addNullableBool(boardState.isStockfishTurn);
    byteListBuilder.addString(boardState.fen);
    byteListBuilder.addInt(boardState.numAskStockfishPower);
    byteListBuilder.addInt(boardState.numGetEvalPower);
    byteListBuilder.addInt(boardState.numGetOpponentResponsePower);
    byteListBuilder.addInt(boardState.numGetPieceToMovePower);
    byteListBuilder.addBool(boardState.usedGetEvalPowerThisTurn);
    if (boardState.evalPower_boardEvaluation !== null) {
        byteListBuilder.addBool(true);
        byteListBuilder.addNullableInt(boardState.evalPower_boardEvaluation.centipawns);
        byteListBuilder.addNullableInt(boardState.evalPower_boardEvaluation.checkmate);
    }
    else {
        byteListBuilder.addBool(false);
    }
    byteListBuilder.addBool(boardState.usedGetOpponentResponsePowerThisTurn);
    if (boardState.opponentResponsePower_opponentMove !== null) {
        byteListBuilder.addBool(true);
        byteListBuilder.addInt(boardState.opponentResponsePower_opponentMove.originSquareI);
        byteListBuilder.addInt(boardState.opponentResponsePower_opponentMove.originSquareJ);
        byteListBuilder.addInt(boardState.opponentResponsePower_opponentMove.destinationSquareI);
        byteListBuilder.addInt(boardState.opponentResponsePower_opponentMove.destinationSquareJ);
        if (boardState.opponentResponsePower_opponentMove.promotion !== null) {
            byteListBuilder.addBool(true);
            byteListBuilder.addInt(getPieceTypeIdFromPieceType(boardState.opponentResponsePower_opponentMove.promotion));
        }
        else {
            byteListBuilder.addBool(false);
        }
    }
    else {
        byteListBuilder.addBool(false);
    }
    byteListBuilder.addBool(boardState.usedGetPieceToMovePowerThisTurn);
    if (boardState.pieceToMovePower_bestPieceToMove !== null) {
        byteListBuilder.addBool(true);
        byteListBuilder.addInt(boardState.pieceToMovePower_bestPieceToMove.i);
        byteListBuilder.addInt(boardState.pieceToMovePower_bestPieceToMove.j);
    }
    else {
        byteListBuilder.addBool(false);
    }
    let returnValue = byteListBuilder.toByteList();
    return returnValue;
};
let deserializeBoardState = function (serializedBoardState) {
    let byteListIterator = getByteListIterator(serializedBoardState);
    let board = [];
    for (let i = 0; i < 8; i++) {
        let boardColumn = [];
        for (let j = 0; j < 8; j++)
            boardColumn.push({ pieceType: null, pieceId: null });
        board.push(boardColumn);
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let pieceTypeId = byteListIterator.popNullableInt();
            let pieceType = pieceTypeId !== null ? getPieceTypeFromPieceTypeId(pieceTypeId) : null;
            let pieceId = byteListIterator.popNullableInt();
            board[i][j] = { pieceType, pieceId };
        }
    }
    let isWhiteTurn = byteListIterator.popBool();
    let isPlayerWhite = byteListIterator.popBool();
    let isStockfishTurn = byteListIterator.popNullableBool();
    let fen = byteListIterator.popString();
    let numAskStockfishPower = byteListIterator.popInt();
    let numGetEvalPower = byteListIterator.popInt();
    let numGetOpponentResponsePower = byteListIterator.popInt();
    let numGetPieceToMovePower = byteListIterator.popInt();
    let usedGetEvalPowerThisTurn = byteListIterator.popBool();
    let evalPower_boardEvaluation;
    if (byteListIterator.popBool()) {
        let centipawns = byteListIterator.popNullableInt();
        let checkmate = byteListIterator.popNullableInt();
        evalPower_boardEvaluation = { centipawns, checkmate };
    }
    else {
        evalPower_boardEvaluation = null;
    }
    let usedGetOpponentResponsePowerThisTurn = byteListIterator.popBool();
    let opponentResponsePower_opponentMove;
    if (byteListIterator.popBool()) {
        let originSquareI = byteListIterator.popInt();
        let originSquareJ = byteListIterator.popInt();
        let destinationSquareI = byteListIterator.popInt();
        let destinationSquareJ = byteListIterator.popInt();
        let promotion;
        if (byteListIterator.popBool()) {
            promotion = getPieceTypeFromPieceTypeId(byteListIterator.popInt());
        }
        else {
            promotion = null;
        }
        opponentResponsePower_opponentMove = { originSquareI, originSquareJ, destinationSquareI, destinationSquareJ, promotion };
    }
    else {
        opponentResponsePower_opponentMove = null;
    }
    let usedGetPieceToMovePowerThisTurn = byteListIterator.popBool();
    let pieceToMovePower_bestPieceToMove;
    if (byteListIterator.popBool()) {
        let i = byteListIterator.popInt();
        let j = byteListIterator.popInt();
        pieceToMovePower_bestPieceToMove = { i, j };
    }
    else {
        pieceToMovePower_bestPieceToMove = null;
    }
    if (byteListIterator.hasNextByte())
        throw new Error("Invalid serializedBoardState");
    return {
        board: board,
        isWhiteTurn: isWhiteTurn,
        isPlayerWhite: isPlayerWhite,
        isStockfishTurn: isStockfishTurn,
        fen: fen,
        numAskStockfishPower: numAskStockfishPower,
        numGetEvalPower: numGetEvalPower,
        numGetOpponentResponsePower: numGetOpponentResponsePower,
        numGetPieceToMovePower: numGetPieceToMovePower,
        usedGetEvalPowerThisTurn: usedGetEvalPowerThisTurn,
        evalPower_boardEvaluation: evalPower_boardEvaluation,
        usedGetOpponentResponsePowerThisTurn: usedGetOpponentResponsePowerThisTurn,
        opponentResponsePower_opponentMove: opponentResponsePower_opponentMove,
        usedGetPieceToMovePowerThisTurn: usedGetPieceToMovePowerThisTurn,
        pieceToMovePower_bestPieceToMove: pieceToMovePower_bestPieceToMove
    };
};
let copyBoard = function (board) {
    let newBoard = [];
    for (let i = 0; i < 8; i++) {
        let boardColumn = [];
        for (let j = 0; j < 8; j++)
            boardColumn.push({ pieceType: board[i][j].pieceType, pieceId: board[i][j].pieceId });
        newBoard.push(boardColumn);
    }
    return newBoard;
};
let getBoardSquareCoordinates = function (boardSquare) {
    let letter = boardSquare.substring(0, 1);
    let i;
    switch (letter) {
        case "a":
            i = 0;
            break;
        case "b":
            i = 1;
            break;
        case "c":
            i = 2;
            break;
        case "d":
            i = 3;
            break;
        case "e":
            i = 4;
            break;
        case "f":
            i = 5;
            break;
        case "g":
            i = 6;
            break;
        case "h":
            i = 7;
            break;
        default: throw new Error("Unrecognized letter");
    }
    let j = parseInt(boardSquare.substring(1), 10) - 1;
    return { i: i, j: j };
};
let getNewBoardStateAfterMove = function ({ boardState, moveInfo }) {
    let originalBoard = boardState.board;
    let isEnPassant = (originalBoard[moveInfo.originSquareI][moveInfo.originSquareJ].pieceType === 0 /* PieceType.WhitePawn */ || originalBoard[moveInfo.originSquareI][moveInfo.originSquareJ].pieceType === 6 /* PieceType.BlackPawn */)
        && moveInfo.originSquareI !== moveInfo.destinationSquareI
        && originalBoard[moveInfo.destinationSquareI][moveInfo.destinationSquareJ].pieceType === null;
    let isCastling = (originalBoard[moveInfo.originSquareI][moveInfo.originSquareJ].pieceType === 5 /* PieceType.WhiteKing */ || originalBoard[moveInfo.originSquareI][moveInfo.originSquareJ].pieceType === 11 /* PieceType.BlackKing */)
        && Math.abs(moveInfo.originSquareI - moveInfo.destinationSquareI) === 2;
    let newBoard = copyBoard(originalBoard);
    newBoard[moveInfo.destinationSquareI][moveInfo.destinationSquareJ] = originalBoard[moveInfo.originSquareI][moveInfo.originSquareJ];
    newBoard[moveInfo.originSquareI][moveInfo.originSquareJ] = { pieceType: null, pieceId: null };
    if (isEnPassant)
        newBoard[moveInfo.destinationSquareI][moveInfo.originSquareJ] = { pieceType: null, pieceId: null };
    if (isCastling) {
        if (moveInfo.destinationSquareI === 2) {
            newBoard[3][moveInfo.destinationSquareJ] = originalBoard[0][moveInfo.destinationSquareJ];
            newBoard[0][moveInfo.destinationSquareJ] = { pieceType: null, pieceId: null };
        }
        else if (moveInfo.destinationSquareI === 6) {
            newBoard[5][moveInfo.destinationSquareJ] = originalBoard[7][moveInfo.destinationSquareJ];
            newBoard[7][moveInfo.destinationSquareJ] = { pieceType: null, pieceId: null };
        }
        else {
            throw new Error("Unrecognized castling");
        }
    }
    if (moveInfo.promotion !== null) {
        newBoard[moveInfo.destinationSquareI][moveInfo.destinationSquareJ] = {
            pieceType: moveInfo.promotion,
            pieceId: newBoard[moveInfo.destinationSquareI][moveInfo.destinationSquareJ].pieceId
        };
    }
    let newIsStockfishTurn;
    let isPlayerTurn = boardState.isPlayerWhite === boardState.isWhiteTurn;
    if (isPlayerTurn) {
        newIsStockfishTurn = boardState.isStockfishTurn === null
            ? false
            : boardState.isStockfishTurn;
    }
    else {
        newIsStockfishTurn = boardState.isStockfishTurn === null
            ? false
            : !boardState.isStockfishTurn;
    }
    let moveSan = getMoveSanFromMoveInfo({ fen: boardState.fen, moveInfo: moveInfo });
    let chess = new Chess(boardState.fen);
    chess.move(moveSan);
    return {
        board: newBoard,
        isWhiteTurn: !boardState.isWhiteTurn,
        isPlayerWhite: boardState.isPlayerWhite,
        isStockfishTurn: newIsStockfishTurn,
        fen: chess.fen(),
        numAskStockfishPower: boardState.numAskStockfishPower,
        numGetEvalPower: boardState.numGetEvalPower,
        numGetOpponentResponsePower: boardState.numGetOpponentResponsePower,
        numGetPieceToMovePower: boardState.numGetPieceToMovePower,
        usedGetEvalPowerThisTurn: false,
        evalPower_boardEvaluation: null,
        usedGetOpponentResponsePowerThisTurn: false,
        opponentResponsePower_opponentMove: null,
        usedGetPieceToMovePowerThisTurn: false,
        pieceToMovePower_bestPieceToMove: null
    };
};
let getInitialBoardState = function ({ isPlayerWhite, numAskStockfishPower, numGetEvalPower, numGetOpponentResponsePower, numGetPieceToMovePower }) {
    let board = [];
    for (let i = 0; i < 8; i++) {
        let boardColumn = [];
        for (let j = 0; j < 8; j++)
            boardColumn.push({ pieceType: null, pieceId: null });
        board.push(boardColumn);
    }
    board[0][0] = { pieceType: 3 /* PieceType.WhiteRook */, pieceId: 1 };
    board[1][0] = { pieceType: 1 /* PieceType.WhiteKnight */, pieceId: 2 };
    board[2][0] = { pieceType: 2 /* PieceType.WhiteBishop */, pieceId: 3 };
    board[3][0] = { pieceType: 4 /* PieceType.WhiteQueen */, pieceId: 4 };
    board[4][0] = { pieceType: 5 /* PieceType.WhiteKing */, pieceId: 5 };
    board[5][0] = { pieceType: 2 /* PieceType.WhiteBishop */, pieceId: 6 };
    board[6][0] = { pieceType: 1 /* PieceType.WhiteKnight */, pieceId: 7 };
    board[7][0] = { pieceType: 3 /* PieceType.WhiteRook */, pieceId: 8 };
    board[0][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 9 };
    board[1][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 10 };
    board[2][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 11 };
    board[3][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 12 };
    board[4][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 13 };
    board[5][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 14 };
    board[6][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 15 };
    board[7][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 16 };
    board[0][7] = { pieceType: 9 /* PieceType.BlackRook */, pieceId: 17 };
    board[1][7] = { pieceType: 7 /* PieceType.BlackKnight */, pieceId: 18 };
    board[2][7] = { pieceType: 8 /* PieceType.BlackBishop */, pieceId: 19 };
    board[3][7] = { pieceType: 10 /* PieceType.BlackQueen */, pieceId: 20 };
    board[4][7] = { pieceType: 11 /* PieceType.BlackKing */, pieceId: 21 };
    board[5][7] = { pieceType: 8 /* PieceType.BlackBishop */, pieceId: 22 };
    board[6][7] = { pieceType: 7 /* PieceType.BlackKnight */, pieceId: 23 };
    board[7][7] = { pieceType: 9 /* PieceType.BlackRook */, pieceId: 24 };
    board[0][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 25 };
    board[1][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 26 };
    board[2][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 27 };
    board[3][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 28 };
    board[4][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 29 };
    board[5][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 30 };
    board[6][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 31 };
    board[7][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 32 };
    return {
        board: board,
        isWhiteTurn: true,
        isPlayerWhite: isPlayerWhite,
        isStockfishTurn: null,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        numAskStockfishPower: numAskStockfishPower,
        numGetEvalPower: numGetEvalPower,
        numGetOpponentResponsePower: numGetOpponentResponsePower,
        numGetPieceToMovePower: numGetPieceToMovePower,
        usedGetEvalPowerThisTurn: false,
        evalPower_boardEvaluation: null,
        usedGetOpponentResponsePowerThisTurn: false,
        opponentResponsePower_opponentMove: null,
        usedGetPieceToMovePowerThisTurn: false,
        pieceToMovePower_bestPieceToMove: null
    };
};
export { serializeBoardState, deserializeBoardState, copyBoard, getBoardSquareCoordinates, getInitialBoardState, getNewBoardStateAfterMove };
