import fabricNetwork from 'fabric-network';
const { Wallets } = fabricNetwork;
import FabricCAServices  from 'fabric-ca-client';
// const { FabricCAServices } = fabricCaClient;
import caUtils from '../../config/CAUtils.js';
import appUtils from '../../config/AppUtils.js';
import buildCCP from '../../config/buildCCP.js';
import path from 'path';
import pkg from 'fabric-common';
const { Utils: utils } = pkg;
import constants from '../../config.constants.js';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let config=utils.getConfig()
// config.file(path.resolve(__dirname,'config.json'))
let walletPath = constants.GetWalletPath;

const registerUser = async (req, res) => {
    // Number(OrgMSP.match(/\d/g).join(""))
    let OrgMSP = req.body.org;
    let userId = req.body.userName;
    let substringToRemove = 'MSP';
    let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
    let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1);
    let ccp = buildCCP.getCCP(org);
    // console.log("==============================", fabricCaClient);
    const caClient = caUtils.buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`);

    // setup the wallet to hold the credentials of the application user
    const wallet = await appUtils.buildWallet(Wallets, walletPath);

    console.log("wallet ", wallet)
    // in a real application this would be done on an administrative flow, and only once
    await caUtils.enrollAdmin(caClient, wallet, OrgMSP);

    // in a real application this would be done only when a new user was required to be added
    // and would be part of an administrative flow
    await caUtils.registerAndEnrollUser(caClient, wallet, OrgMSP, userId, `${org}.department1`);

    res.status(200).json({
        message: 'User registered successfully',
        Wallet: wallet
    });
}

const userExist = async(req, res)=>{
    let OrgMSP = req.body.org;
    let userId = req.body.userName;
    let substringToRemove = 'MSP';
    let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
    let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1);
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
    userExist
}