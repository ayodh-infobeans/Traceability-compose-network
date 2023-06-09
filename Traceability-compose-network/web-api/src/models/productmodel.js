import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  // Define your schema fields here
  productId: {
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
  productName: {
    type: String,
    required: true
  },
  productDescription: {
    type: String
  },
  productCategory: {
    type: String,
    required: true
  },
  productManufacturingLocation: {
    type: String,
    required: true
  },
  productQuantity: {
    type: Number,
    required: true
  },
  productManufacturingPrice: {
    type: Number,
    required: true
  },
  productManufacturingDate: {
    type: Date,
    required: true
  },
  productExpiryDate: {
    type: Date,
    required: true
  },
  productIngredients: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  productSKU: {
    type: String
  },
  productGTIN: {
    type: String
  },
  productNotes: {
    type: String
  },
  productStatus: {
    type: String
  },
  productImage: {
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
