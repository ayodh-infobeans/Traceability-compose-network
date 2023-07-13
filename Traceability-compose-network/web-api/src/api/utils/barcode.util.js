import bwipjs from 'bwip-js';


const generateBarcode = async(assetDetails = null, callback) =>{
  // Set the barcode options
  const options = {
    bcid: 'code128', // Barcode type
    text: JSON.stringify(assetDetails), // Text to encode
    scale: 2, // Scaling factor
    height: 15, // Barcode height, in millimeters
    includetext: true, // Include the text below the barcode
    textxalign: 'center', // Text horizontal alignment
  };

  // Generate the barcode image using bwip-js
  bwipjs.toBuffer(options, function (err, png) {
    if (err) {
      // Handle the error
      console.error(err);
      return;
    }
    // Pass the generated barcode image buffer to the callback function
    callback(png);
  });
}

export default{
    generateBarcode
}