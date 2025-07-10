// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GreenLedger {
    struct Log {
        string item;
        string suggestion;
        string action_with_reason;
        string result;
        string store;
        string timestamp;
    }

    mapping(string => Log) private logs;

    function addLog(string memory id, string memory item, string memory suggestion, string memory action_with_reason, string memory result, string memory store, string memory timestamp) public {
        logs[id] = Log(item, suggestion, action_with_reason, result, store, timestamp);
    }

    function getLog(string memory id) public view returns (string memory, string memory, string memory, string memory, string memory, string memory) {
        Log memory l = logs[id];
        return (l.item, l.suggestion, l.action_with_reason, l.result, l.store, l.timestamp);
    }
}
