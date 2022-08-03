/**
 * Reward Token != Staking Token ? USE THIS : RewardInStakingToken.deploy.ts
 */

 import { ethers, run, network } from "hardhat";
 import { BigNumber } from "ethers";
 import { NinjaPadVesting__factory, NinjaPad__factory} from "../typechain";
 
 async function deploy() {
     /**
      * Deploy staking token
      * - If staking token already existsq`
      *  - const stakingToken = await ethers.getContractAt("StakingToken", <address>)
      */
     const Ninjapad = (await ethers.getContractFactory("NinjaPad")) as NinjaPad__factory;
     const ninjapad = await Ninjapad.deploy();
     await ninjapad.deployed();
 
     const Vesting = (await ethers.getContractFactory("NinjaPadVesting")) as NinjaPadVesting__factory;
     const vesting = await Vesting.deploy(ninjapad.address);
     await vesting.deployed();
     
     /**
      * Programmatic verification
      */
     try {
         // verify staking token
         await run("verify:verify", {
             address: ninjapad.address,
             contract: "contracts/NinjaPad.sol:NinjaPad",
             constructorArguments: [],
         });
     } catch (e: any) {
         console.error(`error in verifying: ${e.message}`);
     }

     try {
        // verify staking token
        await run("verify:verify", {
            address: ninjapad.address,
            contract: "contracts/NinjaPadVesting.sol:NinjaPadVesting",
            constructorArguments: [ninjapad.address],
        });
    } catch (e: any) {
        console.error(`error in verifying: ${e.message}`);
    }
 
     console.log({
         Token: ninjapad.address,
         Vesting: vesting.address
     });
 }
 
 deploy().catch((e: any) => console.log(e.message));
 