import { getByteListBuilder, getByteListIterator } from "../DTLibrary/ByteListUtil.js";
import { deserializeGameState, serializeGameState } from "./GameState.js";
import { getOpponentFromOpponentId, getOpponentIdFromOpponent } from "./Opponent.js";
let generateInitialSessionState = function () {
    return {
        hasStarted: false,
        highestUnlockedOpponent: 0 /* Opponent.Opponent1 */,
        hasDisplayedAskStockfishTooltip: false,
        hasDisplayedGetEvalTooltip: false,
        hasDisplayedGetPieceToMoveTooltip: false,
        hasDisplayedGetOpponentResponseTooltip: false,
        hasDisplayedDoublePowerTooltip: false,
        hasDisplayedYouWinTooltip: false,
        customOpponentElo: 2600,
        wasPlayerWhiteLastGame: null,
        gameState: null
    };
};
let clearSessionState = function (sessionState) {
    let newSessionState = generateInitialSessionState();
    sessionState.hasStarted = newSessionState.hasStarted;
    sessionState.highestUnlockedOpponent = newSessionState.highestUnlockedOpponent;
    sessionState.hasDisplayedAskStockfishTooltip = newSessionState.hasDisplayedAskStockfishTooltip;
    sessionState.hasDisplayedGetEvalTooltip = newSessionState.hasDisplayedGetEvalTooltip;
    sessionState.hasDisplayedGetPieceToMoveTooltip = newSessionState.hasDisplayedGetPieceToMoveTooltip;
    sessionState.hasDisplayedGetOpponentResponseTooltip = newSessionState.hasDisplayedGetOpponentResponseTooltip;
    sessionState.hasDisplayedDoublePowerTooltip = newSessionState.hasDisplayedDoublePowerTooltip;
    sessionState.hasDisplayedYouWinTooltip = newSessionState.hasDisplayedYouWinTooltip;
    sessionState.customOpponentElo = newSessionState.customOpponentElo;
    sessionState.wasPlayerWhiteLastGame = newSessionState.wasPlayerWhiteLastGame;
    sessionState.gameState = newSessionState.gameState;
};
let serializeSessionState = function (sessionState) {
    let byteListBuilder = getByteListBuilder();
    byteListBuilder.addBool(sessionState.hasStarted);
    byteListBuilder.addInt(getOpponentIdFromOpponent(sessionState.highestUnlockedOpponent));
    byteListBuilder.addBool(sessionState.hasDisplayedAskStockfishTooltip);
    byteListBuilder.addBool(sessionState.hasDisplayedGetEvalTooltip);
    byteListBuilder.addBool(sessionState.hasDisplayedGetPieceToMoveTooltip);
    byteListBuilder.addBool(sessionState.hasDisplayedGetOpponentResponseTooltip);
    byteListBuilder.addBool(sessionState.hasDisplayedDoublePowerTooltip);
    byteListBuilder.addBool(sessionState.hasDisplayedYouWinTooltip);
    byteListBuilder.addInt(sessionState.customOpponentElo);
    byteListBuilder.addNullableBool(sessionState.wasPlayerWhiteLastGame);
    if (sessionState.gameState !== null) {
        byteListBuilder.addBool(true);
        byteListBuilder.addByteList(serializeGameState(sessionState.gameState));
    }
    else {
        byteListBuilder.addBool(false);
    }
    let returnValue = byteListBuilder.toByteList();
    return returnValue;
};
let deserializeSessionState = function (serializedSessionState, sessionState) {
    let byteListIterator = getByteListIterator(serializedSessionState);
    sessionState.hasStarted = byteListIterator.popBool();
    sessionState.highestUnlockedOpponent = getOpponentFromOpponentId(byteListIterator.popInt());
    sessionState.hasDisplayedAskStockfishTooltip = byteListIterator.popBool();
    sessionState.hasDisplayedGetEvalTooltip = byteListIterator.popBool();
    sessionState.hasDisplayedGetPieceToMoveTooltip = byteListIterator.popBool();
    sessionState.hasDisplayedGetOpponentResponseTooltip = byteListIterator.popBool();
    sessionState.hasDisplayedDoublePowerTooltip = byteListIterator.popBool();
    sessionState.hasDisplayedYouWinTooltip = byteListIterator.popBool();
    sessionState.customOpponentElo = byteListIterator.popInt();
    sessionState.wasPlayerWhiteLastGame = byteListIterator.popNullableBool();
    let hasGameState = byteListIterator.popBool();
    if (hasGameState) {
        sessionState.gameState = deserializeGameState(byteListIterator.popByteList());
    }
    else {
        sessionState.gameState = null;
    }
    if (byteListIterator.hasNextByte())
        throw new Error("Invalid serializedSessionState");
};
export { generateInitialSessionState, clearSessionState, serializeSessionState, deserializeSessionState };
