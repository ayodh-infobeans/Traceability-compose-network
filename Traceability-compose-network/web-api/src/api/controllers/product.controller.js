import Connections from '../utils/connections.util.js';
import commonUtils from '../utils/common.util.js';
import ProductModel from '../../models/productmodel.js';
import offchainUtil from '../utils/offchain.util.js';
import pinata from './../storage/pinataIndex.js';
import moment from 'moment';

const { uploadToPinata } = pinata;

const { connectToFabricNetwork, connectToMongoDB} = Connections;
const { generateResponsePayload, getOrgNameFromMSP } = commonUtils;
const {setOrgChannel,runOffchainScript,stopOffchainScript } = offchainUtil;
import {v4 as uuidv4} from 'uuid';

const GetAllProducts = async(req, res) =>{
    try{
        const {userName, orgMSP ,channelName, chaincodeName} = req?.body;
        
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error, "error",500, null);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.evaluateTransaction("ProductContract:GetAllProducts");
        if(result) {
            const responsePayload = generateResponsePayload("Products","Success", 200 ,result?.toString());
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload("Something went wrong. Please try again.", "false", 500, null);
        return res.send(responsePayload);
        
    }
    catch (error){
        const response_payload = generateResponsePayload(error, "error",500, null);
        res.send(response_payload)
    }
}

const CreateProduct = async(req, res) =>{
    
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);
        const imgPath =  await uploadToPinata(req?.file?.path);
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log("timestamp ==",timestamp);
        
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error, "error",500, null);
            return res.send(response_payload);
        }
        let id = uuidv4();
        let result = await networkAccess?.contract?.submitTransaction('ProductContract:CreateProduct', id, data?.rawMaterialIds, data?.name, data?.description, data?.category, data?.manufacturingLocation, data?.quantity, data?.manufacturingPrice, data?.manufacturingDate, data?.expiryDate, data?.ingredients, data?.temprature,data?.humidity, data?.transportTemprature, data?.minTemprature, data?.maxTemprature, data?.SKU, data?.GTIN,  imgPath,timestamp ,timestamp );
        
        console.log("Sc",result);
        await runOffchainScript("node",options);
        await Connections.connectToMongoDB(networkAccess?.org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await ProductModel.findOne({id:id});
        console.log(obj);
        if (obj) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.notes=data?.notes;
            obj.status=data?.status;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        
        await stopOffchainScript();

        if(result) {
            const responsePayload = generateResponsePayload("Product Created Successfully","Success", 200 , null);
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload("Something went wrong. Please try again.", "false", 500, null);
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(error, "error",500, null);
        return res.send(response_payload)
    }
}

