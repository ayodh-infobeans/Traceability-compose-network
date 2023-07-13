'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api'); 
const { createCustomeError } = require('./error/customError');

class OrderContract extends Contract {

    async createPurchaseOrder(ctx, poNumber,sellerID,fromCountry,fromState,fromCity,toCountry,toState,toCity,poDateTime,productName,productQuantity,unitProductCost,expDeliveryDateTime) {
        
        try{
            const mspid = ctx.clientIdentity.getMSPID();
            // create a new Purchase Order object
            const purchaseOrder = {
                orgMSP: mspid,
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
            let result = await ctx.stub.putState("poNumber_"+poNumber, Buffer.from(stringify(sortKeysRecursive(purchaseOrder))));

            // return the Purchase Order object
            return JSON.stringify(result);
        }
        catch(error){
            throw createCustomeError("Something went wrong. Please try again");
        }
    }

    async InsertPackagingDetails(ctx, packageId,assetId, barCode) {
        
    // create a new Package object
        try{

            const mspid = ctx.clientIdentity.getMSPID();
            const packageData = {
                
                orgMSP: mspid,
                packageId:packageId,
                assetId:assetId,
                
                // packageDimentions: packageDimentions,
                // packageWeight: packageWeight,
                // productId: productId,
                // productFragility: productFragility,
            
                barCode: barCode

            };

            // add the Package to the world state
            let result = await ctx.stub.putState( "packageId_"+packageId, Buffer.from(stringify(sortKeysRecursive(packageData))));
            // return the Package object
            return JSON.stringify(result);
        }
        catch(error){
            throw createCustomeError("Something went wrong. Please try again");
        }

    }

    async CreateBatch(ctx, batchId,assetId, packageInBatch,poNumber,startLocation,endLocation) {
    
        // create a new Batch object
        try{

            const mspid = ctx.clientIdentity.getMSPID();
            const purchaseOrderBytes = await ctx.stub.getState("poNumber_"+poNumber);

            if (!purchaseOrderBytes || purchaseOrderBytes.length === 0) {
                throw createCustomeError(`Purchase Order ${poNumber} does not exist, Let Purchase Order arrive First.`);
            }
            
            const batch = {
                orgMSP:mspid,
                batchId:batchId,
                assetId:assetId,
                packageInBatch: packageInBatch,
                // totalQuantity: totalQuantity,
                // carrierInfo: carrierInfo,
                poNumber: poNumber,
                // transportMode: transportMode,
                // rawProductId: rawProductId,
                startLocation: startLocation,
                endLocation: endLocation

            };

            // add the Batch to the world state
            
            let result = await ctx.stub.putState( "batchId_"+batchId , Buffer.from(stringify(sortKeysRecursive(batch))));
            // return the Batch object
            return JSON.stringify(result);
        }
        catch(error){
            throw createCustomeError("Something went wrong. Please try again");
        }

    }

    async OrderShipment(ctx, purchaseOrderId,senderId,batchIds,packageUnitPrice,shipStartLocation,shipEndLocation,estDeliveryDateTime,gpsCoordinates,notes,weighbridgeSlipImage,weighbridgeSlipNumber,weighbridgeDate,tbwImage) {
       // create a new Shipment
        try{
            const mspid = ctx.clientIdentity.getMSPID();
            const shipment = {
                orgMSP:mspid,
                purchaseOrderId: purchaseOrderId,
                senderId: senderId,
                batchIds: batchIds,
                packageUnitPrice: packageUnitPrice,
                shipStartLocation: shipStartLocation,
                shipEndLocation: shipEndLocation,
                estDeliveryDateTime: estDeliveryDateTime,
                gpsCoordinates: gpsCoordinates,
                notes: notes,
                status: "Delivered",
                weighbridgeSlipImage: weighbridgeSlipImage,
                weighbridgeSlipNumber: weighbridgeSlipNumber,
                weighbridgeDate: weighbridgeDate,
                tbwImage: tbwImage
                
                // vehicleType: vehicleType,
                // vehicleNumber: vehicleNumber,
                // vehicleImage: vehicleImage,
                // vehicleColor:  vehicleColor,
                
        };

            // add the Shipment to the world state
            let result = await ctx.stub.putState("purchaseOrderId_"+purchaseOrderId, Buffer.from(stringify(sortKeysRecursive(shipment))));
            // return the Shipment
            return JSON.stringify(result);
        }
        catch(error){
            throw createCustomeError("Something went wrong. Please try again");
        }
    }

    async getKeyHistory(ctx, key) {
        
        const historyIterator = await ctx.stub.getHistoryForKey(key);
        const history = [];
      
        while (true) {
          const historyRecord = await historyIterator.next();
      
          if (historyRecord.value && historyRecord.value.value.toString()) {
            history.push(historyRecord.value.value.toString());
          }
      
          if (historyRecord.done) {
            await historyIterator.close();
            return JSON.stringify(history);
          }
        }
    }
      
}

module.exports = OrderContract;
