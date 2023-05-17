import pkg from 'fabric-network';
const { Gateway, Wallets } = pkg;
import fs from 'fs';
import path from 'path';
import constants from '../../config.constants.js';

const connectToGateway = async (ccp, userIdentity) =>{
    const walletpath = constants.GetWalletPath;
    let wallet = await Wallets.newFileSystemWallet(walletpath);
    console.log(`Wallet path: ${walletpath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userIdentity);
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
    const gateway = new Gateway();

    console.log("================================= Gateway "+ ccp.toString());
    await gateway.connect(ccp, {wallet, identity: userIdentity, discovery: {enabled: true, asLocalhost: true}});
    console.log("============================= gateway close", gateway);
    return gateway;
}

export default{
    connectToGateway
}