/**
 * Reward Token != Staking Token ? USE THIS : RewardInStakingToken.deploy.ts
 */

import { ethers, run, network } from "hardhat";
import { BigNumber } from "ethers";
import { StakingToken__factory, Staking__factory } from "../typechain";

/**
 * Configuration
 * - Reward amount: Total reward to be distributed
 * - Start time: Start of staking period
 * - Stop time: End of staking period
 * - Cap: Staking cap. 0 for no cap
 * - eg: if desired duration is 90 days. stop time = start time + 90 days
 */
const REWARD_AMOUNT: BigNumber = ethers.utils.parseEther("210000"); // your reward amount
const START_TIME: number = 1649410512; // your start time in unix timestamp
const STOP_TIME: number = 1649411112; // your stop time
const CAP: any = ethers.utils.parseEther("0"); // your cap

async function deploy() {
    /**
     * Deploy staking token
     * - If staking token already exists
     *  - const stakingToken = await ethers.getContractAt("StakingToken", <address>)
     */
    const stakingTokenFactory = (await ethers.getContractFactory("StakingToken")) as StakingToken__factory;
    const stakingTokenName = "Staking Token";
    const stakingTokenSymbol = "ST";
    const stakingToken = await stakingTokenFactory.deploy(stakingTokenName, stakingTokenSymbol);
    await stakingToken.deployed();
    // if (network.name !== "hardhat") {
    //     await ethers.provider.waitForTransaction(stakingToken.deployTransaction.hash, 5); // wait for 3 block confirmations
    // }
    //const stakingToken = await ethers.getContractAt("IERC20", "0x6397de0F9aEDc0F7A8Fa8B438DDE883B9c201010")
    /**
     * Deploy Reward token
     * - If reward token already exists
     *  - const rewardToken = await ethers.getContractAt("RewardToken", <address>)
     */
    // const rewardTokenFactory = (await ethers.getContractFactory("RewardToken")) as RewardToken__factory;
    // const rewardTokenName = "Reward Token";
    // const rewardTokenSymbol = "RT";
    // const rewardToken = await rewardTokenFactory.deploy(rewardTokenName, rewardTokenSymbol);
    // if (network.name !== "hardhat") {
    //     await ethers.provider.waitForTransaction(rewardToken.deployTransaction.hash, 5); // wait for 3 block confirmations
    // }

    /**
     * Deploy staking contract
     */
    const stakingFactory = (await ethers.getContractFactory("Staking")) as Staking__factory;
    const staking = await stakingFactory.deploy(
        stakingToken.address,
        stakingToken.address,
        REWARD_AMOUNT,
        START_TIME,
        STOP_TIME,
        CAP
    );
    if (network.name !== "hardhat") {
        await ethers.provider.waitForTransaction(staking.deployTransaction.hash, 5);
    }

    /**
     * Programmatic verification
     */
    try {
        // verify staking token
        await run("verify:verify", {
            address: stakingToken.address,
            contract: "contracts/test/StakingToken.sol:StakingToken",
            constructorArguments: [stakingTokenName, stakingTokenSymbol],
        });
    } catch (e: any) {
        console.error(`error in verifying: ${e.message}`);
    }

    // try {
    //     // verify reward token
    //     await run("verify:verify", {
    //         address: rewardToken.address,
    //         contract: "contracts/test/RewardToken.sol:RewardToken",
    //         constructorArguments: [rewardTokenName, rewardTokenSymbol],
    //     });
    // } catch (e: any) {
    //     console.error(`error in verifying: ${e.message}`);
    // }

    try {
        await run("verify:verify", {
            address: staking.address,
            contract: "contracts/Staking.sol:Staking",
            constructorArguments: [
                stakingToken.address,
                stakingToken.address,
                REWARD_AMOUNT,
                START_TIME,
                STOP_TIME,
                CAP,
            ],
        });
    } catch (e: any) {
        console.error(`error in verifying: ${e.message}`);
    }

    /**
     * Transfer reward token to staking contract
     */
     await stakingToken.approve(staking.address, REWARD_AMOUNT);
    // await staking.loadReward();

    console.log({
        stakingToken: stakingToken.address,
        rewardToken: stakingToken.address,
        staking: staking.address,
    });
}

deploy().catch((e: any) => console.log(e.message));
