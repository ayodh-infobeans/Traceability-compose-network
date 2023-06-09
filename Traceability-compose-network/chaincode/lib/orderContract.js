'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api'); 
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
            return error;
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
            await ctx.stub.putState( "packageId_"+packageId, Buffer.from(stringify(sortKeysRecursive(packageData))));
            // return the Package object
            return JSON.stringify(packageData);
        }
        catch(error){
            return error;
        }

    }

    async CreateBatch(ctx, batchId,assetId, packageInBatch,totalQuantity,carrierInfo,poNumber,transportMode,startLocation,endLocation) {
    
        // create a new Batch object
        try{

            const mspid = ctx.clientIdentity.getMSPID();
            const purchaseOrderBytes = await ctx.stub.getState(poNumber);

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
                endLocation: endLocation

            };

            // add the Batch to the world state
            await ctx.stub.putState( "batchId_"+batchId, Buffer.from(stringify(sortKeysRecursive(batch))));
            // return the Batch object
            return JSON.stringify(batch);
        }
        catch(error){
            return error;
        }

    }

    async OrderShipment(ctx, purchaseOrderId,senderId,batchIds,packageUnitPrice,shipStartLocation,shipEndLocation,estDeliveryDateTime,gpsCoordinates,notes,status,weighbridgeSlipImage,weighbridgeSlipNumber,weighbridgeDate,tbwImage) {
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
            await ctx.stub.putState("purchaseOrderId_"+purchaseOrderId, Buffer.from(stringify(sortKeysRecursive(shipment))));
            // return the Shipment
            return JSON.stringify(shipment);
        }
        catch(error){
            return error;
        }
    }
}

module.exports = OrderContract;

// async checkRawMaterialAvailabilty(ctx, searchRawMaterial, rawMaterialQuantity) {
        
//     const mspid = ctx.clientIdentity.getMSPID();

//     const allRawMaterials = await this.GetAllRawMaterials(ctx);
//     const data = JSON.parse(allRawMaterials);
//     const result = data.filter((item)=> item.rawMaterialName === searchRawMaterial);
    
//     if(result.length !== 0){
//         if(rawMaterialQuantity <= result[0].rawMaterialQuantity){
//             return "Raw material is available in required quantity : "+ JSON.stringify(result);
//         }
//         else{
//             return "Raw material is not available in required quantity";
//         }
//     }
//     else{
//         return "Raw material is not available"; 
//     }

// }



// async ConfirmAvailabilityOfRawMaterial(ctx, rawProductName,rawProductQuantity,rawProductUnitPrice,shippingDateTime,estDeliveryDateTime) {
   
//     const mspid = ctx.clientIdentity.getMSPID();
    
//     if (mspid !== 'GrowerMSP') {
//         throw new Error(`Caller with MSP ID ${mspid} is not authorized to confirm rawMaterial Availability`);
//     }

    

//    const confirmAvailability = {
        
//         rawProductName: rawProductName,
//         rawProductQuantity: rawProductQuantity,
//         rawProductUnitPrice: rawProductUnitPrice,
//         shippingDateTime: shippingDateTime,
//         estDeliveryDateTime: estDeliveryDateTime
//    };

//     // // add the Purchase Order to the world state
//     await ctx.stub.putState(rawProductName, Buffer.from(JSON.stringify(confirmAvailability)));

//     // return the Purchase Order object
//     return JSON.stringify(confirmAvailability);

// }


// async checkProductlAvailabilty(ctx, searchProduct, productQuantity) {
    
//     const mspid = ctx.clientIdentity.getMSPID();

//     const allProducts = await this.GetAllProducts(ctx);
//     const data = JSON.parse(allProducts);
//     const result = data.filter((item)=> item.productName === searchProduct);
    
//     if(result.length !== 0){
//         if(productQuantity <= result[0].productQuantity){
//             return "Product  available in required quantity : "+ JSON.stringify(result);
//         }
//         else{
//             return "Product is not available in required quantity";
//         }
//     }
//     else{
//         return "Product  is not available"; 
//     }

// }




// async ConfirmAvailabilityOfProduct(ctx, productName,productQuantity,productUnitPrice,shippingDateTime,estDeliveryDateTime) {
   
//     const mspid = ctx.clientIdentity.getMSPID();
//     if (mspid !== 'ManufacturerMSP') {
//         throw new Error(`Caller with MSP ID ${mspid} is not authorized to confirm rawMaterial Availability`);
//     }

//    const confirmAvailability = {
        
//         productName: productName,
//         productQuantity: productQuantity,
//         productUnitPrice: productUnitPrice,
//         shippingDateTime: shippingDateTime,
//         estDeliveryDateTime: estDeliveryDateTime
//    };

