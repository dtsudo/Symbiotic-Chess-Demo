let getOpponentIdFromOpponent = function (opponent) {
    switch (opponent) {
        case 0 /* Opponent.Opponent1 */: return 1;
        case 1 /* Opponent.Opponent2 */: return 2;
        case 2 /* Opponent.Opponent3 */: return 3;
        case 3 /* Opponent.Opponent4 */: return 4;
        case 4 /* Opponent.Opponent5 */: return 5;
        case 5 /* Opponent.OpponentCustom */: return 6;
    }
};
let getOpponentFromOpponentId = function (opponentId) {
    switch (opponentId) {
        case 1: return 0 /* Opponent.Opponent1 */;
        case 2: return 1 /* Opponent.Opponent2 */;
        case 3: return 2 /* Opponent.Opponent3 */;
        case 4: return 3 /* Opponent.Opponent4 */;
        case 5: return 4 /* Opponent.Opponent5 */;
        case 6: return 5 /* Opponent.OpponentCustom */;
        default: throw new Error("Unrecognized opponentId");
    }
};
let getOpponentElo = function (opponent) {
    switch (opponent) {
        case 0 /* Opponent.Opponent1 */: return 1320;
        case 1 /* Opponent.Opponent2 */: return 1594;
        case 2 /* Opponent.Opponent3 */: return 1858;
        case 3 /* Opponent.Opponent4 */: return 2124;
        case 4 /* Opponent.Opponent5 */: return 2383;
        case 5 /* Opponent.OpponentCustom */: throw new Error("Invalid opponent");
    }
};
export { getOpponentElo, getOpponentIdFromOpponent, getOpponentFromOpponentId };
