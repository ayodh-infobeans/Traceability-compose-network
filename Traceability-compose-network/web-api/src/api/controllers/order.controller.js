import Connections from '../utils/connections.util.js';
import commonUtils from '../utils/common.util.js';
import PurchaseOrderModel from '../../models/purchaseordermodel.js';
import PackageDetailModel from '../../models/packagedetailmodel.js';
import BatchModel from '../../models/batchmodel.js';
import OrderShipmentModel from '../../models/ordershipmentmodel.js';
import OrderInspectionModel from '../../models/purchaseorderinspectionmodel.js';

const CreatePurchaseOrder = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName,data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await Connections.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.submitTransaction("OrderContract:createPurchaseOrder", data.poNumber, data.sellerID, data.fromCountry, data.fromState, data.fromCity, data.toCountry, data.toState, data.toCity, data.poDateTime, data.productName, data.productQuantity, data.unitProductCost, data.expDeliveryDateTime);
        console.log("cdcd12",JSON.stringify(result));
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
        let result = await contract.submitTransaction('OrderContract:InsertPackagingDetails', data.packageId, data.packageDimentions, data.packageWeight, data.productId, data.productFragility, data.barCode);
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
            obj.productId=data.productId;
            obj.productFragility=data.productFragility;
            
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
        let result = await contract.submitTransaction('OrderContract:CreateBatch', data.batchId, data.rawProductId, data.packageInBatch, data.totalQuantity, data.carrierInfo, data.poNumber, data.transportMode, data.startLocation, data.endLocation);
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

            obj.packageInBatch=data.packageInBatch;
            obj.totalQuantity=data.totalQuantity;
            obj.carrierInfo=data.carrierInfo;
            obj.poNumber=data.poNumber;
            obj.transportMode=data.transportMode;
            obj.rawProductId=data.rawProductId;
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
        let result = await contract.submitTransaction('OrderContract:OrderShipment', data.purchaseOrderId, data.batchId, data.batchUnitPrice, data.shipStartLocation, data.shipEndLocation, data.estDeliveryDateTime, data.gpsCoordinates, data.notes, data.status, data.weighbridgeSlipImage, data.weighbridgeSlipNumber, data.weighbridgeDate, data.tbwImage);
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

export default{
    CreatePurchaseOrder,
    InsertPackageDetail,
    CreateBatch,
    OrderShipment,
    PurchaseOrderInspection
}