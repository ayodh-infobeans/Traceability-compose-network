import mongoose from 'mongoose';

const RawSchema = new mongoose.Schema({
  // Define your schema fields here
  rawID: String,
  rawMaterialName: String,
  rawMaterialCategory: String,
  rawMaterialLocation: String,
  rawMaterialQuantity: Number,
  rawMaterialPrice: Number,
  type: String,
  rawMaterialDescription: String,
  rawMaterialProductionDate: String,
  rawMaterialExpiryDate: String,
  rawMaterialSpecifications: String,
  rawMaterialCultivationMethod: String,
  rawMaterialFertilizers: String,
  rawMaterialStatus: String,
  rawMaterialImage: String,
  rawMaterialOwner: String,
  org: String,
  userName: String,
  userType: String,
  channelName: String,
  chaincodeName: String
  // ...
});

const RawModel = mongoose.model('mychannel_basic', RawSchema);


// module.exports = RawModel;
export default RawModel;


// "org":"Org1MSP",
//     "userName":"admin",
//     "userType":"orgUser",
//     "channelName": "mychannel",
//     "chaincodeName": "chaincode",

// "rawID": "raw1",
//             "rawMaterialName": "Tomato",
//             "rawMaterialCategory": "Vegetable",
//             "rawMaterialLocation": "Indore",
//             "rawMaterialQuantity": 22,
//             "rawMaterialPrice": 200,
//             "type": "rawMaterial",
//             "rawMaterialDescription": "Tomato",
//             "rawMaterialProductionDate": "2023-04-21",
//             "rawMaterialExpiryDate": "2023-09-01",
//             "rawMaterialSpecifications": "Data to be awaited",
//             "rawMaterialCultivationMethod": "Data to be awaited",
//             "rawMaterialFertilizers": "Data to be awaited",
//             "rawMaterialStatus": "In Stock",
//             "rawMaterialImage": "Tomato",
//             "rawMaterialOwner": "admin"