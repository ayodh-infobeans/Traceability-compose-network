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
    // async PaymentIDExists(ctx, rawID) {
    //     const rawMaterialJSON = await ctx.stub.getState(rawID);
    //     return rawMaterialJSON && rawMaterialJSON.length > 0;
    // }
    

    async makePayment(ctx, poNumber, paymentRefrenceNumber, vendorName, invoiceNumber, invoiceDate, invoiceAmount, paymentAmount,paymentDate,paymentMethod ,description,paymentStatus,notes) {
        // get the Purchase Order from the world state

        const purchaseOrderBytes = await ctx.stub.getState("poNumber_"+poNumber);
        if (!purchaseOrderBytes || purchaseOrderBytes.length === 0) {
            throw new Error(`Purchase Order ${poNumber} does not exist`);
        }

        // const exists = await this.PaymentIDExists(ctx, paymentRefrenceNumber);
        // if (exists) {
        //     throw new Error(`This Raw Material ${rawId} already exists`);
        // }

        const payment ={

            paymentRefrenceNumber: paymentRefrenceNumber,
            vendorName: vendorName,
            invoiceNumber: invoiceNumber,
            invoiceDate: invoiceDate,
            // paymentDueDate: paymentDueDate,
            //  paymentReciept
            type:"transaction",
            invoiceAmount: invoiceAmount,
            paymentAmount:  paymentAmount,
            paymentDate: paymentDate,
            paymentMethod: paymentMethod,
            description: description,
            paymentStatus: paymentStatus,
            notes: notes

        };
        
        // update the Purchase Order status to 'Paid'
        if (paymentStatus == 'Paid')
        {
            let result = await ctx.stub.putState(paymentRefrenceNumber, Buffer.from(JSON.stringify(payment)));
            return JSON.stringify(result);
        }
        else{
            throw new Error(`Please Do Complete Payment for ${poNumber} `);
        }
        
        // return the updated Purchase Order object
        
    }


    async GetTransactionById(ctx, paymentRefrenceNumber) {
        const transactionJSON = await ctx.stub.getState(paymentRefrenceNumber); 
        if (!transactionJSON || transactionJSON.length === 0) {
            throw new Error(`The payment data for  ${paymentRefrenceNumber} does not exist`);
        }
        return transactionJSON.toString();
    }
    

    // GetAllpay returns all transfer materials found in the world state.
    async GetAllTransactions(ctx) {
        const query = {
            "selector":{
                "type": 'transaction'
            }
          };
          const queryResults = await ctx.stub.getQueryResult(JSON.stringify(query));
        
          const pay = [];
          while (true) {
            const res = await queryResults.next();
            if (res.value) {
              const transaction = JSON.parse(res.value.value.toString('utf8'));
              pay.push(transaction);
            } else {
              await queryResults.close();
              return JSON.stringify(pay);
            }
          }
    }

}

module.exports = Payment;

