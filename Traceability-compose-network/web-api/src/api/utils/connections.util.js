import pkg from 'fabric-network';
const { Gateway, Wallets } = pkg;
import constants from '../../config.constants.js';
import appUtils from '../../config/AppUtils.js';
import buildCCP from '../../config/buildCCP.js';
import mongoose from 'mongoose';
import commonUtils from './common.util.js';

const connectToGateway = async (org, userName) =>{
    let ccp = buildCCP.getCCP(org);
    let walletPath = constants.GetWalletPath(org);
    let wallet = await appUtils.buildWallet(Wallets, walletPath);
    let userIdentity = await wallet.get(userName);
    let gateway = new Gateway();
    await gateway.connect(ccp, {wallet, identity: userIdentity, discovery: {enabled: true, asLocalhost: true}});
    return gateway;
}

const connectToMongoDB = async (org) =>{
    try {
      let port = buildCCP.getMongoDetails(org).mongoPort;
      let username = buildCCP.getMongoDetails(org).username;
      let password = buildCCP.getMongoDetails(org).password;
      const connectionString = `mongodb://${username}:${password}@localhost:${port}/?authMechanism=DEFAULT`;
      await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      return mongoose;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
}

const connectToFabricNetwork = async (userName, orgMSP ,channelName, chaincodeName) =>{
  try{
    let org = commonUtils.getOrgNameFromMSP(orgMSP);
    let gateway = await connectToGateway(org, userName);
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    return { status: true, gateway, contract, org};
  }
  catch(error){
    return {status: false, error: error};
  }
}

export default{
    connectToGateway,
    connectToMongoDB,
    connectToFabricNetwork
}