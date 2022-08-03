// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.4;

// wrap block.xxx functions for testing
// only support timestamp and number so far
contract BlockContext {
    function blockTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function blockNumber() public view returns (uint256) {
        return block.number;
    }
}
