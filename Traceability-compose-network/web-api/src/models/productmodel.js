import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  // Define your schema fields here
  productId : String,
  manufacturerId: String,
  productBatchNo: String,
  productBatchManufacturingDate: String,
  productBatchExpiryDate: String,
  rawMaterialId: String,
  productName: String,
  productDescription: String,
  productCategory: String,
  productManufacturingLocation: String,
  productQuantity: Number,
  productManufacturingPrice: Number,
  productManufacturingDate: String,
  productExpiryDate: String,
  productIngredients: String,
  type: String,
  productSKU: String,
  productGTIN: String,
  productNotes: String,
  productStatus: String,
  productImage: String,

  org: String,
  userName: String,
  userType: String,
  channelName: String,
  chaincodeName: String
  // ...
});

const ProductModel = mongoose.model('mychannel_basic_', ProductSchema);


export default ProductModel;
