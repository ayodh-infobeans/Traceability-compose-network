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

    /*async InitLedger(ctx) {

        const mspid = ctx.clientIdentity.getMSPID();

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
        }
    }*/

    async makePayment(ctx, purchaseOrderId) {
        // get the Purchase Order from the world state

        const purchaseOrderBytes = await ctx.stub.getState('PO_' + purchaseOrderId);
        if (!purchaseOrderBytes || purchaseOrderBytes.length === 0) {
            throw new Error(`Purchase Order ${purchaseOrderId} does not exist`);
        }

        const payment ={
            purchaseOrderId: purchaseOrderId,
            vendorName: vendorName,
            invoiceNumber: invoiceNumber,
            invoiceDate: invoiceDate,
            paymentDueDate: paymentDueDate,
            invoiceAmount: invoiceAmount,
            paymentAmount:  paymentAmount,
            paymentDate: paymentDate,
            paymentMethod: paymentMethod,
            description: description,
            paymentStatus: paymentStatus,
            paymentRefrenceNumber: paymentRefrenceNumber,
            notes: notes
        };

        // update the Purchase Order status to 'Paid'
        const purchaseOrder = JSON.parse(purchaseOrderBytes.toString());
        purchaseOrder.status = 'Paid';
        payment.paymentStatus= 'Paid';
        await ctx.stub.putState('PO_' + purchaseOrderId, Buffer.from(JSON.stringify(payment)));

        // return the updated Purchase Order object
        return JSON.stringify(payment);

    }

    async transferAmount(ctx, paymentStatus, paymentAmount, senderID, receiverID, senderAmt, receiverAmt)
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

    
    async Createtransaction(ctx, transferId) {
        // check for already existing transfer
        const exists = await this.transactionExists(ctx, transferId);
        if (exists) {
            throw new Error(`This transfer Material ${transferId} already exists`);
        }
        
        const transaction = {
            transferID: transferId,
            transactionMode: transactionMode,
            transactionExpiryDate: transactionExpiryDate,
            transactionImage: transactionImage,
            transactionOwner: ctx.clientIdentity.getID()
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


    // GetAllpay returns all transfer materials found in the world state.
    async GetAllPayments(ctx) {
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

    async checktransactionAvailabilty(ctx, searchtransaction, transactionQuantity) {
        const allpay = await this.GetAllpay(ctx);
        const data = JSON.parse(allpay);
        const result = data.filter((item)=> item.transactionName === searchtransaction);
        if(result.length !== 0){
            if(transactionQuantity <= result[0].transactionQuantity){
                return "transfer material is available in required quantity : "+ JSON.stringify(result);
            }
            else{
                return "transfer material is not available in required quantity";
            }
        }
        else{
            return "transfer material is not available"; 
        }
    }
}

module.exports = Payment;
