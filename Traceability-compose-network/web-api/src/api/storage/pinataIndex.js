import pinataSDK from '@pinata/sdk';
import fs from 'fs';

const PINATA_API_KEY = '0e89b5c2d9f86cd4e777';
const PINATA_SECRET_API_KEY = '5c2fc272e85ac00cc1e70ea4d5a3bfc5fed8d92edbaf87e535fefd412dc881d7';

const uploadToPinata = async (filePath) => {
    try {
        
      const pinata = new pinataSDK(PINATA_API_KEY, PINATA_SECRET_API_KEY);

      const readableStreamForFile = fs.createReadStream(filePath);
  
      const options = {
        pinataMetadata: {
          name: 'File Name', // Provide a name for the file
        },
      };
  
      const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
      if(result) {
    
        console.log('File stored in IPFS via Pinata with CID:', result.IpfsHash);
  
        const data = result.IpfsHash;
  
        return data;
      }
     
    } catch (error) {
      console.error('Error uploading file to Pinata:', error);
    }
  };

  export default {
    uploadToPinata
}
