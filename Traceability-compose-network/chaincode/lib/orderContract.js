'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api'); 
class OrderContract extends Contract {

    async createPurchaseOrder(ctx,poNumber,sellerID,fromCountry,fromState,fromCity,toCountry,toState,toCity,poDateTime,productName,productQuantity,unitProductCost,expDeliveryDateTime) {
        
        try{
            const mspid = ctx.clientIdentity.getMSPID();
            // create a new Purchase Order object
            const purchaseOrder = {
                
                poNumber: poNumber,
                sellerID: sellerID,
                fromCountry: fromCountry,
                fromState: fromState,
                fromCity: fromCity,

                toCountry: toCountry,
                toState: toState,
                toCity: toCity,

                // paymentTerms: paymentTerms,
                poDateTime: poDateTime,
                // poStatus: 'Pending',

                productName: productName,
                productQuantity: productQuantity,
                unitProductCost: unitProductCost,
                expDeliveryDateTime: expDeliveryDateTime

                // contactPersonName: contactPersonName,
                // contactPhoneNumber: contactPhoneNumber,
                // contactEmail: contactEmail,
            };

            // add the Purchase Order to the world state
            let result = await ctx.stub.putState(poNumber, Buffer.from(stringify(sortKeysRecursive(purchaseOrder))));

            // return the Purchase Order object
            return JSON.stringify(result);
        }
        catch(error){
            return error;
        }
    }
}

module.exports = OrderContract;