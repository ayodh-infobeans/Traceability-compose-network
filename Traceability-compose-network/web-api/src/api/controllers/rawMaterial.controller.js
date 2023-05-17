import httpStatus from 'http-status';
import pkg from 'fabric-network';
const { Gateway, Wallets } = pkg;
import fs from 'fs';
import path from 'path';
import buildCCP from '../../config/buildCCP.js';
import ConnectGateway from '../utils/gateway.util.js';

const GetAllRawMaterial = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = await ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork("mychannel");
        const contract = network.getContract(req.body.chaincodeName);
        let result = await contract.evaluateTransaction("RawMaterialTransfer:GetAllRawMaterials");
        await gateway.disconnect();

        res.send(result);
    }
    catch (error){
        res.send(error);
    }
}

const CreateRawMaterial = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = await ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.body.channelName);
        const contract = network.getContract(req.body.chaincodeName);
        let data = req.body.data;
        //  query chaincode....
        let result = await contract.submitTransaction("RawMaterialTransfer:CreateRawMaterial", data.rawID, data.rawMaterialName, data.rawMaterialCategory, data.rawMaterialLocation, data.rawMaterialQuantity, data.rawMaterialPrice, data.rawMaterialDescription, data.rawMaterialProductionDate, data.rawMaterialExpiryDate, data.rawMaterialSpecifications, data.rawMaterialCultivationMethod, data.rawMaterialFertilizers, data.rawMaterialStatus, data.rawMaterialImage);
        await gateway.disconnect();
        res.send(result);
    }
    catch (error){
        res.send(error);
    }
}

const UpdateRawMaterial = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = await ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.body.channelName);
        const contract = network.getContract(req.body.chaincodeName);
        let data = req.body.data;
        //  query chaincode....
        let result = await contract.submitTransaction('RawMaterialTransfer:UpdateRawMaterial', data.rawID, data.rawMaterialName, data.rawMaterialCategory, data.rawMaterialLocation, data.rawMaterialQuantity, data.rawMaterialPrice, data.rawMaterialDescription, data.rawMaterialProductionDate, data.rawMaterialExpiryDate, data.rawMaterialSpecifications, data.rawMaterialCultivationMethod, data.rawMaterialFertilizers, data.rawMaterialStatus, data.rawMaterialImage);
        await gateway.disconnect();
        res.status(200).json({
            result: result
        });
    }
    catch (error){
        res.send(error);
    }
}

const GetRawMaterialById = async(req, res) => {
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = await ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.body.channelName);
        const contract = network.getContract(req.body.chaincodeName);
        let data = req.body.data;
        // Query chaincode...
        let result = await contract.evaluateTransaction("RawMaterialTransfer:GetRawMaterialById", data.rawID);
        await gateway.disconnect();
        res.send(result);
    }
    catch (error){
        res.send(error);
    }
}

const DeleteRawMaterial = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = await ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.body.channelName);
        const contract = network.getContract(req.body.chaincodeName);
        let data = req.body.data;
        // Query chaincode...
        let result = await contract.submitTransaction("RawMaterialTransfer:DeleteRawMaterial", data.rawID);
        await gateway.disconnect();
        res.status(200).json({
            result: result
        });
    }
    catch (error){
        res.send(error);
    }
}

const CheckRawMaterialAvailability = async(req, res)=>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let substringToRemove = 'MSP';
        let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
        let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1); 
        const ccp = buildCCP.getCCP(org);
        const gateway = await ConnectGateway.connectToGateway(ccp, userId);
        const network = await gateway.getNetwork(req.body.channelName);
        const contract = network.getContract(req.body.chaincodeName);
        let data = req.body.data;
        // Query chaincode...
        let result = await contract.evaluateTransaction("RawMaterialTransfer:checkRawMaterialAvailabilty", data.rawMaterialName, data.rawMaterialQuantity);
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
    GetAllRawMaterial,
    CreateRawMaterial,
    UpdateRawMaterial,
    DeleteRawMaterial,
    CheckRawMaterialAvailability,
    GetRawMaterialById
}