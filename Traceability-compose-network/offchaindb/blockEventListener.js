
'use strict';
import { fileURLToPath } from 'url';
import pkg from 'fabric-network';
const { Wallets, Gateway } = pkg;
import fs from 'fs';
import path from 'path';
import processBlockEvent from './blockProcessing.js';
import readline from 'readline';
let isTerminated; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPathi = path.resolve(__dirname, 'config.json');
const configData = fs.readFileSync(configPathi, 'utf-8');
const config = JSON.parse(configData);

   
const peer_name = config.peer_name;
const channelid = config.channelid;
const use_mongodb = config.use_mongodb;
const createHistoryLog = config.create_history_log;
const mongodb_address = config.mongodb_address;

const configPath = path.resolve(__dirname, 'nextblock.txt');
console.log(config.use_mongodb);

class BlockMap {
    constructor() {
        this.list = []
    }
    get(key) {
        key = parseInt(key, 10).toString();
        return this.list[`block${key}`];
    }
    set(key, value) {
        this.list[`block${key}`] = value;
    }
    remove(key) {
        key = parseInt(key, 10).toString();
        delete this.list[`block${key}`];
    }
}

let ProcessingMap = new BlockMap()

async function main() {
    try {
        
         // initialize the next block to be 0
        let nextBlock = 0;
        
        // check to see if there is a next block already defined
        if (fs.existsSync(configPath)) {
            // read file containing the next block to read
            nextBlock = fs.readFileSync(configPath, 'utf8');
            
        } else {
            // store the next block as 0
            fs.writeFileSync(configPath, parseInt(nextBlock, 10).toString())
        }
        
        // Create a new file system based wallet for managing identities.
        
        const walletPath = path.join(process.cwd(), ...walletSegments);

        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.get('admin');
        if (!userExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            console.log('Run the enrollUser.js application before retrying');
            return;
        }
        
        
        // Parse the connection profile. This would be the path to the file downloaded
        
        const ccpPath = path.resolve(__dirname, ...pathSegments );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        console.log("============================");
        // Create a new gateway for connecting to our peer node.
        console.log(`ccp ${ccp}`);
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
        
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        console.log("============================2");

        const listener = async (event) => {
            // Add the block to the processing map by block number
            await ProcessingMap.set(event.blockNumber, event.blockData);
            console.log(`Added block ${event.blockNumber} to ProcessingMap`);
        };
        const options = { filtered: false, startBlock: parseInt(nextBlock, 10) };
      
        await network.addBlockListener(listener, options);

        console.log(`Listening for block events, nextblock: ${nextBlock}`);
        // start processing, looking for entries in the ProcessingMap
        processPendingBlocks(ProcessingMap);
       
        // const stopFilePath = path.resolve(__dirname, 'stop.txt');
        // const rl = readline.createInterface({
        // input: fs.createReadStream(stopFilePath),
        // });

        // rl.on('line', (input) => {
        // if (input.trim() === 'stop') {
        //     console.log('Stopping the script...');
        //     fs.unlinkSync(stopFilePath); // Delete the stop.txt file
        //     gateway.disconnect(); // Disconnect from the gateway
        //     process.exit(0); // Terminate the script
        // }
        // });


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

// listener function to check for blocks in the ProcessingMap
async function processPendingBlocks(ProcessingMap) {

        // Check if the stop command is received
    // const stopFilePath = path.resolve(__dirname, 'stop.txt');
    // if (fs.existsSync(stopFilePath)) {
    //     console.log('Stopping the script...');
    //     fs.unlinkSync(stopFilePath); // Delete the stop.txt file
    //     return; // Exit the function to stop the loop
    // }

    setTimeout(async () => {

        // get the next block number from nextblock.txt
        let nextBlockNumber = fs.readFileSync(configPath, 'utf8');
        let processBlock;
        if (isTerminated) {
            console.log('Termination signal received. Stopping the script...');
            process.exit(0); // Terminate the script
            return; // Exit the function and stop processing blocks
          }
        do {
            
            // get the next block to process from the ProcessingMap
            processBlock = ProcessingMap.get(nextBlockNumber)

            if (processBlock == undefined) {
                break;
            }

            try {
                
                await processBlockEvent(channelid, processBlock, use_mongodb)
            } catch (error) {
                console.error(`Failed to process block: ${error}`);
            }

            // if successful, remove the block from the ProcessingMap
            
            ProcessingMap.remove(nextBlockNumber);
            // increment the next block number to the next block
            fs.writeFileSync(configPath, (parseInt(nextBlockNumber, 10) + 1).toString())
            
            // retrive the next block number to process
            nextBlockNumber = fs.readFileSync(configPath, 'utf8');

        } while (true);

        processPendingBlocks(ProcessingMap);

    }, 250);

}

const terminationCommand = process.argv[2] || process.env.TERMINATION_COMMAND;
if (terminationCommand === 'stop') {
  console.log('Termination command received. Stopping the script...');
  process.exit(0); // Terminate the script
  isTerminated = true;
} else {
  main();
}






// const { spawn } = require('child_process');

