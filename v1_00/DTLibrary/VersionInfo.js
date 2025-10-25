let getVersionHistory = function () {
    return [
        { version: "1.00", alphanumericVersionGuid: "a94454d4a37c4cbf83e23325fc1e1d3b" }
    ];
};
let getCurrentVersion = function () {
    let versionHistory = getVersionHistory();
    return versionHistory[versionHistory.length - 1];
};
export { getVersionHistory, getCurrentVersion };
