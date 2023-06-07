import pkg from 'fabric-network';
const { Gateway, Wallets } = pkg;
import constants from '../../config.constants.js';
import appUtils from '../../config/AppUtils.js';
import buildCCP from '../../config/buildCCP.js';
import mongoose from 'mongoose';

const connectToGateway = async (org, userName) =>{
    let ccp = buildCCP.getCCP(org);
    let walletPath = constants.GetWalletPath(org);
    let wallet = await appUtils.buildWallet(Wallets, walletPath);
    let userIdentity = await wallet.get(userName);
    console.log(userIdentity);
    let gateway = new Gateway();
    console.log("================================= Gateway "+ ccp.toString());
    await gateway.connect(ccp, {wallet, identity: userIdentity, discovery: {enabled: true, asLocalhost: true}});
    console.log("============================= gateway close", gateway);
    
    return gateway;
}

const connectToMongoDB = async (org) =>{
    try {
      let port = buildCCP.getMongoDetails(org).mongoPort;
      let username = buildCCP.getMongoDetails(org).username;
      let password = buildCCP.getMongoDetails(org).password;
      console.log(username);
      console.log(password);
      const connectionString = `mongodb://${username}:${password}@localhost:${port}/?authMechanism=DEFAULT`;
      console.log(connectionString);
      await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB abcd');
      return mongoose;
      // Start your application or perform further operations
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      // Handle the error appropriately
    }
}

export default{
    connectToGateway,
    connectToMongoDB
}