/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class Payment extends Contract {

    async InitLedger(ctx) {

        const transferID = [
            {
                transferID: "CTX1234"
            }
        ]
        /*const mspid = ctx.clientIdentity.getMSPID();


        const pay = [
            {
                Mode
                PayerPSP
                PayeePSP
                RemitterBank
                BeneficiaryBank
                BankAccountHolder
                Merchants
                PayeeAC
                TransactionID
                PurchaseOrderId
                Select Vendor
                Invoice number
                Invoice date
                Payment due date
                Purchase order/Invoice amount
                Payment amount (amount paid)
                Payment date
                Payment method
                Description
                state
                Payment reference number(when payment done)
                Notes
            },
        ];
        

        for (const transaction of pay) {
            transaction.docType = 'transaction';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(transaction.transferID, Buffer.from(stringify(sortKeysRecursive(transaction))));
            console.info(`transaction ${transaction.transferID} initialized`);
        }*/
    }

    async transferAmount(ctx, transferID, paymentStatus, paymentAmount, senderID, receiverID, senderAmt, receiverAmt)
    {
        senderID = ctx.clientIdentity.getMSPID();
        receiverID = ctx.clientIdentity.getMSPID();
        receiverAmt = receiverAmt;
        senderAmt = senderAmt;
        if (paymentStatus == 'Paid')
        {
            senderAmt = senderAmt - paymentAmount;
            receiverAmt = receiverAmt + paymentAmount;
        }
        await ctx.stub.putState(transferID);   
    }

    async transactionExists(ctx, transferID) {
        const transferJSON = await ctx.stub.getState(transferID);
        return transferJSON && transferJSON.length > 0;
    }

    
    async Createtransaction(ctx, transferId) {
        // check for already existing transfer
        const exists = await this.transactionExists(ctx, transferId);
        if (exists) {
            throw new Error(`This transfer Material ${transferId} already exists`);
        }
        
        const transaction = {
            transferID: transferId,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(transferId, Buffer.from(stringify(sortKeysRecursive(transaction))));
        return JSON.stringify(transaction);
    }

    
    async GetTransactionById(ctx, transferId) {
        const transactionJSON = await ctx.stub.getState(transferId); 
        if (!transactionJSON || transactionJSON.length === 0) {
            throw new Error(`The transfer material ${transferId} does not exist`);
        }
        return transactionJSON.toString();
    }

    async GetAllPayments(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = Payment;
