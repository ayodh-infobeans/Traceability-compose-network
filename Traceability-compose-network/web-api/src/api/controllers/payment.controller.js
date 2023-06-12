import Connections from '../utils/connections.util.js';
import commonUtils from '../utils/common.util.js';
import paymentUtils from '../utils/payment.util.js';



const makePayment = async(req, res) =>{
    try{
        
        let payStatus="Due";
        let payID;
        const {userName, orgMSP, channelName, chaincodeName, data} = req.body;
        const networkAccess =  await Connections.connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(networkAccess.status === false){
            const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
            res.send(response_payload);
            return;
        }
        paymentUtils.payStatus(data.paymentAmount).then((status) => {
            payStatus="Paid";
            payID=JSON.parse(status).id;
          })
          .catch((error) => {
            console.error(error);
          });
          
        await new Promise(resolve => setTimeout(resolve, 5000));
        let result = await networkAccess.contract.submitTransaction("Payment:makePayment", data.poNumber, payID, data.vendorName,data.invoiceNumber,data.invoiceDate,data.invoiceAmount,data.paymentAmount,data.paymentDate,data.paymentMethod ,data.description,payStatus,data.notes);
        await networkAccess.gateway.disconnect();

        const response_payload = commonUtils.generateResponsePayload(result.toString(), null, null);
        res.send(response_payload);
        return;
    }

    catch (error){
        const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
        res.send(response_payload)
    }
}


const GetTransactionById = async(req, res) => {
    try{
        const {userName, orgMSP,channelName, chaincodeName, data} = req.body;
        const networkAccess =  await Connections.connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(networkAccess.status === false){
            const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
            res.send(response_payload);
            return;
        }
        let result = await networkAccess.contract.evaluateTransaction("Payment:GetTransactionById", data.paymentRefrenceNumber);
        const response_payload = {
            result: result.toString(),
            error: null,
            errorData: null
        }
        await networkAccess.gateway.disconnect();
        res.send(response_payload);
        return;
    }
    catch (error){
        const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
        res.send(response_payload)
    }
}

const GetAllTransactions = async(req, res, next) =>{
    try{
        const {userName, orgMSP,channelName, chaincodeName} = req.body;
        const networkAccess =  await Connections.connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(networkAccess.status === false){
            const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
            res.send(response_payload);
            return;
        }
        let result = await networkAccess.contract.evaluateTransaction("Payment:GetAllTransactions");
        const response_payload = commonUtils.generateResponsePayload(result.toString(), null, null);
        await networkAccess.gateway.disconnect();
        res.send(response_payload);
        return;
    }
    catch (error){
        const response_payload = commonUtils.generateResponsePayload(null, error.name, error.message);
        res.send(response_payload)
    }

}



export default{
    makePayment,
    GetTransactionById,
    GetAllTransactions
}

