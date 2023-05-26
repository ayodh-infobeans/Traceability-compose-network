/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 */

/*

blockEventListener.js is an nodejs application to listen for block events from
a specified channel.

Configuration is stored in config.json:

{
   "peer_name": "peer0.org1.example.com",
   "channelid": "mychannel",
   "use_mongodb":false,
   "mongodb_address": "http://localhost:5990"
}

peer_name:  target peer for the listener
channelid:  channel name for block events
use_mongodb:  if set to true, events will be stored in a local mongodb
mongodb_address:  local address for an off chain mongodb database

Note:  If use_mongodb is set to false, only a local log of events will be stored.

Usage:

node bockEventListener.js

The block event listener will log events received to the console and write event blocks to
a log file based on the channelid and chaincode name.

The event listener stores the next block to retrieve in a file named nextblock.txt.  This file
is automatically created and initialized to zero if it does not exist.

*/

'use strict';
import { fileURLToPath } from 'url';
import { Wallets, Gateway } from 'fabric-network';
import fs from 'fs';
import path from 'path';
import processBlockEvent from './blockProcessing.js';


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
        const walletPath = path.join(process.cwd(), '..','web-api','src','wallet');
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
        const ccpPath = path.resolve(__dirname, '..', 'organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
        
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

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

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

// listener function to check for blocks in the ProcessingMap
async function processPendingBlocks(ProcessingMap) {

    setTimeout(async () => {

        // get the next block number from nextblock.txt
        let nextBlockNumber = fs.readFileSync(configPath, 'utf8');
        let processBlock;

        do {
            
            // get the next block to process from the ProcessingMap
            processBlock = ProcessingMap.get(nextBlockNumber)

            if (processBlock == undefined) {
                break;
            }

            try {
                
                await processBlockEvent(channelid, processBlock, use_mongodb, mongodb_address)
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

main();






