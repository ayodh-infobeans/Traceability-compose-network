import mongoose from 'mongoose';
const BatchSchema = new mongoose.Schema({
    batchId: {
      type: String,
      required: true
    },
    rawProductId: {
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
    }
  });
  
  const BatchModel = mongoose.model('mychannel_basic_batch', BatchSchema);
  export default BatchModel;