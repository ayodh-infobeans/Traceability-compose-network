'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api'); 
class OrderContract extends Contract {

    async createPurchaseOrder(ctx, poNumber,sellerID,fromCountry,fromState,fromCity,toCountry,toState,toCity,poDateTime,productName,productQuantity,unitProductCost,expDeliveryDateTime, createdAt, updatedAt) {
        
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
                poStatus: 'created',

                productName: productName,
                productQuantity: productQuantity,
                unitProductCost: unitProductCost,
                expDeliveryDateTime: expDeliveryDateTime,
                createdAt:createdAt,
                updatedAt:updatedAt,

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
            return error;
        }
    }

    async updatePurchaseOrderStatus(ctx, poNumber, poStatus) {

        const existingOrderBuffer = await ctx.stub.getState("poNumber_" + poNumber);
          if (!existingOrderBuffer || existingOrderBuffer.length === 0) {
            throw new Error(`Purchase order ${poNumber} does not exist.`);
          }

        try{
            const mspid = ctx.clientIdentity.getMSPID();
            const existingOrder = JSON.parse(existingOrderBuffer.toString());
            existingOrder["poStatus"] = poStatus;

            // add the Purchase Order to the world state

            let result = await ctx.stub.putState("poNumber_"+poNumber, Buffer.from(stringify(sortKeysRecursive(existingOrder))));

            // return the Purchase Order object
            return JSON.stringify(result);
        }
        catch(error){
            return error;
        }
    }

    async InsertPackagingDetails(ctx, packageId,assetId, barCode, createdAt, updatedAt) {
        
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
            
                barCode: barCode,
                createdAt:createdAt,
                updatedAt:updatedAt,

            };

            // add the Package to the world state
            let result = await ctx.stub.putState( "packageId_"+packageId, Buffer.from(stringify(sortKeysRecursive(packageData))));
            // return the Package object
            return JSON.stringify(result);
        }
        catch(error){
            return error;
        }

    }

    async CreateBatch(ctx, batchId,assetId, packageInBatch,poNumber,startLocation,endLocation, createdAt, updatedAt) {
    
        // create a new Batch object
        try{

            const mspid = ctx.clientIdentity.getMSPID();
            const purchaseOrderBytes = await ctx.stub.getState("poNumber_"+poNumber);

            if (!purchaseOrderBytes || purchaseOrderBytes.length === 0) {
                throw new Error(`Purchase Order ${poNumber} does not exist, Let Purchase Order arrive First.`);
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
                endLocation: endLocation,
                createdAt:createdAt,
                updatedAt:updatedAt,

            };

            // add the Batch to the world state
            
            let result = await ctx.stub.putState( "batchId_"+batchId , Buffer.from(stringify(sortKeysRecursive(batch))));
            // return the Batch object
            return JSON.stringify(result);
        }
        catch(error){
            return error;
        }

    }

    async OrderShipment(ctx, purchaseOrderId,senderId,batchIds,packageUnitPrice,shipStartLocation,shipEndLocation,estDeliveryDateTime,gpsCoordinates,notes,weighbridgeSlipImage,weighbridgeSlipNumber,weighbridgeDate,tbwImage, createdAt, updatedAt) {
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
                status: "In Transit",
                weighbridgeSlipImage: weighbridgeSlipImage,
                weighbridgeSlipNumber: weighbridgeSlipNumber,
                weighbridgeDate: weighbridgeDate,
                tbwImage: tbwImage,
                createdAt:createdAt,
                updatedAt:updatedAt,
                
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
            return error;
        }
    }
    
    async PurchaseOrderExists(ctx, poNumber) {
        const purchaseOrderJSON = await ctx.stub.getState("poNumber_"+poNumber);
        return purchaseOrderJSON && purchaseOrderJSON.length > 0;
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

    async getSummary(ctx, poNumber, purchaseOrderId, paymentRefrenceNumber){

        const purchaseOrderJSON = await ctx.stub.getState("poNumber_"+poNumber);
        if (!purchaseOrderJSON || purchaseOrderJSON.length === 0) {
            throw new Error(`Purchase order ${poNumber} does not exist.`);
        }

        const purchaseOrderIdJSON = await ctx.stub.getState("purchaseOrderId_"+purchaseOrderId);
        if (!purchaseOrderIdJSON || purchaseOrderIdJSON.length === 0) {
            throw new Error(`Purchase order ID ${purchaseOrderId} does not exist.`);
        }

        const paymentRefrenceJSON = await ctx.stub.getState(paymentRefrenceNumber);
        if (!paymentRefrenceJSON || paymentRefrenceJSON.length === 0) {
            throw new Error(`Purchase order ${paymentRefrenceNumber} does not exist.`);
        }

        const poJSON = JSON.parse(purchaseOrderJSON.toString());
        const pOrderIdJSON = JSON.parse(purchaseOrderIdJSON.toString());
        const paymentJSON = JSON.parse(paymentRefrenceJSON.toString());
        
        
        const summary = { ...poJSON, ...pOrderIdJSON, ...paymentJSON };

        return JSON.stringify(summary);
    }
      
}

module.exports = OrderContract;
