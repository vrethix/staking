import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";
import dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import { ethers } from "ethers";
dotenv.config();

const PK = process.env.DEPLOYER_PRIVATE_KEY || ethers.constants.AddressZero;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
    solidity: "0.8.4",
    networks: {
        // polygon: {
        //     url: "https://polygon-rpc.com/",
        //     accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
        //     gasPrice: "auto", // if txs failing, set manual fast gas price
        // },
        mumbai: {
            url: "https://rpc-mumbai.maticvigil.com",
            accounts: [PK],
            gas: 6000000,
            gasPrice: 8000000000
        },
        bsc_testnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            chainId: 97,
            accounts: [PK],
            // gas: 2100000,
            // gasPrice: 8000000000,
        },
        bsc_mainnet: {
            url: "https://bsc-dataseed.binance.org/",
            accounts: [PK],
        },
    },
    // even if verifying on polygonscan, property name should be etherscan only, only apiKey should change
    etherscan: {
        apiKey: process.env.EXPLORER_API_KEY || "",
    },

    // enable this to see gas used in test suites
    // gasReporter: {
    //     enabled: false,
    // },
};

export default config;
