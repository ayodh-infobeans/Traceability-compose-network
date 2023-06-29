import fs from 'fs';
import Connections from '../utils/connections.util.js';
import commonUtils from '../utils/common.util.js';
import PurchaseOrderModel from '../../models/purchaseordermodel.js';
import PackageDetailModel from '../../models/packagedetailmodel.js';
import BatchModel from '../../models/batchmodel.js';
import OrderShipmentModel from '../../models/ordershipmentmodel.js';
import OrderInspectionModel from '../../models/purchaseorderinspectionmodel.js';
import barcode from '../utils/barcode.util.js';
import offchainUtil from '../utils/offchain.util.js';

const { connectToFabricNetwork, connectToMongoDB } = Connections;
const { generateResponsePayload } = commonUtils;
const {setOrgChannel,runOffchainScript,stopOffchainScript } = offchainUtil;

const CreatePurchaseOrder = async(req, res) =>{
    
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName,data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);

        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        if(data?.sellerID == orgMSP ){ 
            return res.status(200).json({
                status: true,
                result: "Buyer "+ orgMSP + " and seller sellerID = "+ data?.sellerID +" can not be same. "
            });
        }
        let result = await networkAccess?.contract.submitTransaction("OrderContract:createPurchaseOrder", data?.poNumber, data?.sellerID, data?.fromCountry, data?.fromState, data?.fromCity, data?.toCountry, data?.toState, data?.toCity, data?.poDateTime, data?.productName, data?.productQuantity, data?.unitProductCost, data?.expDeliveryDateTime);
        await runOffchainScript("node",options);
        await connectToMongoDB(networkAccess?.org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await PurchaseOrderModel.findOne({poNumber:data?.poNumber});
        console.log("obj testing ==",obj);
        if (obj) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.paymentTerms=data?.paymentTerms;
            obj.poStatus=data?.poStatus;
            obj.contactPersonName=data?.contactPersonName;
            obj.contactPhoneNumber=data?.contactPhoneNumber;
            obj.contactEmail=data?.contactEmail;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');


          } else {
            console.log('Document not found.');
        }
        await stopOffchainScript();
        if(result) {
            const responsePayload = generateResponsePayload(result.toString(), null, null);
            await networkAccess?.gateway.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload(null, "Oops!", "Something went wrong. Please try again.");
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
        return res.send(response_payload);
    }
}

const InsertPackageDetail = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);
        console.log("options ==",options);
        console.log("networkAccess?.status ==",networkAccess?.status);

        if(!networkAccess?.status){
            
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);

        }

        var barCodePath=null;

        let assetDetail = await networkAccess?.contract.evaluateTransaction("ProductContract:GetProductById", data?.assetID);
        console.log("assetDetail ==",assetDetail);
        // let link = ``;
        
        barcode.generateBarcode(assetDetail, function (barcodeImageBuffer) {
            fs.writeFile(`./barcode_images/${data?.packageId}.png`, barcodeImageBuffer, function (err) {
              
             if (err) {
                console.error(err);
                return;
              }
              console.log(`Barcode generated and saved as ${data?.packageId}.png in barcode_images directory.`);

            });
        });

        barCodePath = `./barcode_images/${data?.packageId}.png`;
        let result = await networkAccess?.contract?.submitTransaction('OrderContract:InsertPackagingDetails', data?.packageId, data?.assetID,  barCodePath);
        console.log("result ==",result);
        await runOffchainScript("node",options);

        await connectToMongoDB(networkAccess?.org);

        await new Promise(resolve => setTimeout(resolve, 5000));

        const obj = await PackageDetailModel.findOne({packageId:data?.packageId});
        console.log(obj);
        if (obj) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.packageDimentions=data?.packageDimentions;
            obj.packageWeight=data?.packageWeight;
            obj.assetId=data?.assetId;
            obj.assetFragility=data?.assetFragility;
            
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        await stopOffchainScript();
        if(result) {
            const responsePayload = generateResponsePayload(result.toString(), null, null);
            await networkAccess?.gateway.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload(null, "Oops!", "Something went wrong. Please try again.");
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
        return res.send(response_payload);
    }
}

