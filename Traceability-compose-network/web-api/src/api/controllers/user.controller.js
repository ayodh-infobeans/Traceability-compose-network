import fabricNetwork from 'fabric-network';
import FabricCAServices  from 'fabric-ca-client';
import log4js from 'log4js';
import Jwt from 'jsonwebtoken';

import caUtils from '../../config/CAUtils.js';
import appUtils from '../../config/AppUtils.js';
import buildCCP from '../../config/buildCCP.js';
import constants from '../../config.constants.js';
import commonUtils from '../utils/common.util.js';
import UserModel from '../../models/usermodel.js';
import Connections from '../utils/connections.util.js';
import sendEmail from '../utils/notifications.util.js';

const { Wallets } = fabricNetwork;
const logger = log4js.getLogger('TraceabilityNetwork');

const { registerAndEnrollUser, enrollAdmin, userExist, buildCAClient } = caUtils;
const { buildWallet } = appUtils;
const { getCCP } = buildCCP;
const { GetWalletPath } = constants;
const { generateUniqueIdentity, getOrgNameFromMSP, generateResponsePayload } = commonUtils;
const { connectToMongoDB } = Connections;
const { sendEmailByNodemailer } = sendEmail;

const registerUser = async (req, res) => {
    //  Need to be tested.....
    try{
        const {userName, orgMSP, userEmail} = req?.body;
        if(userName && orgMSP && userEmail){
            const userId = generateUniqueIdentity(userName);     
            var token = Jwt.sign({
                exp: Math.floor(Date.now() / 1000) + parseInt("36000"),
                userName: userName,
                orgMSP: orgMSP
            }, 'thisismysecret');
            const org = getOrgNameFromMSP(orgMSP);
            const ccp = getCCP(org);
            const walletPath = GetWalletPath(org);
            const caClient = buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`);
            let wallet = await buildWallet(Wallets, walletPath);
            await enrollAdmin(caClient, wallet, orgMSP);
            let response = await registerAndEnrollUser(caClient, wallet, orgMSP, userId, `${org}.department1`);
            await connectToMongoDB(org);
            const obj = UserModel(req?.body);
            obj.userId = userId;
            if (response && typeof response !== 'string') {
                logger.debug('Successfully registered the username %s for organization %s', userName, orgMSP);
                obj.save()
                    .then(async () => {
                        // response.token = token;
                        let subject = 'User Registration Successful';
                        let msg_body = 'Hi ' + userName + ' ' + orgMSP + ',<br />';
                            msg_body += `Registration Successful !! Please same your user Id & token for future login & assistance<br />`;
                            msg_body += '<br /><br /> User Id' + response?.userId + '<br />';
                        // await sendEmailByNodemailer(userEmail, subject, msg_body);
                        return res.send(generateResponsePayload("User Registration Successfull", "Success", 200, response)); 
                    })
                    .catch((error) => {
                        return res.send(generateResponsePayload(error, "error",500, null));
                    });
                    return;
            } else {
                logger.debug('Failed to register the username %s for organization %s with::%s', userName, orgMSP ,response);
                return res.send(generateResponsePayload("Something went wrong. Please try again.", "false", 500, response));
            }
        }
        return res.send(generateResponsePayload("Something went wrong. Please try again.", "false", 500, null));
    }
    catch(error){
        return res.send(generateResponsePayload(error, "error",500, null));
    }
}   

const loginUser = async (req, res) => {
    try{
        const {userName, orgMSP} = req?.body;
        if(userName && orgMSP){
            var token = Jwt.sign({
                exp: Math.floor(Date.now() / 1000) + parseInt("36000"),
                userName: userName,
                orgMSP: orgMSP
            }, 'thisismysecret');
            let org = getOrgNameFromMSP(orgMSP);
            let walletPath = GetWalletPath(org);
            let wallet = await buildWallet(Wallets, walletPath);
            const userIdentityExist = await userExist(wallet,userName);
            if(userIdentityExist){
                return res.json(generateResponsePayload("Login Successful", "Success", 200, token));
            }
            else{
                return res.json(generateResponsePayload(`User with username ${userName} is not registered with ${orgMSP}, Please register first.`, "false", 500, null));
            }
        }
        return res.send(generateResponsePayload("Something went wrong. Please try again.", "false", 500, null));
    }
    catch(error){
        return res.send(generateResponsePayload(error, "error",500, null));
    }
    
}

export default {
    registerUser,
    loginUser
}