//     // // add the Purchase Order to the world state
//     await ctx.stub.putState(productName, Buffer.from(JSON.stringify(confirmAvailability)));

//     // return the Purchase Order object
//     return JSON.stringify(confirmAvailability);

// }

    //     const purchaseOrderBytes = await ctx.stub.getState('PO_' + purchaseOrderId);
    //     if (!purchaseOrderBytes || purchaseOrderBytes.length === 0) {
    //         throw new Error(`Purchase Order ${purchaseOrderId} does not exist`);
    //     }

    //     const payment ={
    //         purchaseOrderId: purchaseOrderId,
    //         vendorName: vendorName,
    //         invoiceNumber: invoiceNumber,
    //         invoiceDate: invoiceDate,
    //         paymentDueDate: paymentDueDate,
    //         purchaseOrder: purchaseOrder,
    //         invoiceAmount: invoiceAmount,
    //         paymentAmount:  paymentAmount,
    //         paymentDate: paymentDate,
    //         paymentMethod: paymentMethod,
    //         description: description,
    //         paymentStatus: paymentStatus, //
    //         paymentRefrenceNumber: // async PurchaseOrderInspection(ctx, batchID,serialNumber,estDeliveryDateTime,productIdentificationNumber,description,totalQuantity,damageQuantity,defectQuantity,goodQuantity,packageSize,packageColor,packageName,rate,amount,deliveryDateTime,compliance,pwImage,remark,supplierName,supplierAddress,supplierContactNumber) {
       
    //     const transientData = {
    //         batchID: batchID,
    //         serialNumber: serialNumber,
    //         estDeliveryDateTime: estDeliveryDateTime,
    //         productIdentificationNumber: productIdentificationNumber,
    //         description: description,
    //         totalQuantity: totalQuantity,
    //         damageQuantity: damageQuantity,
    //         defectQuantity: defectQuantity,
    //         goodQuantity: goodQuantity,
    //         packageSize: packageSize,
    //         packageColor: packageColor,
    //         packageName: packageName,
    //         rate: rate,
    //         amount: amount,
    //         deliveryDateTime: deliveryDateTime,
    //         compliance: compliance,
    //         pwImage: pwImage,
    //         remark: remark,
    //         supplierName: supplierName,
    //         supplierAddress: supplierAddress,
    //         supplierContactNumber: supplierContactNumber
    //     };

    //     await ctx.stub.putPrivateData('OrderInspectionData',  Buffer.from(JSON.stringify(transientData)));

    //     // return the orderInspection
    //     return JSON.stringify(transientData);

    // }

    // async makePayment(ctx, purchaseOrderId, vendorName,invoiceNumber,invoiceDate,paymentDueDate,purchaseOrder,invoiceAmount,paymentAmount, paymentDate,paymentMethod,description,paymentStatus,paymentRefrenceNumber,notes) {
    //     // get the Purchase Order from the world statepaymentRefrenceNumber,
    //         notes: notes
    //     };

    //     // update the Purchase Order status to 'Paid'
    //     const purchaseOrder = JSON.parse(purchaseOrderBytes.toString());
    //     purchaseOrder.status = 'Paid';
    //     payment.paymentStatus= 'Paid';
    //     await ctx.stub.putState('PO_' + purchaseOrderId, Buffer.from(JSON.stringify(payment)));

    //     // return the updated Purchase Order object
    //     return JSON.stringify(payment);

    // }

    // async CreateQRCode(ctx,productId, batchNumber, batchExpiryDate,batchManufacturingDate,rawMaterialIds,productName,productDescription,productCategory,manufacturingLocation,quantity,manufacturingPrice,manufacturingDate,ingredients,fnfType,productImages,qrSize,qrFormat){

    //     const qrCode ={
    //         productId: productId,
    //         batchNumber: batchNumber,
    //         batchExpiryDate: batchExpiryDate,
    //         batchManufacturingDate: batchManufacturingDate,
    //         rawMaterialIds: rawMaterialIds,
    //         productName: productName,
    //         productDescription: productDescription,
    //         productCategory: productCategory,
    //         manufacturingLocation: manufacturingLocation,

    //         quantity: quantity,
    //         manufacturingPrice: manufacturingPrice,
    //         manufacturingDate: manufacturingDate,
    //         ingredients: ingredients,
    //         fnfType: fnfType,
    //         productImages: productImages,
    //         qrSize: qrSize,
    //         qrFormat: qrFormat
    //     };


    //     // add the QRCODE to the world state
    //     await ctx.stub.putState(productId, Buffer.from(JSON.stringify(qrCode)));

    //     // return the QRCODE
    //     return JSON.stringify(qrCode);

    // }
