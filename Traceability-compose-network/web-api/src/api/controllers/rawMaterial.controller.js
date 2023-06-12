import Connections from '../utils/connections.util.js';
import commonUtils from '../utils/common.util.js';
import RawModel from '../../models/rawmodel.js';


const GetAllRawMaterial = async(req, res, next) =>{
    try{
        const {userName, orgMSP ,channelName, chaincodeName} = req.body;
        const networkAccess =  await Connections.connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let result = await networkAccess.contract.evaluateTransaction("RawMaterialTransfer:GetAllRawMaterials");
        const response_payload = commonUtils.generateResponsePayload(result, null, null);
        await networkAccess.gateway.disconnect();
        res.send(response_payload);
        
    }
    catch (error){
        const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
        res.send(response_payload)
    }

}

const CreateRawMaterial = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        const networkAccess =  await Connections.connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let result = await networkAccess.contract.submitTransaction("RawMaterialTransfer:CreateRawMaterial", data.rawID, data.rawMaterialName, data.rawMaterialCategory, data.rawMaterialLocation, data.rawMaterialQuantity, data.rawMaterialPrice, data.rawMaterialDescription, data.rawMaterialProductionDate, data.rawMaterialExpiryDate, data.rawMaterialSpecifications, data.rawMaterialCultivationMethod, data.rawMaterialFertilizers, data.rawMaterialImage);
        await Connections.connectToMongoDB(networkAccess.org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await RawModel.findOne({rawID:data.rawID});
        if (obj.toString()) {
            
            obj.rawMaterialStatus=data.rawMaterialStatus;

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

        const response_payload = commonUtils.generateResponsePayload(result, null, null);
        await networkAccess.gateway.disconnect();
        res.send(response_payload);
    }
    catch (error){
        const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
        res.send(response_payload)
    }
}

const UpdateRawMaterial = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        const networkAccess =  await Connections.connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let result = await networkAccess.contract.submitTransaction('RawMaterialTransfer:UpdateRawMaterial', data.rawID, data.rawMaterialName, data.rawMaterialCategory, data.rawMaterialLocation, data.rawMaterialQuantity, data.rawMaterialPrice, data.rawMaterialDescription, data.rawMaterialProductionDate, data.rawMaterialExpiryDate, data.rawMaterialSpecifications, data.rawMaterialCultivationMethod, data.rawMaterialFertilizers,  data.rawMaterialImage);
        await Connections.connectToMongoDB(networkAccess.org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await RawModel.findOne({rawID:data.rawID});
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

        const response_payload = commonUtils.generateResponsePayload(result.toString() + "Raw Material updated successfully", null, null);
        await networkAccess.gateway.disconnect();
        res.send(response_payload);
    }
    catch (error){
        const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
        res.send(response_payload)
    }
}

const GetRawMaterialById = async(req, res) => {
    try{
        const {userName, orgMSP ,channelName, chaincodeName, data} = req.body;
        const networkAccess =  await Connections.connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let result = await networkAccess.contract.evaluateTransaction("RawMaterialTransfer:GetRawMaterialById", data.rawID);
        const response_payload = commonUtils.generateResponsePayload(result.toString(), null, null);
        await networkAccess.gateway.disconnect();
        res.send(response_payload);
    }
    catch (error){
        const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
        res.send(response_payload)
    }
}

const DeleteRawMaterial = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        const networkAccess =  await Connections.connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let result = await networkAccess.contract.submitTransaction("RawMaterialTransfer:DeleteRawMaterial", data.rawID);
        const response_payload = commonUtils.generateResponsePayload("Raw Material deleted Successfully", null, null);
        await networkAccess.gateway.disconnect();
        res.send(response_payload);
    }
    catch (error){
        const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
        res.send(response_payload)
    }
}


const CheckRawMaterialAvailability = async(req, res)=>{
    try{
        const {data} = req.body;
        
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
        const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
        res.send(response_payload)
    }
}


const ConfirmRawMaterialAvailability = async(req, res)=>{
    try{
        const {data} = req.body;
        if (orgMSP != "Org1MSP"){
            
            return res.status(400).json({ message: `Caller with MSP ID ${orgMSP} is not authorized to confirm raw material availability` });
        }

        const rawObj = await RawModel.find({rawMaterialName: data.rawMaterialName});
        if(rawObj.toString()){
            const obj=await RawModel.find({ $and: [{rawMaterialName: data.rawMaterialName},{rawMaterialQuantity: {$gte:data.rawMaterialQuantity}},{rawMaterialPrice: { $eq: data.rawMaterialPrice }}]});                
            if(obj.toString()){
                    // return "Raw material is available in required quantity : "+ JSON.stringify(result);
                res.status(500).json({
                    status: false,
                    message: "Confirmed Raw material is  available in this required quantity and price."
                })                  
            }
            else{
                res.status(200).json({
                    status: true,
                    result: "Please"+ JSON.stringify(rawObj) + " provide  this raw material detail with availabile quantity and its mentioned price. "
                });
            }
        }
        else{
            res.status(500).json({
                status: false,
                message: "Raw material is not available."
            })
        }
        // rawMaterialName: data.rawMaterialName;
        // rawMaterialQuantity: data.rawMaterialQuantity;
        // rawMaterialUnitPrice: data.rawMaterialUnitPrice;
        // shippingDateTime: data.shippingDateTime;
        // estDeliveryDateTime: data.estDeliveryDateTime        
    }
    catch (error){
        const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
        res.send(response_payload)
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