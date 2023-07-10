/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Payment extends Contract {

    async makePayment(ctx, poNumber, paymentRefrenceNumber, vendorName, invoiceNumber, invoiceDate, invoiceAmount, paymentAmount,paymentDate,paymentMethod ,description,paymentStatus,notes) {
        
        const purchaseOrderBytes = await ctx.stub.getState(poNumber);
        if (!purchaseOrderBytes || purchaseOrderBytes.length === 0) {
            throw new Error(`Purchase Order ${poNumber} does not exist`);
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
            notes: notes
        };
        let result;
        // update the Purchase Order status to 'Paid'
        if (paymentStatus == 'Paid')
        {
            result = await ctx.stub.putState(paymentRefrenceNumber, Buffer.from(JSON.stringify(payment)));
        }
        else{
            throw new Error(`Please Do Complete Payment for ${poNumber} `);
        }
        
        // return the updated Purchase Order object
        return JSON.stringify(result);
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

