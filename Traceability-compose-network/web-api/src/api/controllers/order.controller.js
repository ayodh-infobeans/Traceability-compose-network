import Connections from '../utils/connections.util.js';
import commonUtils from '../utils/common.util.js';
import PurchaseOrderModel from '../../models/purchaseordermodel.js';
import PackageDetailModel from '../../models/packagedetailmodel.js';
import BatchModel from '../../models/batchmodel.js';
import OrderShipmentModel from '../../models/ordershipmentmodel.js';
import OrderInspectionModel from '../../models/purchaseorderinspectionmodel.js';
import barcode from '../utils/barcode.util.js';
import fs from 'fs';

const CreatePurchaseOrder = async(req, res) =>{
    
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName,data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await Connections.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        if(data.sellerID == orgMSP ){ 
            res.status(200).json({
                status: true,
                result: "Buyer "+ orgMSP + " and seller sellerID = "+ data.sellerID +" can not be same. "
            });
        }
        let result = await contract.submitTransaction("OrderContract:createPurchaseOrder", data.poNumber, data.sellerID, data.fromCountry, data.fromState, data.fromCity, data.toCountry, data.toState, data.toCity, data.poDateTime, data.productName, data.productQuantity, data.unitProductCost, data.expDeliveryDateTime);
        await Connections.connectToMongoDB(org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await PurchaseOrderModel.findOne({poNumber:data.poNumber});
        console.log(obj);
        if (obj.toString()) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.paymentTerms=data.paymentTerms;
            obj.poStatus=data.poStatus;
            obj.contactPersonName=data.contactPersonName;
            obj.contactPhoneNumber=data.contactPhoneNumber;
            obj.contactEmail=data.contactEmail;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');


          } else {
            console.log('Document not found.');
        }
        
        const response_payload = {
            result: result.toString(),
            error: null,
            errorData: null
        }
        await gateway.disconnect();
        res.send(response_payload);
        
    }
    catch (error){
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
}


const InsertPackageDetail = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await Connections.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        var barCodePath=null;
        let assetDetail = await contract.evaluateTransaction("ProductContract:GetProductById", data.assetId);
        
        barcode.generateBarcode(assetDetail, function (barcodeImageBuffer) {
            fs.writeFile(`./barcode_images/${data.packageId}.png`, barcodeImageBuffer, function (err) {
              if (err) {
                console.error(err);
                return;
              }
              barCodePath = `./barcode_images/${data.packageId}.png`;
              console.log(`Barcode generated and saved as ${data.packageId}.png in barcode_images directory.`);
            });
          });

        let result = await contract.submitTransaction('OrderContract:InsertPackagingDetails', data.packageId, data.assetId,  barCodePath);
        await Connections.connectToMongoDB(org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await PackageDetailModel.findOne({packageId:data.packageId});
        console.log(obj);
        if (obj.toString()) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.packageDimentions=data.packageDimentions;
            obj.packageWeight=data.packageWeight;
            obj.assetId=data.assetId;
            obj.assetFragility=data.assetFragility;
            
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        
        const response_payload = {
            result: result.toString(),
            error: null,
            errorData: null
        }
        await gateway.disconnect();
        res.send(response_payload);
    }
    catch (error){
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
}

const CreateBatch = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await Connections.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.submitTransaction('OrderContract:CreateBatch', data.batchId, data.assetId, data.packageInBatch, data.totalQuantity, data.carrierInfo, data.poNumber, data.transportMode, data.startLocation, data.endLocation);
        await Connections.connectToMongoDB(org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await BatchModel.findOne({packageId:data.packageId});
        console.log(obj);
        if (obj.toString()) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.totalQuantity=data.totalQuantity;
            obj.carrierInfo=data.carrierInfo;
            obj.transportMode=data.transportMode;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        
        const response_payload = {
            result: result.toString(),
            error: null,
            errorData: null
        }
        await gateway.disconnect();
        res.send(response_payload);
    }
    catch (error){
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
}

const OrderShipment = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await Connections.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.submitTransaction('OrderContract:OrderShipment', data.purchaseOrderId, data.senderId, data.batchIds, data.packageUnitPrice, data.shipStartLocation, data.shipEndLocation, data.estDeliveryDateTime, data.gpsCoordinates, data.notes, data.status, data.weighbridgeSlipImage, data.weighbridgeSlipNumber, data.weighbridgeDate, data.tbwImage);
        await Connections.connectToMongoDB(org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await OrderShipmentModel.findOne({purchaseOrderId:data.purchaseOrderId});
        console.log(obj);
        if (obj.toString()) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.vehicleType=data.vehicleType;
            obj.vehicleNumber=data.vehicleNumber;
            obj.vehicleImage=data.vehicleImage;
            obj.vehicleColor=data.vehicleColor;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        
        const response_payload = {
            result: result.toString(),
            error: null,
            errorData: null
        }
        await gateway.disconnect();
        res.send(response_payload);
    }
    catch (error){
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
}

const PurchaseOrderInspection = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        await Connections.connectToMongoDB(org);
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
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
}

const ConfirmDeliveredOrder = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        
        const obj = await BatchModel.find({batchId: data.batchId});
        if(obj.toString()){
            res.status(500).json({
                status: false,
                message: "Batch "+ JSON.stringify(obj)+ "is Delivered."
            }) 
        }
        else{
            res.status(200).json({
                status: true,
                result: "Please"+ JSON.stringify(obj) + " provide  this raw material detail with availabile quantity and its mentioned price. "
            });
        }
    }
    catch (error){
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
}

export default{
    CreatePurchaseOrder,
    InsertPackageDetail,
    CreateBatch,
    OrderShipment,
    PurchaseOrderInspection,
    ConfirmDeliveredOrder
}