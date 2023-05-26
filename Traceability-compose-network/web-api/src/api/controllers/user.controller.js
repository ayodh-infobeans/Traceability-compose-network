import fabricNetwork from 'fabric-network';
const { Wallets } = fabricNetwork;
import FabricCAServices  from 'fabric-ca-client';
// const { FabricCAServices } = fabricCaClient;
import fs from 'fs';
import caUtils from '../../config/CAUtils.js';
import appUtils from '../../config/AppUtils.js';
import buildCCP from '../../config/buildCCP.js';
import path from 'path';
import pkg from 'fabric-common';
const { Utils: utils } = pkg;
import constants from '../../config.constants.js';
import commonUtils from '../utils/common.util.js';
import ConnectGateway from '../utils/gateway.util.js';
import { fileURLToPath } from 'url';
import app from '../app.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let config=utils.getConfig();
// config.file(path.resolve(__dirname,'config.json'))
let walletPath = constants.GetWalletPath;
let gateway = null;

const registerUser = async (req, res) => {
    // Number(OrgMSP.match(/\d/g).join(""))
    let OrgMSP = req.body.org;
    let userName = req.body.userName;
    let userId = commonUtils.generateUniqueIdentity(req.body.userName);
    let org = commonUtils.getOrgNameFromMSP(OrgMSP);
    console.log(org);
    let ccp = buildCCP.getCCP(org);
    console.log(ccp);
    const caClient = caUtils.buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`);
    let wallet = await appUtils.buildWallet(Wallets, walletPath);
    await caUtils.enrollAdmin(caClient, wallet, OrgMSP);
    wallet = await caUtils.registerAndEnrollUser(caClient, wallet, OrgMSP, userId, `${org}.department1`);
    res.status(200).send({
        userName: userName,
        userId: userId,
        result: "User register successfully. Please save this for future reference",
    });
}

const loginUser = async (req, res) => {
    try{
        let userId = req.body.userName;
        let OrgMSP = req.body.org;
        let org = commonUtils.getOrgNameFromMSP(OrgMSP);
        let ccp = buildCCP.getCCP(org);
        const caClient = caUtils.buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`);
        let wallet = await Wallets.newFileSystemWallet(walletPath);
        const userIdentityExist = await caUtils.userExist(wallet,userId);
        if(!userIdentityExist){
            throw new Error(`User ${userId} does not exist`);
        }
        let userIdentity = await wallet.get(userId);
        let gateway = await ConnectGateway.connectToGateway(ccp, userId,userIdentity, wallet);
        app.setSession(gateway);
        res.send("User logged In successfully");
    }
    catch(error){
        res.send(error);
    }
    
}

const logout = async(req, res) =>{
    try {
        let session = app.getSession();
        if(session != null){
            session.gateway.disconnect();
            app.setSession(null);
            res.send('User logged out successfully');
        }
        else{
            res.send('You are not logged In');
        }
    
      } catch (error) {
        console.error(`Failed to log out user: ${error}`);
      }
}

const userExist = async(req, res)=>{
    let OrgMSP = req.body.org;
    let userId = req.body.userName;
    let org = commonUtils.getOrgNameFromMSP(OrgMSP);
    let ccp = getCCP(org)
    const caClient = caUtils.buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`);
    // setup the wallet to hold the credentials of the application user
    const wallet = await appUtils.buildWallet(Wallets, walletPath);

    const result=await caUtils.userExist(wallet,userId);
   
   res.status(200).json({
    result: result
   })
}



export default {
    registerUser,
    userExist,
    loginUser,
    logout
}
