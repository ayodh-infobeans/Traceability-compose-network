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
  
});

const RawModel = mongoose.model('mychannel_basic', RawSchema);


// module.exports = RawModel;
export default RawModel;

