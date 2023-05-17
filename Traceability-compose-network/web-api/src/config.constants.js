import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GetWalletPath = path.join(__dirname+"/wallet");

const ConnectionProfilePath = __dirname;

export default {
    GetWalletPath,
    ConnectionProfilePath
}