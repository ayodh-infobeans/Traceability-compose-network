import Connections from '../utils/connections.util.js';
import commonUtils from '../utils/common.util.js';
import offchainUtil from '../utils/offchain.util.js';
import RawModel from '../../models/rawmodel.js';
import pinata from './../storage/pinataIndex.js';
import moment from 'moment';

const { uploadToPinata } = pinata;
const { connectToFabricNetwork, connectToMongoDB } = Connections;
const { generateResponsePayload, getOrgNameFromMSP } = commonUtils;
const { setOrgChannel,runOffchainScript,stopOffchainScript } = offchainUtil;
import {v4 as uuidv4} from 'uuid';


const GetAllRawMaterial = async(req, res) =>{
    try{
        const { userName, orgMSP ,channelName, chaincodeName } = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        
        if(!networkAccess?.status){
            const responsePayload = generateResponsePayload(error?.message, "error",500, null);
            return res.send(responsePayload);
        }

        let result = await networkAccess?.contract?.evaluateTransaction("RawMaterialTransfer:GetAllRawMaterials");
        if(result) {
            const responsePayload = generateResponsePayload("Raw Materials","Success", 200 ,result?.toString());
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload("Something went wrong. Please try again.", "false", 500, null);
        return res.send(responsePayload);
    } catch (error){
        const responsePayload = generateResponsePayload(error?.message, "error",500, null);
        return res.send(responsePayload);
    }

}

const CreateRawMaterial = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);
        const imgPath =  await uploadToPinata(req?.file?.path);
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error?.message, "error",500, null);
            return res.send(response_payload);
        }

        let id = uuidv4();
        let result = await networkAccess?.contract?.submitTransaction("RawMaterialTransfer:CreateRawMaterial", id, data?.name, data?.category, data?.location, data?.quantity, data?.price, data?.description, data?.productionDate, data?.expiryDate, data?.specifications, data?.cultivationMethod, data?.fertilizers, imgPath,timestamp,timestamp);
        
        await runOffchainScript("node",options);
        await connectToMongoDB(networkAccess?.org);

        await new Promise(resolve => setTimeout(resolve, 6000));
        const obj = await RawModel.findOne({id:id});
        console.log("obj output check =",obj?.length);
        if (obj) {
            
            obj.status=data?.status;

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        await stopOffchainScript();

        if(result) {
            const responsePayload = generateResponsePayload("Raw Material created successfully", "success", 200, null);
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload("Something went wrong. Please try again.", "false", 500, null);
        return res.send(responsePayload);
    }
    catch (error){
        console.log("================================================",res.status);
        const response_payload = generateResponsePayload(error?.message, "error",500, null);
        return res.send(response_payload)
    }
}

const UpdateRawMaterial = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);
        const imgPath =  await uploadToPinata(req?.file?.path);
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error?.message, "error",500, null);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract.submitTransaction('RawMaterialTransfer:UpdateRawMaterial', data?.id, data?.name, data?.category, data?.location, data?.quantity, data?.price, data?.description, data?.productionDate, data?.expiryDate, data?.specifications, data?.cultivationMethod, data?.fertilizers, imgPath,timestamp);
        await runOffchainScript("node",options);
        await connectToMongoDB(networkAccess?.org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await RawModel.findOne({id:data?.id});
        if (obj) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.status=data?.status;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        await stopOffchainScript();
        if(result) {
            const responsePayload = generateResponsePayload("Raw Material Updated Successfully","Success",200, null);
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload("Something went wrong. Please try again.", "false", 500, null);
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(error?.message, "error",500, null);
        return res.send(response_payload)
    }
}

const GetRawMaterialById = async(req, res) => {
    try{
        const {userName, orgMSP ,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess.status){
            const response_payload = generateResponsePayload(error?.message, "error",500, null);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.evaluateTransaction("RawMaterialTransfer:GetRawMaterialById", data?.id);
        if(result) {
            const responsePayload = generateResponsePayload(`Raw Material is available with given ${data?.id}.`,"Success", 200,result?.toString());
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload("Something went wrong. Please try again.", "false", 500, null);
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(error?.message, "error",500, null);
        return res.send(response_payload)
    }
}

const DeleteRawMaterial = async(req, res) =>{
    try{
        const {userName, orgMSP, channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error?.message, "error",500, null);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.submitTransaction("RawMaterialTransfer:DeleteRawMaterial", data?.id);
        await runOffchainScript("node",options);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await stopOffchainScript();
        if(result) {
            const responsePayload = generateResponsePayload("Raw Material Deleted Successfully", "Success", 200, result?.toString());
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }
        
        const responsePayload = generateResponsePayload("Something went wrong. Please try again.", "false", 500, null);
        return res.send(responsePayload);
    }

    catch (error){
        const response_payload = generateResponsePayload(error?.message, "error",500, null);
        return res.send(response_payload);
    }
}


const CheckRawMaterialAvailability = async(req, res)=>{
    try{
        const {data} = req?.body;
        let org = getOrgNameFromMSP(req?.body?.orgMSP);
        await connectToMongoDB(org);
        const rawObj = await RawModel.find({name: data?.name});
        
        if(rawObj.length > 0){
            const obj=await RawModel.find({ $and: [{name: data?.name},{quantity: {$gte:data?.quantity}}]});                
            
            if(obj.length > 0 ){
                return res.status(200).json({
                    status: true,
                    result: "Raw material is available in required quantity"
                });
            }
            else{
                return res.status(500).json({
                    status: false,
                    message: "Raw material is not available in required quantity"
                });
            }
        }
        else{
            return res.status(500).json({
                status: false,
                message: "Raw material is not available"
            });
        }
        
    }
    catch (error){
        const response_payload = generateResponsePayload(error?.message, "error",500, null);
        return res.send(response_payload);
    }
}


const ConfirmRawMaterialAvailability = async(req, res)=>{
    try{
        const {orgMSP, data} = req?.body;
        let org = getOrgNameFromMSP(req?.body?.orgMSP);
        await connectToMongoDB(org);
        if (orgMSP != "Org1MSP"){
            
            return res.status(400).json({ message: `Caller with MSP ID ${orgMSP} is not authorized to confirm raw material availability` });
        }

        const rawObj = await RawModel.find({name: data?.name});
        if(rawObj.length > 0){
            const obj=await RawModel.find({ $and: [{name: data?.name},{quantity: {$gte:data?.quantity}},{price: { $eq: data?.price }}]});                
        
            if(obj.length > 0){
                return res.status(200).json({
                    status: true,
                    message: "Confirmed Raw material is  available in this required quantity and price."
                })                  
            }
            else{
                return res.status(500).json({
                    status: false,
                    result: "Raw Material is not available with required quantity & price"
                });
            }
        }
        else{
            return res.status(500).json({
                status: false,
                message: "Raw material is not available."
            })
        } 
    }
    catch (error){
        const response_payload = generateResponsePayload(error?.message, "error",500, null);
        return res.send(response_payload);
    }
}

export default{

    
    GetAllRawMaterial,
    CreateRawMaterial,
    UpdateRawMaterial,
    DeleteRawMaterial,
    CheckRawMaterialAvailability,
    GetRawMaterialById,
    ConfirmRawMaterialAvailability


}