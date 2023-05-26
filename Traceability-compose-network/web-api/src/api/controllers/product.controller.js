import ConnectGateway from '../utils/gateway.util.js';
import commonUtils from '../utils/common.util.js';

const GetAllProducts = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.evaluateTransaction("ProductContract:GetAllProducts");
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

const CreateProduct = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.submitTransaction('ProductContract:CreateProduct', data.productId, data.productBatchNo, data.rawMaterialId, data.productName, data.productDescription, data.productCategory, data.productManufacturingLocation, data.productQuantity, data.productManufacturingPrice, data.productManufacturingDate, data.productExpiryDate, data.productIngredients, data.productSKU, data.productGTIN, data.productNotes, data.productStatus, data.productImage);
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

const UpdateProduct = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.submitTransaction('ProductContract:UpdateProduct', data.productId, data.productBatchNo, data.rawMaterialId, data.productName, data.productDescription, data.productCategory, data.productManufacturingLocation, data.productQuantity, data.productManufacturingPrice, data.productManufacturingDate, data.productExpiryDate, data.productIngredients, data.productSKU, data.productGTIN, data.productNotes, data.productStatus, data.productImage);
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

const GetProductById = async(req, res) => {
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.evaluateTransaction("ProductContract:GetProductById", data.productId);
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

const DeleteProduct = async(req, res) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.submitTransaction("ProductContract:DeleteProduct", data.productId);
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

const CheckProductAvailability = async(req, res)=>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.evaluateTransaction("ProductContract:checkProductAvailabilty", data.searchProduct, data.productQuantity);
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

export default{
    GetAllProducts,
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    CheckProductAvailability,
    GetProductById
}