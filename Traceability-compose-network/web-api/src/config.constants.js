import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GetWalletPath = (org) =>{
    let walletPath = null
    org == 'org1' ? walletPath = path.join(__dirname, 'org1-wallet') : null
    org == 'org2' ? walletPath = path.join(__dirname, 'org2-wallet') : null
    // org == 'wholesaler' ? walletPath = path.join(__dirname, 'wholesaler-wallet') : null
    // org == 'retailer' ? walletPath = path.join(__dirname, 'retailer-wallet') : null
    return walletPath
}

const ConnectionProfilePath = __dirname;

export default {
    GetWalletPath,
    ConnectionProfilePath
}