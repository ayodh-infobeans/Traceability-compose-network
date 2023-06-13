import Connections from '../utils/connections.util.js';
import commonUtils from '../utils/common.util.js';
import paymentUtils from '../utils/payment.util.js';

const { connectToFabricNetwork, connectToMongoDB } = Connections;
const { generateResponsePayload } = commonUtils;

const makePayment = async(req, res) =>{
    try{
        
        let payStatus="Due";
        let payID;
        const {userName, orgMSP, channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        
        paymentUtils.payStatus(data?.paymentAmount).then((status) => {
            payStatus="Paid";
            payID=JSON.parse(status).id;
          })
          .catch((error) => {
            console.error(error);
          });
          
        await new Promise(resolve => setTimeout(resolve, 5000));
        let result = await networkAccess?.contract.submitTransaction("Payment:makePayment", data?.poNumber, payID, data?.vendorName,data?.invoiceNumber,data?.invoiceDate,data?.invoiceAmount,data?.paymentAmount,data?.paymentDate,data?.paymentMethod ,data?.description,payStatus,data?.notes);
        if(result) {
            const responsePayload = generateResponsePayload(result.toString(), null, null);
            await networkAccess?.gateway.disconnect();
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

const GetTransactionById = async(req, res) => {
    try{
        const {userName, orgMSP,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract.evaluateTransaction("Payment:GetTransactionById", data?.paymentRefrenceNumber);
        if(result) {
            const responsePayload = generateResponsePayload(result.toString(), null, null);
            await networkAccess?.gateway.disconnect();
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

const GetAllTransactions = async(req, res) =>{
    try{
        const {userName, orgMSP,channelName, chaincodeName} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(null, error?.name, error?.message);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract.evaluateTransaction("Payment:GetAllTransactions");
        if(result) {
            const responsePayload = generateResponsePayload(result.toString(), null, null);
            await networkAccess?.gateway.disconnect();
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



export default{
    makePayment,
    GetTransactionById,
    GetAllTransactions
}

