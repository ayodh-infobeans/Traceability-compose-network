import fabricNetwork from 'fabric-network';
const { Wallets } = fabricNetwork;
import FabricCAServices  from 'fabric-ca-client';
import caUtils from '../../config/CAUtils.js';
import appUtils from '../../config/AppUtils.js';
import buildCCP from '../../config/buildCCP.js';
import log4js from 'log4js';
const logger = log4js.getLogger('TraceabilityNetwork');
import constants from '../../config.constants.js';
import commonUtils from '../utils/common.util.js';
import UserModel from '../../models/usermodel.js';
import Jwt from 'jsonwebtoken';
import Connections from '../utils/connections.util.js';
import sendEmail from '../utils/notifications.util.js';

const registerUser = async (req, res, next) => {
    //  Need to be tested.....
    try{
        const {userName, orgMSP, userEmail} = req.body;
        logger.debug('End point : /users');
        logger.debug('User name : ' + userName);
        logger.debug('Org name  : ' + orgMSP);
        const userId = commonUtils.generateUniqueIdentity(userName);
        var token = Jwt.sign({
            exp: Math.floor(Date.now() / 1000) + parseInt("36000"),
            userName: userName,
            orgMSP: orgMSP
        }, 'thisismysecret');
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let ccp = buildCCP.getCCP(org);
        let walletPath = constants.GetWalletPath(org);
        const caClient = caUtils.buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`);
        let wallet = await appUtils.buildWallet(Wallets, walletPath);
        await caUtils.enrollAdmin(caClient, wallet, orgMSP);
        let response = await caUtils.registerAndEnrollUser(caClient, wallet, orgMSP, userId, `${org}.department1`);
        logger.debug('-- returned from registering the username %s for organization %s', userName, orgMSP);
        await Connections.connectToMongoDB(org);
        const obj = UserModel(req.body);
        obj.userId = userId;
        if (response && typeof response !== 'string') {
            logger.debug('Successfully registered the username %s for organization %s', userName, orgMSP);
            obj.save()
                .then(async () => {
                    response.token = token;
                    let subject = 'User Registration Successful';
                    let msg_body = 'Hi ' + userName + ' ' + orgMSP + ',<br />';
                        msg_body += `Registration Successful !! Please same your user Id & token for future login & assistance<br />`;
                        msg_body += '<br /><br /> User Id' + response.userId + '<br />';
                    // await sendEmail.sendEmailByNodemailer(userEmail, subject, msg_body);
                    res.json(response); 
                })
                .catch((error) => {
                res.status(500).json({ error: `An error occurred while saving user details ${error}` });
                });
        } else {
            logger.debug('Failed to register the username %s for organization %s with::%s', userName, orgMSP ,response);
            res.json({ success: false, message: response });
        }
    }
    catch(error){
        res.send(error);
    }
}   

const loginUser = async (req, res, next) => {
    try{
        const {userName, orgMSP} = req.body;
        logger.debug('End point : /users');
        logger.debug('User name : ' + userName);
        logger.debug('Org name  : ' + orgMSP);

        var token = Jwt.sign({
            exp: Math.floor(Date.now() / 1000) + parseInt("36000"),
            userName: userName,
            orgMSP: orgMSP
        }, 'thisismysecret');
        let org = commonUtils.getOrgNameFromMSP(orgMSP);
        let walletPath = constants.GetWalletPath(org);
        console.log(walletPath);
        let wallet = await appUtils.buildWallet(Wallets, walletPath);
        const userIdentityExist = await caUtils.userExist(wallet,userName);
        if(userIdentityExist){
            res.json({ success: true, message: { token: token } });
        }
        else{
            res.json({ success: false, message: `User with username ${userName} is not registered with ${orgMSP}, Please register first.` });
        }
    }
    catch(error){
        res.send(error);
    }
    
}

export default {
    registerUser,
    loginUser
}