const CreateBatch = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);
        
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        
        let result = await networkAccess?.contract.submitTransaction('OrderContract:CreateBatch', data?.batchId, data?.assetId, data?.packageInBatch, data?.poNumber, data?.startLocation, data?.endLocation);
        console.log('result found. =',result);
        await runOffchainScript("node",options);
        await connectToMongoDB(networkAccess?.org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await BatchModel.findOne({packageId:data?.packageId});
        if (obj) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.totalQuantity=data?.totalQuantity;
            obj.carrierInfo=data?.carrierInfo;
            obj.transportMode=data?.transportMode;

            // Save the modified document back to the database
            await obj.save();

            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        await stopOffchainScript();
        if(result) {
            const responsePayload = generateResponsePayload(result.toString(), null, null);
            await networkAccess?.gateway.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload(null, "Oops!", "Something went wrong. Please try again.");
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
    
        return res.send(response_payload);
    }
}

const OrderShipment = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);

        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract.submitTransaction('OrderContract:OrderShipment', data?.purchaseOrderId, data?.senderId, data.batchIds, data.packageUnitPrice, data.shipStartLocation, data.shipEndLocation, data.estDeliveryDateTime, data.gpsCoordinates, data.notes, data.weighbridgeSlipImage, data.weighbridgeSlipNumber, data.weighbridgeDate, data.tbwImage);
        await runOffchainScript("node",options);
        await connectToMongoDB(networkAccess?.org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await OrderShipmentModel.findOne({purchaseOrderId:data?.purchaseOrderId});
        console.log(obj);
        if (obj) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.vehicleType=data?.vehicleType;
            obj.vehicleNumber=data?.vehicleNumber;
            obj.vehicleImage=data?.vehicleImage;
            obj.vehicleColor=data?.vehicleColor;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        await stopOffchainScript();
        if(result) {
            const responsePayload = generateResponsePayload(result.toString(), null, null);
            await networkAccess?.gateway.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload(null, "Oops!", "Something went wrong. Please try again.");
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
        return res.send(response_payload);
    }
}

const PurchaseOrderInspection = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        await connectToMongoDB(networkAccess?.org);
        const obj = new OrderInspectionModel(data);
        obj.orgMSP= orgMSP;
        obj.userName= userName;
        obj.userType= userType;
        obj.channelName= channelName;
        obj.chaincodeName= chaincodeName;

        obj.save()
        .then(() => {
        res.status(201).json({ message: 'Order Inspection created successfully' });
        })
        .catch((error) => {
        res.status(500).json({ error: 'An error occurred while saving order inspection' });
        });
    }
    catch (error){
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
        return res.send(response_payload);
    }
}

const ConfirmDeliveredOrder = async(req, res) =>{
    try{
        const {data} = req?.body;
        
        const obj = await BatchModel.find({batchId: data?.batchId});
        if(obj){
            return res.status(500).json({
                status: false,
                message: "Batch "+ JSON.stringify(obj)+ "is Delivered."
            }) 
        }
        else{
            return res.status(200).json({
                status: true,
                result: "Please"+ JSON.stringify(obj) + " provide  this raw material detail with availabile quantity and its mentioned price. "
            });
        }
    }
    catch (error){
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
        return res.send(response_payload);
    }
}


const getKeyHistory = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
       
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        
        // var key;

        // if (data.typeSelector === "rawMaterial"){
        //    key = `RM_${data?.key}`;
        // }
        // else{
        //     key= `prod_${data?.key}`;
        // }

        const key = (data.typeSelector === "rawMaterial") ? `RM_${data?.key}` : `prod_${data?.key}`;

        const result = await contract.evaluateTransaction('OrderContract:getKeyHistory', key);
        
        if(result) {
            const responsePayload = generateResponsePayload(result.toString(), null, null);
            await networkAccess?.gateway.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload(null, "Oops!", "Something went wrong. Please try again.");
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
        return res.send(response_payload);
    }
}


export default{
    CreatePurchaseOrder,
    InsertPackageDetail,
    CreateBatch,
    OrderShipment,
    PurchaseOrderInspection,
    ConfirmDeliveredOrder,
    getKeyHistory
}