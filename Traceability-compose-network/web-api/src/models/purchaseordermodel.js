import mongoose from 'mongoose';

const PurchaseOrderSchema = new mongoose.Schema({
    poNumber: {
        type: String,
        required: true
      },
      sellerID: {
        type: String,
        required: true
      },
      fromCountry: {
        type: String,
        required: true
      },
      fromState: {
        type: String,
        required: true
      },
      fromCity: {
        type: String,
        required: true
      },
      toCountry: {
        type: String,
        required: true
      },
      toState: {
        type: String,
        required: true
      },
      toCity: {
        type: String,
        required: true
      },
      paymentTerms: {
        type: String
      },
      poDateTime: {
        type: Date,
        required: true
      },
      poStatus: {
        type: String,
        default: 'Pending'
      },
      productName: {
        type: String,
        required: true
      },
      productQuantity: {
        type: Number,
        required: true
      },
      unitProductCost: {
        type: Number,
        required: true
      },
      expDeliveryDateTime: {
        type: Date,
        required: true
      },
      contactPersonName: {
        type: String
        
      },
      contactPhoneNumber: {
        type: String
        
      },
      contactEmail: {
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

      
  const PurchaseOrderModel = mongoose.model('mychannel_basic_purchase_order', PurchaseOrderSchema);
  export default PurchaseOrderModel;


