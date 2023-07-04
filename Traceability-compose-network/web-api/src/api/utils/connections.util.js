import pkg from 'fabric-network';
import mongoose from 'mongoose';

import constants from '../../config.constants.js';
import appUtils from '../../config/AppUtils.js';
import buildCCP from '../../config/buildCCP.js';
import commonUtils from './common.util.js';

const { Gateway, Wallets } = pkg;
const { getOrgNameFromMSP } = commonUtils;
const { GetWalletPath } = constants;
const { getCCP, getMongoDetails } = buildCCP;
const { buildWallet } = appUtils;

const connectToGateway = async (org = null, userName = null) =>{
    try{
      if(org){
        const ccp = getCCP(org);
        const walletPath = GetWalletPath(org);
        if(walletPath){
          const wallet = await buildWallet(Wallets, walletPath);
          if(wallet){
            const userIdentity = await wallet?.get(userName);
            const gateway = new Gateway();
            if(ccp && userIdentity){
              await gateway?.connect(ccp, {wallet, identity: userIdentity, discovery: {enabled: true, asLocalhost: true}});
              return { status: true, gateway };
            }
          }
        }
      }
      return {status: false, error: "Something went wrong. Please try again."}
    } catch(error){
      return { status: false, error: error };
    }
}

const connectToMongoDB = async (org = null) =>{
    try {
      if(org){
        const { mongoPort, username, password} = getMongoDetails(org);
        console.log(mongoPort,username,password);
        const connectionString = `mongodb://${username}:${password}@localhost:${mongoPort}/?authMechanism=DEFAULT`;
        console.log(connectionString);
        if(connectionString){
          console.log(connectionString);
          await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
          console.log("Mongodb connected");
          return { status: true, mongoose };
        }
      }
      return {status: false, error: "Something went wrong. Please try again."};
    } catch (error) {
      return { status: false, error: error };
    }
}

const connectToFabricNetwork = async (userName = null, orgMSP = null, channelName = null, chaincodeName = null) =>{
  try {
    const org = getOrgNameFromMSP(orgMSP);
    if(org) {
      const gatewayAccess = await connectToGateway(org, userName);
      if(gatewayAccess?.status) {
        const network = await gatewayAccess?.gateway?.getNetwork(channelName);
        if(network) {
          const contract = network?.getContract(chaincodeName);
          return { status: true, gateway: gatewayAccess?.gateway, contract, org, network};
        }
      }
    }

    return {status: false, error: "Something went wrong. Please try again."};
  } catch(error){
    return { status: false, error: error };
  }
}

export default{
    connectToGateway,
    connectToMongoDB,
    connectToFabricNetwork
}