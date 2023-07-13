/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const { createCustomeError } = require('./error/customError');

class Payment extends Contract {

    async makePayment(ctx, poNumber, paymentRefrenceNumber, vendorName, invoiceNumber, invoiceDate, invoiceAmount, paymentAmount,paymentDate,paymentMethod ,description,paymentStatus,notes, createdAt, updatedAt) {
        // get the Purchase Order from the world state

        const purchaseOrderBytes = await ctx.stub.getState("poNumber_"+poNumber);
        if (!purchaseOrderBytes || purchaseOrderBytes.length === 0) {
            throw createCustomeError(`Purchase Order ${poNumber} does not exist`);
        }

        const payment ={
            paymentRefrenceNumber: paymentRefrenceNumber,
            vendorName: vendorName,
            invoiceNumber: invoiceNumber,
            invoiceDate: invoiceDate,
            type:"transaction",
            invoiceAmount: invoiceAmount,
            paymentAmount:  paymentAmount,
            paymentDate: paymentDate,
            paymentMethod: paymentMethod,
            description: description,
            paymentStatus: paymentStatus,
            notes: notes,
            createdAt:createdAt,
            updatedAt:updatedAt,
        };
        let result;
        // update the Purchase Order status to 'Paid'
        if (paymentStatus == 'Paid')
        {
            let result = await ctx.stub.putState(paymentRefrenceNumber, Buffer.from(JSON.stringify(payment)));
            return JSON.stringify(result);
        }
        else{
            throw createCustomeError(`Please Do Complete Payment for ${poNumber} `);
        }
        
        // return the updated Purchase Order object
        
    }


    async GetTransactionById(ctx, paymentRefrenceNumber) {
        const transactionJSON = await ctx.stub.getState(paymentRefrenceNumber); 
        if (!transactionJSON || transactionJSON.length === 0) {
            throw createCustomeError(`The payment data for  ${paymentRefrenceNumber} does not exist`);
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

