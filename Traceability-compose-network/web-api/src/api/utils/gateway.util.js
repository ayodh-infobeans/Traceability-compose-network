import pkg from 'fabric-network';
const { Gateway, Wallets } = pkg;
import fs from 'fs';
import path from 'path';
import constants from '../../config.constants.js';

const connectToGateway = async (ccp, userName,userIdentity, wallet) =>{
    let gateway = new Gateway();
    console.log("================================= Gateway "+ ccp.toString());
    await gateway.connect(ccp, {wallet, identity: userIdentity, discovery: {enabled: true, asLocalhost: true}});
    console.log("============================= gateway close", gateway);
    const session = {
        userName,
        gateway,
    };
    return session;
}

export default{
    connectToGateway
}