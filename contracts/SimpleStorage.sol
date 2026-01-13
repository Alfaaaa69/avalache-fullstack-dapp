// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {

    address public owner;

    uint256 private storedValue;
    string public message;

    event OwnerSet(address indexed owner);
    event ValueUpdated(uint256 newValue);
    event MessageUpdated(string newMessage);

    constructor() {
        owner = msg.sender;
        emit OwnerSet(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    function setValue(uint256 _value) public {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function setMessage(string memory _message) public onlyOwner {
        message = _message;
        emit MessageUpdated(_message);
    }
    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
