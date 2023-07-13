import Connections from '../utils/connections.util.js';
import commonUtils from '../utils/common.util.js';
import paymentUtils from '../utils/payment.util.js';
import offchainUtil from '../utils/offchain.util.js';

const { connectToFabricNetwork, connectToMongoDB } = Connections;
const { generateResponsePayload } = commonUtils;
const {setOrgChannel,runOffchainScript,stopOffchainScript } = offchainUtil;

const makePayment = async(req, res) =>{
    try{
        
        let payStatus="Due";
        let payID;
        const {userName, orgMSP, channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        let options = setOrgChannel(networkAccess?.org, channelName);

        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error, "error",500, null);
            return res.send(response_payload);
        }
        
        paymentUtils.payStatus(data?.paymentAmount).then((status) => {
            payStatus="Paid";
            payID=JSON.parse(status)?.id;
          })
          .catch((error) => {
            console.error(error);
          });
          
        await new Promise(resolve => setTimeout(resolve, 5000));
        let result = await networkAccess?.contract?.submitTransaction("Payment:makePayment", data?.poNumber, payID, data?.vendorName,data?.invoiceNumber,data?.invoiceDate,data?.invoiceAmount,data?.paymentAmount,data?.paymentDate,data?.paymentMethod ,data?.description,payStatus,data?.notes);
        await runOffchainScript("node",options);
        await stopOffchainScript();
        if(result) {
            const responsePayload = generateResponsePayload("Payment Successful","Success", 200 ,result?.toString());
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

const GetTransactionById = async(req, res) => {
    try{
        const {userName, orgMSP,channelName, chaincodeName, data} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error, "error",500, null);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.evaluateTransaction("Payment:GetTransactionById", data?.paymentRefrenceNumber);
        if(result) {
            const responsePayload = generateResponsePayload("Transaction with provided id is available","Success", 200 ,result?.toString());
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

const GetAllTransactions = async(req, res) =>{
    try{
        const {userName, orgMSP,channelName, chaincodeName} = req?.body;
        const networkAccess =  await connectToFabricNetwork(userName, orgMSP ,channelName, chaincodeName);
        if(!networkAccess?.status){
            const response_payload = generateResponsePayload(error?.message, "error",500, null);
            return res.send(response_payload);
        }
        let result = await networkAccess?.contract?.evaluateTransaction("Payment:GetAllTransactions");
        if(result) {
            const responsePayload = generateResponsePayload("All Transactions","Success", 200 ,result?.toString());
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

export default{
    makePayment,
    GetTransactionById,
    GetAllTransactions
}

