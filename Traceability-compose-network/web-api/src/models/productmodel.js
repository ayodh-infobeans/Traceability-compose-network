import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  // Define your schema fields here
  id: {
    type: String,
    required: true
  },
  manufacturerId: {
    type: String,
    required: true
  },
  rawMaterialIds: {
    type: [String], 
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  manufacturingLocation: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  manufacturingPrice: {
    type: Number,
    required: true
  },
  manufacturingDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  temprature:{
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  SKU: {
    type: String
  },
  GTIN: {
    type: String
  },
  notes: {
    type: String
  },
  status: {
    type: String
  },
  image: {
    type: String
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

const ProductModel = mongoose.model('mychannel_basic_product', ProductSchema);


export default ProductModel;
