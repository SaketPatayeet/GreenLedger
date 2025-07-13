// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GreenLedger {
    struct Log {
        string item;
        string suggestion;
        string action; // format: action + ' | ' + reason
        string result;
        string store;
        string timestamp;
    }

    mapping(string => Log) private logs;
    string[] private logIds;

    function addLog(
    string memory id,
    string memory item,
    string memory suggestion,
    string memory action_with_reason,
    string memory result,
    string memory store,
    string memory timestamp
) public {
    require(bytes(logs[id].item).length == 0, "Log with this ID already exists");
    logs[id] = Log(item, suggestion, action_with_reason, result, store, timestamp);
    logIds.push(id);
}


    function getLog(string memory id) public view returns (
        string memory, string memory, string memory, string memory, string memory, string memory
    ) {
        Log memory log = logs[id];
        return (
            log.item,
            log.suggestion,
            log.action,
            log.result,
            log.store,
            log.timestamp
        );
    }

    function getAllLogIds() public view returns (string[] memory) {
        return logIds;
    }
}
