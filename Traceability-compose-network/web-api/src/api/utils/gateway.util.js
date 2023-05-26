import pkg from 'fabric-network';
const { Gateway, Wallets } = pkg;
import constants from '../../config.constants.js';
import appUtils from '../../config/AppUtils.js';
import buildCCP from '../../config/buildCCP.js';

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

export default{
    connectToGateway
}