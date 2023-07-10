import mongoose from 'mongoose';

const RawSchema = new mongoose.Schema({
  // Define your schema fields here
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  productionDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  specifications: {
    type: String,
    required: true
  },
  cultivationMethod: {
    type: String,
    required: true
  },
  fertilizers: {
    type: String,
    required: true
  },
  status: {
    type: String
  },
  image: {
    type: String,
    required: false
  },
  owner: {
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

