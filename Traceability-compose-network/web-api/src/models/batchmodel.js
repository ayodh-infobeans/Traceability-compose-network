import mongoose from 'mongoose';
const BatchSchema = new mongoose.Schema({
    batchId: {
      type: String,
      required: true
    },
    assetId: {
      type: String,
      required: true
    },
    packageInBatch: {
      type: Number,
      required: false
    },
    totalQuantity: {
      type: Number,
      required: false
    },
    carrierInfo: {
      type: String
    },
    poNumber: {
      type: String
    },
    transportMode: {
      type: String
    },
    startLocation: {
      type: String
    },
    endLocation: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  });
  
  const BatchModel = mongoose.model('mychannel_basic_batch', BatchSchema);
  export default BatchModel;