import { ethers, network } from "hardhat";
import { DESCRIPTION, developmentChains,FUNC, FUNC_ARGS, MIN_DELAY } from "../hardhat-helper-config";
import { moveBlocks, moveTime } from "../helpers";

export async function queueAndExecute(functionCall:string, args:number[], proposalDescription:string) {
    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(
        functionCall,
        args,
    );

    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(proposalDescription)
    );

    const governor = await ethers.getContract("GovernorContract");
    const queueTx = await governor.queue(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );
   await queueTx.wait(1)
    console.log("Proposal in queue...");
    

    if(developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1)
        await moveBlocks(1);
    }


    //excecute 
   const excecuteTx =  await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );
   await excecuteTx.wait(1)
    console.log("Excecuted...")

    console.log(`Box value is: ${await box.retrieve()}`);
    
}

queueAndExecute(FUNC, [FUNC_ARGS], DESCRIPTION)
    .then(() => process.exit(0))
    .catch(err => {
        console.log(err), process.exit(1);
    });