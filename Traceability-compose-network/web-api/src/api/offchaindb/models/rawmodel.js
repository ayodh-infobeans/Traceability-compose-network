import mongoose from 'mongoose';

const RawSchema = new mongoose.Schema({
  // Define your schema fields here
  rawID: {
    type: String,
    required: true
  },
  rawMaterialName: {
    type: String,
    required: true
  },
  rawMaterialCategory: {
    type: String,
    required: true
  },
  rawMaterialLocation: {
    type: String,
    required: true
  },
  rawMaterialQuantity: {
    type: Number,
    required: true
  },
  rawMaterialPrice: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  rawMaterialDescription: {
    type: String
  },
  rawMaterialProductionDate: {
    type: Date,
    required: true
  },
  rawMaterialExpiryDate: {
    type: Date,
    required: true
  },
  rawMaterialSpecifications: {
    type: String,
    required: true
  },
  rawMaterialCultivationMethod: {
    type: String,
    required: true
  },
  rawMaterialFertilizers: {
    type: String,
    required: true
  },
  rawMaterialStatus: {
    type: String
  },
  rawMaterialImage: {
    type: String
  },
  rawMaterialOwner: {
    type: String,
    required: true
  },
  org: {
    type: String
  },
  userName: {
    type: String
  },
  userType: {
    type: String
  },
  channelName: {
    type: String
  },
  chaincodeName: {
    type: String
  }
  
});

const RawModel = mongoose.model('mychannel_basic_raws', RawSchema);


// module.exports = RawModel;
export default RawModel;

