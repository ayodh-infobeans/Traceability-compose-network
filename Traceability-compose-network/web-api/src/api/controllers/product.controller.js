import Connections from '../utils/connections.util.js';
import commonUtils from '../utils/common.util.js';
import ProductModel from '../../models/productmodel.js';

const { connectToFabricNetwork, connectToMongoDB} = Connections;
const { generateResponsePayload } = commonUtils;

const GetAllProducts = async(req, res) =>{
    try{
        const {userName, orgMSP ,channelName, chaincodeName} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.evaluateTransaction("ProductContract:GetAllProducts");
        if(result) {
            const responsePayload = generateResponsePayload(result?.toString(), null, null);
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload(null, "Oops!", "Something went wrong. Please try again.");
        return res.send(responsePayload);
        
    }
    catch (error){
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
        res.send(response_payload)
    }
}

const CreateProduct = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.submitTransaction('ProductContract:CreateProduct', data?.productId, data?.rawMaterialIds, data?.productName, data?.productDescription, data?.productCategory, data?.productManufacturingLocation, data?.productQuantity, data?.productManufacturingPrice, data?.productManufacturingDate, data?.productExpiryDate, data?.productIngredients, data?.productSKU, data?.productGTIN,  data?.productImage);
        await connectToMongoDB(networkAccess?.org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await ProductModel.findOne({productId:data?.productId});
        console.log(obj);
        if (obj.toString()) {

            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.productNotes=data?.productNotes;
            obj.productStatus=data?.productStatus;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        
        if(result) {
            const responsePayload = generateResponsePayload(result?.toString(), null, null);
            await networkAccess?.gateway?.disconnect();
            return res.send(responsePayload);
        }

        const responsePayload = generateResponsePayload(null, "Oops!", "Something went wrong. Please try again.");
        return res.send(responsePayload);
    }
    catch (error){
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
        return res.send(response_payload)
    }
}

const UpdateProduct = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.submitTransaction('ProductContract:UpdateProduct', data?.productId,  data?.rawMaterialIds, data?.productName, data?.productDescription, data?.productCategory, data?.productManufacturingLocation, data?.productQuantity, data?.productManufacturingPrice, data?.productManufacturingDate, data?.productExpiryDate, data?.productIngredients, data?.productSKU, data?.productGTIN, data?.productImage);
        await connectToMongoDB(networkAccess?.org);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await ProductModel.findOne({productId:data?.productId});
        if (obj.toString()) {
            
            obj.orgMSP= orgMSP;
            obj.userName= userName;
            obj.userType= userType;
            obj.channelName= channelName;
            obj.chaincodeName= chaincodeName;

            obj.productNotes=data?.productNotes;
            obj.productStatus=data?.productStatus;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');

          } else {
            console.log('Document not found.');
        }
        
        
        if(result) {
            const responsePayload = generateResponsePayload(result?.toString(), null, null);
            await networkAccess?.gateway?.disconnect();
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

const GetProductById = async(req, res) => {
    try{
        const {userName, orgMSP ,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.evaluateTransaction("ProductContract:GetProductById", data?.productId);
        if(result) {
            const responsePayload = generateResponsePayload(result?.toString(), null, null);
            await networkAccess?.gateway?.disconnect();
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

const DeleteProduct = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.submitTransaction("ProductContract:DeleteProduct", data?.productId);
        if(result) {
            const responsePayload = generateResponsePayload(result?.toString(), null, null);
            await networkAccess?.gateway?.disconnect();
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

const CheckProductAvailability = async(req, res)=>{
    try{
        const {data} = req?.body;
        
        const productObj = await ProductModel.find({productName: data?.productName});

        if(productObj.toString()){
            const obj=await ProductModel.find({ $and: [{productName: data?.productName},{productQuantity: {$gte:data?.productQuantity}}]});                
            if(obj.toString()){
                    // return "Raw material is available in required quantity : "+ JSON.stringify(result);
                return res.status(200).json({
                    status: true,
                    result: "This "+ JSON.stringify(productObj) + "product is available in required quantity"
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
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
        return res.send(response_payload);
    }
}

const ConfirmProductAvailability = async(req, res)=>{
    try{
        const {orgMSP, data} = req?.body;
        if (orgMSP != "Org2MSP"){
            
            return res.status(400).json({ message: `Caller with MSP ID ${orgMSP} is not authorized to confirm product availability` });
        }

        const prodObj = await ProductModel.find({productName: data?.productName});
        if(prodObj.toString()){
            const obj=await ProductModel.find({ $and: [{productName: data?.productName},{productQuantity: {$gte:data?.productQuantity}},{productManufacturingPrice: { $eq: data?.productManufacturingPrice }}]});                
            if(obj.toString()){
                    // return "Raw material is available in required quantity : "+ JSON.stringify(result);
                return res.status(500).json({
                    status: false,
                    message: "Confirmed Prouct is  available in this required quantity and price."
                })                  
            }
            else{
                return res.status(200).json({
                    status: true,
                    result: "Please"+ JSON.stringify(prodObj) + " provide  this Product detail with availabile quantity and its mentioned price. "
                });
            }
        }
        else{
            return res.status(500).json({
                status: false,
                message: "Product is not available."
            })
        }
        // rawMaterialName: data.rawMaterialName;
        // rawMaterialQuantity: data.rawMaterialQuantity;
        // rawMaterialUnitPrice: data.rawMaterialUnitPrice;
        // shippingDateTime: data.shippingDateTime;
        // estDeliveryDateTime: data.estDeliveryDateTime        
    }
    catch (error){
        const response_payload = generateResponsePayload(null, error?.name, error?.message);
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