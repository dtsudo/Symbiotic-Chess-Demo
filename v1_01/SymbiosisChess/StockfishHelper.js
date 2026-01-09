import { Chess } from "../ChessJs/chess.js";
import { convertMoveLanToMoveInfo } from "./MoveInfo.js";
const MINIMUM_STOCKFISH_ELO = 1320;
const MAXIMUM_STOCKFISH_ELO = 3190;
let getStockfishHelper = function ({ stockfishLocation, stockfishElo }) {
    let chessEngine = new Worker(stockfishLocation);
    let postMessage = function (str) {
        chessEngine.postMessage(str);
    };
    let commands = [];
    let getBestMoveFromBestMoveString = function (str) {
        str = str.trim();
        if (!str.startsWith("bestmove")) {
            throw new Error("Expected input to start with bestmove: " + str);
        }
        let ponderIndex = str.indexOf("ponder");
        if (ponderIndex >= 0)
            str = str.substring(0, ponderIndex);
        return str.substring(8).trim();
    };
    chessEngine.addEventListener("message", function (e) {
        let message = e.data.trim();
        if (message.startsWith("info depth") && message.indexOf("lowerbound") === -1 && message.indexOf("upperbound") === -1) {
            if (commands.length === 0)
                throw new Error("Expected commands to not be empty");
            let commandType = commands[0].commandType;
            if (commandType !== 3 /* CommandType.GetBestMove_WaitingForStockfish */ && commandType !== 1 /* CommandType.GetBoardPositionInfo_WaitingForStockfish */)
                throw new Error("Expected commands[0] to be GetBestMove_WaitingForStockfish or GetBoardPositionInfo_WaitingForStockfish");
            if (commandType === 1 /* CommandType.GetBoardPositionInfo_WaitingForStockfish */) {
                let centipawnIndex = message.indexOf("cp");
                let nodesIndex = message.indexOf("nodes");
                if (centipawnIndex >= 0) {
                    commands[0].boardPositionInfo.positionEvaluation = {
                        centipawns: parseInt(message.substring(centipawnIndex + 2, nodesIndex).trim(), 10) * (commands[0].isWhiteTurn ? 1 : -1),
                        checkmate: null
                    };
                }
                else {
                    let mateIndex = message.indexOf("mate");
                    commands[0].boardPositionInfo.positionEvaluation = {
                        centipawns: null,
                        checkmate: parseInt(message.substring(mateIndex + 4, nodesIndex).trim(), 10) * (commands[0].isWhiteTurn ? 1 : -1)
                    };
                }
                let pvIndex = message.indexOf(" pv ");
                let principalVariation = message.substring(pvIndex + 3).trim().split(" ");
                let chess = new Chess();
                for (let previousMove of commands[0].previousMoves)
                    chess.move(previousMove.moveSan);
                chess.move(principalVariation[0]);
                if (chess.isGameOver() || principalVariation.length >= 2) {
                    commands[0].boardPositionInfo.bestMove = convertMoveLanToMoveInfo({ moveLan: principalVariation[0], isWhiteTurn: commands[0].isWhiteTurn });
                    if (principalVariation.length >= 2) {
                        commands[0].boardPositionInfo.bestOpponentResponse = convertMoveLanToMoveInfo({ moveLan: principalVariation[1], isWhiteTurn: !commands[0].isWhiteTurn });
                    }
                    else {
                        commands[0].boardPositionInfo.bestOpponentResponse = null;
                    }
                }
            }
        }
        if (message.startsWith("bestmove")) {
            if (commands.length === 0)
                throw new Error("Expected commands to not be empty");
            let commandType = commands[0].commandType;
            if (commandType !== 3 /* CommandType.GetBestMove_WaitingForStockfish */ && commandType !== 1 /* CommandType.GetBoardPositionInfo_WaitingForStockfish */)
                throw new Error("Expected commands[0] to be GetBestMove_WaitingForStockfish or GetBoardPositionInfo_WaitingForStockfish");
            if (commandType === 3 /* CommandType.GetBestMove_WaitingForStockfish */) {
                let chessEngineBestMove = getBestMoveFromBestMoveString(message);
                (commands[0].bestMoveResolveFunction)(chessEngineBestMove);
            }
            commands.shift();
            setTimeout(processCommands, 0);
        }
    });
    postMessage("uci");
    if (stockfishElo !== null) {
        if (stockfishElo < MINIMUM_STOCKFISH_ELO || stockfishElo > MAXIMUM_STOCKFISH_ELO)
            throw new Error("Invalid stockfishElo");
        postMessage("setoption name UCI_LimitStrength value true");
        postMessage("setoption name UCI_Elo value " + stockfishElo);
    }
    postMessage("isready");
    let processCommands = function () {
        if (commands.length === 0)
            return;
        if (commands[0].commandType === 3 /* CommandType.GetBestMove_WaitingForStockfish */ || commands[0].commandType === 1 /* CommandType.GetBoardPositionInfo_WaitingForStockfish */)
            return;
        let command = commands.shift();
        if (command.commandType === 2 /* CommandType.GetBestMove */) {
            commands.unshift({ commandType: 3 /* CommandType.GetBestMove_WaitingForStockfish */, bestMoveResolveFunction: command.bestMoveResolveFunction });
            postMessage("ucinewgame");
            if (command.previousMoves.length > 0)
                postMessage("position startpos moves " + command.previousMoves.map(previousMove => previousMove.moveLan).join(" "));
            else
                postMessage("position startpos");
            postMessage("go movetime " + command.timeToThinkInMilliseconds);
            return;
        }
        if (command.commandType === 0 /* CommandType.GetBoardPositionInfo */) {
            commands.unshift({ commandType: 1 /* CommandType.GetBoardPositionInfo_WaitingForStockfish */, boardPositionInfo: command.boardPositionInfo, previousMoves: command.previousMoves, isWhiteTurn: command.previousMoves.length % 2 === 0 });
            postMessage("ucinewgame");
            if (command.previousMoves.length > 0)
                postMessage("position startpos moves " + command.previousMoves.map(previousMove => previousMove.moveLan).join(" "));
            else
                postMessage("position startpos");
            postMessage("go movetime " + command.timeToThinkInMilliseconds);
            return;
        }
        if (command.commandType === 4 /* CommandType.Quit */) {
            postMessage("quit");
            setTimeout(function () {
                chessEngine.terminate();
            }, 10000 /* arbitrary */);
            return;
        }
        throw new Error("Unexpected command");
    };
    let getBoardPositionInfo = function ({ previousMoves, timeToThinkInMilliseconds }) {
        let boardPositionInfo = {
            positionEvaluation: null,
            bestMove: null,
            bestOpponentResponse: null
        };
        commands.push({ commandType: 0 /* CommandType.GetBoardPositionInfo */, previousMoves: [...previousMoves], timeToThinkInMilliseconds: timeToThinkInMilliseconds, boardPositionInfo: boardPositionInfo });
        setTimeout(processCommands, 0);
        return boardPositionInfo;
    };
    let getBestMove = function ({ previousMoves, timeToThinkInMilliseconds }) {
        return new Promise((resolve, reject) => {
            commands.push({ commandType: 2 /* CommandType.GetBestMove */, previousMoves: [...previousMoves], timeToThinkInMilliseconds: timeToThinkInMilliseconds, bestMoveResolveFunction: resolve });
            setTimeout(processCommands, 0);
        });
    };
    let isIdle = function () {
        return commands.length === 0;
    };
    let quit = function () {
        commands.push({ commandType: 4 /* CommandType.Quit */ });
        setTimeout(processCommands, 0);
    };
    return {
        getElo: function () { return stockfishElo; },
        getBestMove,
        getBoardPositionInfo,
        quit,
        isIdle
    };
};
export { getStockfishHelper, MINIMUM_STOCKFISH_ELO, MAXIMUM_STOCKFISH_ELO };
