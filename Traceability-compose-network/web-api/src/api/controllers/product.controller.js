import httpStatus from 'http-status';
import pkg from 'fabric-network';
const { Gateway, Wallets } = pkg;
import fs from 'fs';
import path from 'path';
import buildCCP from '../../config/buildCCP.js';
import ConnectGateway from '../utils/gateway.util.js';
import ProductModel from '../../models/productmodel.js';

const GetAllProducts = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.channelName);
        const contract = network.getContract(req.chaincodeName);

        // Query chaincode...
        let result = await contract.evaluateTransaction("GetAllProducts");
        await gateway.disconnect();
        res.status(200).json({
            result: result
        });
    }
    catch (error){
        res.send(error);
    }
}

const InitProducts = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.channelName);
        const contract = network.getContract(req.chaincodeName);

        // Query chaincode...
        let result = await contract.evaluateTransaction("InitProducts");
        await gateway.disconnect();

        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await ProductModel.findOne({productId:data.productId});
        console.log(obj);
        if (obj) {
            obj.org= req.body.org;
            obj.userName= req.body.userName;
            obj.userType= req.body.userType;
            obj.channelName= req.body.channelName;
            obj.chaincodeName= req.body.chaincodeName;

            obj.productNotes=req.body.data.productNotes;
            obj.productStatus=req.body.data.productStatus;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');
          } else {
            console.log('Document not found.');
          }

        res.status(200).json({
            result: result
        });
    }
    catch (error){
        res.send(error);
    }
}

const CreateProduct = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.channelName);
        const contract = network.getContract(req.chaincodeName);
        let data = req.body.data;
        //  query chaincode....
        let result = await contract.submitTransaction('CreateProduct', data.productId, data.productBatchNo, data.productBatchManufacturingDate, data.productBatchExpiryDate, data.rawMaterialId, data.productName, data.productDescription, data.productCategory, data.productManufacturingLocation, data.productQuantity, data.productManufacturingPrice, data.productManufacturingDate, data.productExpiryDate, data.productIngredients, data.type, data.productSKU, data.productGTIN, data.productImage);
        await gateway.disconnect();

        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await ProductModel.findOne({productId:data.productId});
        console.log(obj);
        if (obj) {
            obj.org= req.body.org;
            obj.userName= req.body.userName;
            obj.userType= req.body.userType;
            obj.channelName= req.body.channelName;
            obj.chaincodeName= req.body.chaincodeName;

            obj.productNotes=req.body.data.productNotes;
            obj.productStatus=req.body.data.productStatus;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');
          } else {
            console.log('Document not found.');
          }

        res.status(200).json({
            result: result
        });
    }
    catch (error){
        res.send(error);
    }
}

const UpdateProduct = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.channelName);
        const contract = network.getContract(req.chaincodeName);
        let data = req.data;
        //  query chaincode....
        let result = await contract.submitTransaction('UpdateProduct', data.productId, data.productBatchNo, data.productBatchManufacturingDate, data.productBatchExpiryDate, data.rawMaterialId, data.productName, data.productDescription, data.productCategory, data.productManufacturingLocation, data.productQuantity, data.productManufacturingPrice, data.productManufacturingDate, data.productExpiryDate, data.productIngredients, data.type, data.productSKU, data.productGTIN, data.productImage);
        await gateway.disconnect();

        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await ProductModel.findOne({productId:data.productId});
        console.log(obj);
        if (obj) {
            obj.org= req.body.org;
            obj.userName= req.body.userName;
            obj.userType= req.body.userType;
            obj.channelName= req.body.channelName;
            obj.chaincodeName= req.body.chaincodeName;

            obj.productNotes=req.body.data.productNotes;
            obj.productStatus=req.body.data.productStatus;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');
          } else {
            console.log('Document not found.');
          }

        res.status(200).json({
            result: result
        });
    }
    catch (error){
        res.send(error);
    }
}

const GetProductById = async(req, res) => {
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.channelName);
        const contract = network.getContract(req.chaincodeName);
        let data = req.data;
        // Query chaincode...
        let result = await contract.evaluateTransaction("GetProductById", data.productId);
        await gateway.disconnect();
        res.status(200).json({
            result: result
        });
    }
    catch (error){
        res.send(error);
    }
}

const DeleteProduct = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.channelName);
        const contract = network.getContract(req.chaincodeName);
        let data = req.data;
        // Query chaincode...
        let result = await contract.submitTransaction("DeleteRawMaterial", data.productId);
        await gateway.disconnect();
        res.status(200).json({
            result: result
        });
    }
    catch (error){
        res.send(error);
    }
}

const checkProductAvailability = async(req, res)=>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.channelName);
        const contract = network.getContract(req.chaincodeName);
        let data = req.body.data;
        // Query chaincode...
        let result = await contract.evaluateTransaction("checkProductAvailabilty", data.searchProduct, data.productQuantity);
        await gateway.disconnect();
        res.status(200).json({
            result: result
        });
    }
    catch (error){
        res.send(error);
    }
}

export default{
    GetAllProducts,
    InitProducts,
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    checkProductAvailability,
    GetProductById
}