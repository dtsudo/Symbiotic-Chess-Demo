import { fetchData, persistData } from "../DTLibrary/FileIO.js";
import { getVersionHistory } from "../DTLibrary/VersionInfo.js";
import { FILE_ID_FOR_SOUND_AND_MUSIC_VOLUME } from "./GlobalConstants.js";
let migrateSessionStateDataFromOlderVersionsToV1_01IfNeeded = function ({ browserLocalStorage }) {
    // v1.00 didn't store any session state data
};
let migrateSoundAndMusicVolumeDataFromOlderVersionsToV1_01IfNeeded = function ({ browserLocalStorage }) {
    let versionInfo = getVersionHistory();
    let version1_00 = versionInfo.find(x => x.version === "1.00");
    let version1_01 = versionInfo.find(x => x.version === "1.01");
    let fileId = FILE_ID_FOR_SOUND_AND_MUSIC_VOLUME;
    let v1_01Data = fetchData({ fileId, version: version1_01, browserLocalStorage });
    if (v1_01Data !== null)
        return;
    let v1_00Data = fetchData({ fileId, version: version1_00, browserLocalStorage });
    if (v1_00Data === null)
        return;
    persistData({ fileId, version: version1_01, byteList: v1_00Data, browserLocalStorage });
};
let migrateAllDataFromOlderVersionsToV1_01IfNeeded = function ({ browserLocalStorage }) {
    migrateSessionStateDataFromOlderVersionsToV1_01IfNeeded({ browserLocalStorage });
    migrateSoundAndMusicVolumeDataFromOlderVersionsToV1_01IfNeeded({ browserLocalStorage });
};
export { migrateAllDataFromOlderVersionsToV1_01IfNeeded };