const UpdateProduct = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        // const Jdata = JSON.parse(data);
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);
        console.log("av = ", req?.file);
        const imgPath =  await uploadToPinata(req?.file?.path);
        const updatedTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        
        console.log(networkAccess?.status);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error, "error",500, null);
            return res.send(response_payload);
        }
        console.log("data?.id, data?.rawMaterialIds, data?.name, data?.description, data?.category, data?.manufacturingLocation, data?.quantity, data?.manufacturingPrice, data?.manufacturingDate, data?.expiryDate, data?.ingredients, data?.temprature,data?.humidity, data?.transportTemprature, data?.minTemprature, data?.maxTemprature,data?.SKU, data?.GTIN, imgPath,updatedTimestamp",data?.id, data?.rawMaterialIds, data?.name, data?.description, data?.category, data?.manufacturingLocation, data?.quantity, data?.manufacturingPrice, data?.manufacturingDate, data?.expiryDate, data?.ingredients, data?.temprature,data?.humidity, data?.transportTemprature, data?.minTemprature, data?.maxTemprature,data?.SKU, data?.GTIN, imgPath,updatedTimestamp)
        let result = await networkAccess?.contract?.submitTransaction('ProductContract:UpdateProduct', data?.id, data?.rawMaterialIds, data?.name, data?.description, data?.category, data?.manufacturingLocation, data?.quantity, data?.manufacturingPrice, data?.manufacturingDate, data?.expiryDate, data?.ingredients, data?.temprature,data?.humidity, data?.transportTemprature, data?.minTemprature, data?.maxTemprature,data?.SKU, data?.GTIN, imgPath,updatedTimestamp);
        await runOffchainScript("node",options);

        await connectToMongoDB(networkAccess?.org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await ProductModel.findOne({id:data?.id});
        if (obj) {
            
            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.notes=data?.notes;
            obj.status=data?.status;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        
        await stopOffchainScript();
        if(result) {
            const responsePayload = generateResponsePayload("Product Updated Successfully","Success", 200 , null);
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload("Something went wrong. Please try again.", "false", 500, null);
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(error, "error",500, null);
        return res.send(response_payload);
    }
}

const GetProductById = async(req, res) => {
    try{
        const {userName, orgMSP ,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error, "error",500, null);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.evaluateTransaction("ProductContract:GetProductById", data?.id);
        if(result) {
            const responsePayload = generateResponsePayload("Product with given id is avilable.","Success", 200 ,result?.toString());
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload("Something went wrong. Please try again.", "false", 500, null);
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(error, "error",500, null);
        return res.send(response_payload);
    }
}

const DeleteProduct = async(req, res) =>{
    try{
        const {userName, orgMSP, channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error, "error",500, null);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.submitTransaction("ProductContract:DeleteProduct", data?.id);
        await runOffchainScript("node",options);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await stopOffchainScript();
        if(result) {
            const responsePayload = generateResponsePayload("Product Deleted Successfully","Success", 200 ,result?.toString());
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }
        
        const responsePayload = generateResponsePayload("Something went wrong. Please try again.", "false", 500, null);
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(error, "error",500, null);
        return res.send(response_payload);
    }
}

const CheckProductAvailability = async(req, res)=>{
    try{
        const {data} = req?.body;
        let org = getOrgNameFromMSP(req?.body?.orgMSP);
        await connectToMongoDB(org);
        const productObj = await ProductModel.find({name: data?.name});

        if(productObj.length > 0){
            const obj=await ProductModel.find({ $and: [{name: data?.name},{quantity: {$gte:data?.quantity}}]});                
            if(obj.length > 0){
                    // return "Raw material is available in required quantity : "+ JSON.stringify(result);
                return res.status(200).json({
                    status: true,
                    result: "Product is available in required quantity"
                });
            }
            else{
                return res.status(500).json({
                    status: false,
                    message: "Product is not available in required quantity"
                })
            }
        }
        else{
            return res.status(500).json({
                status: false,
                message: "Product is not available"
            })
        }
    }
    catch (error){
        const response_payload = generateResponsePayload(error, "error",500, null);
        return res.send(response_payload);
    }
}

const ConfirmProductAvailability = async(req, res)=>{
    try{
        const {orgMSP, data} = req?.body;
        let org = getOrgNameFromMSP(req?.body?.orgMSP);
        await connectToMongoDB(org);
        if (orgMSP != "Org2MSP"){
            
            return res.status(400).json({ message: `Caller with MSP ID ${orgMSP} is not authorized to confirm product availability` });
        }

        const prodObj = await ProductModel.find({name: data?.name});
        if(prodObj.length > 0){
            const obj=await ProductModel.find({ $and: [{name: data?.name},{quantity: {$gte:data?.quantity}},{manufacturingPrice: { $eq: data?.manufacturingPrice }}]});                
            if(obj.length > 0){
                    // return "Raw material is available in required quantity : "+ JSON.stringify(result);
                return res.status(200).json({
                    status: true,
                    message: "Confirmed Product is  available in this required quantity and price."
                })                  
            }
            else{
                return res.status(500).json({
                    status: false,
                    result: "Product is not availabile in required quantity and its mentioned price. "
                });
            }
        }
        else{
            return res.status(500).json({
                status: false,
                message: "Product is not available."
            })
        } 
    }
    catch (error){
        const response_payload = generateResponsePayload(error, "error",500, null);
        return res.send(response_payload);
    }
}


export default{
    GetAllProducts,
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    CheckProductAvailability,
    GetProductById,
    ConfirmProductAvailability
}