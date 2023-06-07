import ConnectGateway from '../utils/gateway.util.js';
import commonUtils from '../utils/common.util.js';
import paymentUtils from '../utils/payment.util.js';



const makePayment = async(req, res) =>{
    try{
        
        let payStatus="Due";
        let payID;
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        paymentUtils.payStatus(data.paymentAmount).then((status) => {
            payStatus="Paid";
            payID=JSON.parse(status).id;
          })
          .catch((error) => {
            console.error(error);
          });
          
        await new Promise(resolve => setTimeout(resolve, 5000));
        let result = await contract.submitTransaction("Payment:makePayment", data.poNumber, payID, data.vendorName,data.invoiceNumber,data.invoiceDate,data.invoiceAmount,data.paymentAmount,data.paymentDate,data.paymentMethod ,data.description,payStatus,data.notes);
        await gateway.disconnect();

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


const GetTransactionById = async(req, res) => {
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName, data} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.evaluateTransaction("Payment:GetTransactionById", data.paymentRefrenceNumber);
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

const GetAllTransactions = async(req, res, next) =>{
    try{
        const {userName, orgMSP, userType,channelName, chaincodeName} = req.body;
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let gateway = await ConnectGateway.connectToGateway(org, userName);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.evaluateTransaction("Payment:GetAllTransactions");
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
    makePayment,
    GetTransactionById,
    GetAllTransactions
}

