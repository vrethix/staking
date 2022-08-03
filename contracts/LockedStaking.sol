// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./Staking.sol";

contract LockedStaking is Staking {
    constructor(
        address _stakingToken,
        address _rewardToken,
        uint256 _rewardAmount,
        uint256 _startTime,
        uint256 _stopTime,
        uint256 _stakingCap
    ) Staking(_stakingToken, _rewardToken, _rewardAmount, _startTime, _stopTime, _stakingCap) {}

    function withdraw(uint256 amount) public override {
        require(block.timestamp >= stopTime, "Staking: staking period not over yet");
        super.withdraw(amount);
    }

    function getReward() public override {
        require(block.timestamp >= stopTime, "Staking: staking period not over yet");
        super.getReward();
    }

    function exit() public override {
        require(block.timestamp >= stopTime, "Staking: staking period not over yet");
        super.exit();
    }
}
