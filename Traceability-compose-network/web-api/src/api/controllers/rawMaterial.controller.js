import ConnectGateway from '../utils/gateway.util.js';
import commonUtils from '../utils/common.util.js';
import RawModel from '../../models/rawmodel.js';

const GetAllRawMaterial = async(req, res, next) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.evaluateTransaction("RawMaterialTransfer:GetAllRawMaterials");
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

const CreateRawMaterial = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.submitTransaction("RawMaterialTransfer:CreateRawMaterial", data.rawID, data.rawMaterialName, data.rawMaterialCategory, data.rawMaterialLocation, data.rawMaterialQuantity, data.rawMaterialPrice, data.rawMaterialDescription, data.rawMaterialProductionDate, data.rawMaterialExpiryDate, data.rawMaterialSpecifications, data.rawMaterialCultivationMethod, data.rawMaterialFertilizers, data.rawMaterialImage);
        await gateway.disconnect();
        console.log("result ==",result);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await RawModel.findOne({rawID:data.rawID});
        console.log(obj);

        if (obj.toString()) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.rawMaterialStatus=data.rawMaterialStatus;
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

const UpdateRawMaterial = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.submitTransaction('RawMaterialTransfer:UpdateRawMaterial', data.rawID, data.rawMaterialName, data.rawMaterialCategory, data.rawMaterialLocation, data.rawMaterialQuantity, data.rawMaterialPrice, data.rawMaterialDescription, data.rawMaterialProductionDate, data.rawMaterialExpiryDate, data.rawMaterialSpecifications, data.rawMaterialCultivationMethod, data.rawMaterialFertilizers,  data.rawMaterialImage);
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await RawModel.findOne({rawID:data.rawID});
        console.log(obj);
        if (obj.toString()) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.rawMaterialStatus=data.rawMaterialStatus;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        
        const response_payload = {
            result: result.toString() + "Raw Material updated successfully",
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


const GetRawMaterialById = async(req, res) => {
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.evaluateTransaction("RawMaterialTransfer:GetRawMaterialById", data.rawID);
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

const DeleteRawMaterial = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.submitTransaction("RawMaterialTransfer:DeleteRawMaterial", data.rawID);
        const response_payload = {
            result: "Raw Material delete Successfully",
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


const CheckRawMaterialAvailability = async(req, res)=>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        
        const rawObj = await RawModel.find({rawMaterialName: data.rawMaterialName});

        if(rawObj.toString()){
            const obj=await RawModel.find({ $and: [{rawMaterialName: data.rawMaterialName},{rawMaterialQuantity: {$gte:data.rawMaterialQuantity}}]});                
            if(obj.toString()){
                    // return "Raw material is available in required quantity : "+ JSON.stringify(result);
                res.status(200).json({
                    status: true,
                    result: "This "+ JSON.stringify(rawObj) + "raw material is available in required quantity"
                });
            }
            else{
                res.status(500).json({
                    status: false,
                    message: "Raw material is not available in required quantity"
                })
            }
        }
        else{
            res.status(500).json({
                status: false,
                message: "Raw material is not available"
            })
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
    GetAllRawMaterial,
    CreateRawMaterial,
    UpdateRawMaterial,
    DeleteRawMaterial,
    CheckRawMaterialAvailability,
    GetRawMaterialById
}


// await new Promise(resolve => setTimeout(resolve, 5000));
//         const obj = await RawModel.findOne({rawID:data.rawID});
//         console.log(obj);
//         if (obj.toString()) {
//             obj.org= req.body.org;
//             obj.userName= req.body.userName;
//             obj.userType= req.body.userType;
//             obj.channelName= req.body.channelName;
//             obj.chaincodeName= req.body.chaincodeName;
//             // Save the modified document back to the database
//             await obj.save();
//             console.log('Document updated successfully.');
//           } else {
//             console.log('Document not found.');
//           }




// const rawObj = await RawModel.find({rawMaterialName: data.rawMaterialName});

//             if(rawObj.toString()){
//                 const obj=await RawModel.find({ $and: [{rawMaterialName: data.rawMaterialName},{rawMaterialQuantity: {$gte:data.rawMaterialQuantity}}]});                
//                 if(obj.toString()){
//                     // return "Raw material is available in required quantity : "+ JSON.stringify(result);
//                     res.status(200).json({
//                         status: true,
//                         result: "This "+ JSON.stringify(rawObj) + "raw material is available in required quantity"
//                     });
//                 }
//                 else{
//                     res.status(500).json({
//                         status: false,
//                         message: "Raw material is not available in required quantity"
//                     })
//                 }
//             }
//             else{
//                 res.status(500).json({
//                     status: false,
//                     message: "Raw material is not available"
//                 })
//             }