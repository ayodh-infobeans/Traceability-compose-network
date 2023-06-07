

'use strict';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import mongodbutil  from './mongodbutil.js';
import RawModel from './models/rawmodel.js';
import ProductModel from './models/productmodel.js';
import HistoryModel from './models/historymodel.js';
import PurchaseOrderModel from './models/purchaseordermodel.js';
import PackageDetailModel from './models/packagedetailmodel.js';
import BatchModel from './models/batchmodel.js';
import OrderShipmentModel from './models/ordershipmentmodel.js';
import PaymentModel from './models/paymentmodel.js';
// import OrderInspectionModel from '../../models/purchaseorderinspectionmodel.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, 'nextblock.txt');

export default async function processBlockEvent(channelname, block, use_mongodb, mongodb_address) {

    return new Promise((async (resolve, reject) => {

        // reject the block if the block number is not defined
        if (block.header.number == undefined) {
            reject(new Error('Undefined block number'));
        }

        const blockNumber = block.header.number
        
        console.log(`------------------------------------------------`);
        console.log(`Block Number: ${blockNumber}`);
        
        // reject if the data is not set
        if (block.data.data == undefined) {
            reject(new Error('Data block is not defined'));
        }
        
        const dataArray = block.data.data;
        
        // transaction filter for each transaction in dataArray
        const txSuccess = block.metadata.metadata[2];
        
        for (var dataItem in dataArray) {

            // reject if a timestamp is not set
            if (dataArray[dataItem].payload.header.channel_header.timestamp == undefined) {
                reject(new Error('Transaction timestamp is not defined'));
            }

            // tx may be rejected at commit stage by peers
            // only valid transactions (code=0) update the word state and off-chain db
            // filter through valid tx, refer below for list of error codes
            // https://github.com/hyperledger/fabric-sdk-node/blob/release-1.4/fabric-client/lib/protos/peer/transaction.proto
            if (txSuccess[dataItem] !== 0) {
              continue;
            }

            const timestamp = dataArray[dataItem].payload.header.channel_header.timestamp;

            // continue to next tx if no actions are set
            if (dataArray[dataItem].payload.data.actions == undefined) {
                continue;
            }

            // actions are stored as an array. In Fabric 1.4.3 only one
            // action exists per tx so we may simply use actions[0]
            // in case Fabric adds support for multiple actions
            // a for loop is used for demonstration
            const actions = dataArray[dataItem].payload.data.actions;

            // iterate through all actions
            for (var actionItem in actions) {

                // reject if a chaincode id is not defined
                if (actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name == undefined) {
                    reject(new Error('Chaincode name is not defined'));
                }

                const chaincodeID = actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name

                // reject if there is no readwrite set
                if (actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset == undefined) {
                    reject(new Error('No readwrite set is defined'));
                }

                const rwSet = actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset
                
                for (var record in rwSet) {
                    // ignore lscc events
                    if (rwSet[record].namespace != 'lscc' && rwSet[record].namespace != '_lifecycle') {
                        // create object to store properties
                        const writeObject = new Object();
                        writeObject.blocknumber = blockNumber;
                        writeObject.chaincodeid = chaincodeID;
                        writeObject.timestamp = timestamp;
                        writeObject.values = rwSet[record].rwset.writes;

                        console.log(`Transaction Timestamp: ${writeObject.timestamp}`);
                        console.log(`ChaincodeID: ${writeObject.chaincodeid}`);
                        console.log(writeObject.values);

                        const logfilePath = path.resolve(__dirname, 'nextblock.txt');

                        // send the object to a log file
                        fs.appendFileSync(channelname + '_' + chaincodeID + '.log', JSON.stringify(writeObject) + "\n");
                        
                        // if mongodb is configured, then write to mongodb
                        if (use_mongodb) {
                            try {
                                await writeValuesToMongoDBP(mongodb_address, channelname, writeObject);
                            } catch (error) {
                                 
                            }
                        }
                    }
                };

            };
        };

        // update the nextblock.txt file to retrieve the next block
        fs.writeFileSync(configPath, (parseInt(blockNumber, 10) + 1).toString())

        resolve(true);

    }));
}
    // define the database for saving block events by key - this emulates world state
            // const dbname = channelname + '_' + writeObject.chaincodeid +'s';
            // // define the database for saving all block events - this emulates history
            // const historydbname = channelname + '_' + writeObject.chaincodeid + '_history';
            // set values to the array of values received

            
async function writeValuesToMongoDBP(mongodb_address, channelname, writeObject) {

    return new Promise((async (resolve, reject) => {
        try {

            const values = writeObject.values;
            console.log("values: ================ ",values);
            console.log("value of values: ===========", values[0].value.toString());
            
            const historydbname = HistoryModel;
            try {
                for (var sequence in values) {
                    let keyvalue =
                        values[
                        sequence
                        ];
                    console.log("hello ==");
                    // var check = keyvalue.key; // Extract the value of key
                    if(keyvalue.key.startsWith("RM")){
                            var dbname = RawModel; 
                        }
                    if(keyvalue.key.startsWith("prod")){
                            var dbname = ProductModel;
                    }
                    if(keyvalue.key.startsWith("poNumber")){
                            var dbname = PurchaseOrderModel;
                    }
                    if(keyvalue.key.startsWith("packageId")){
                            var dbname = PackageDetailModel;
                    }
                    if(keyvalue.key.startsWith("batchId")){
                            var dbname = BatchModel;
                    }
                    if(keyvalue.key.startsWith("purchaseOrderId")){
                            var dbname = OrderShipmentModel;
                    }
                    if(keyvalue.key.startsWith("PAYID")){
                        var dbname = OrderShipmentModel;
                    }
                      
                    if (
                        keyvalue.is_delete ==
                        true
                    ) { 
                        await mongodbutil.deleteRecord(
                            mongodb_address,
                            dbname,
                            keyvalue.key
                        );
                    } else {
                        if (
                            isJSON(
                                keyvalue.value
                            )
                        ) {
                           
                            //  insert or update value by key - this emulates world state behavior

                            await mongodbutil.writeToMongoDB(
                                mongodb_address,
                                dbname,
                                keyvalue.key,
                                JSON.parse(
                                    keyvalue.value
                                )
                            );
                        }
                    }

                    // add additional fields for history
                    keyvalue.timestamp =
                        writeObject.timestamp;
                    keyvalue.blocknumber = parseInt(
                        writeObject.blocknumber,
                        10
                    );
                    keyvalue.sequence = parseInt(
                        sequence,
                        10
                    );

                    await mongodbutil.writeToMongoDB(
                        mongodb_address,
                        historydbname,
                        null,
                        keyvalue
                    );
                }
            } catch (error) {
                console.log(error);
                reject(error);
            }

        } catch (error) {
            console.error(`Failed to write to mongodb: ${error}`);
            reject(error);
        }

        resolve(true);

    }));

}

function isJSON(value) {
    try {
        JSON.parse(value);
    } catch (e) {
        return false;
    }
    return true;
}

// export default blockProcessing;



