import { getCurrentVersion } from "../DTLibrary/VersionInfo.js";
import { getInitialLoadingScreenFrame } from "./InitialLoadingScreenFrame.js";
import { getSaveAndLoadData } from "./SaveAndLoadData.js";
import { migrateAllDataFromOlderVersionsToV1_01IfNeeded } from "./SavedDataMigration_ToV1_01.js";
import { getStockfishWrapper } from "./StockfishWrapper.js";
let getFirstFrame = function ({ buildType, isDesktop, debugMode, browserLocalStorage, stockfishLocation }) {
    let versionInfo = getCurrentVersion();
    if (versionInfo.version === "1.01") {
        migrateAllDataFromOlderVersionsToV1_01IfNeeded({ browserLocalStorage });
    }
    else {
        throw new Error("Unrecognized version");
    }
    let globalState = {
        buildType: buildType,
        isDesktop: isDesktop,
        debugMode: debugMode,
        saveAndLoadData: getSaveAndLoadData({ browserLocalStorage: browserLocalStorage }),
        stockfishWrapper: getStockfishWrapper({ stockfishLocation: stockfishLocation })
    };
    return getInitialLoadingScreenFrame({ globalState: globalState });
};
export { getFirstFrame };
