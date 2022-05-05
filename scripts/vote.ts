import { PROPOSAL_FILE } from "../hardhat-helper-config";
import * as fs from "fs";
export async function vote () {

    console.log("voting...");


    
    
}
const proposal = JSON.parse(fs.readFileSync(PROPOSAL_FILE), "utf8");
const proposalId = proposals[network.config.chainId];
vote(proposalId)
    .then(() => process.exit(0))
    .catch(err => {
        console.log(err), process.exit(1);
    });