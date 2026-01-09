let getVersionHistory = function () {
    return [
        { version: "1.00", alphanumericVersionGuid: "a94454d4a37c4cbf83e23325fc1e1d3b" },
        { version: "1.01", alphanumericVersionGuid: "c18523616b194b7cbbb2a0c71a2c296f" }
    ];
};
let getCurrentVersion = function () {
    let versionHistory = getVersionHistory();
    return versionHistory[versionHistory.length - 1];
};
export { getVersionHistory, getCurrentVersion };
