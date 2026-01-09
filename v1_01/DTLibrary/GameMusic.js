let getMusic = function () {
    return [
        0 /* GameMusic.ChiptuneLevel1 */,
        1 /* GameMusic.ChiptuneLevel3 */
    ];
};
let getMusicInfo = function (music) {
    switch (music) {
        case 0 /* GameMusic.ChiptuneLevel1 */:
            return {
                filename: "JuhaniJunkala/Level1.ogg",
                flacFilename: "JuhaniJunkala/Level1.flac",
                volume: 0.07
            };
        case 1 /* GameMusic.ChiptuneLevel3 */:
            return {
                filename: "JuhaniJunkala/Level3.ogg",
                flacFilename: "JuhaniJunkala/Level3.flac",
                volume: 0.07
            };
    }
};
export { getMusic, getMusicInfo };
