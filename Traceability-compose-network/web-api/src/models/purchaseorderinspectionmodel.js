import mongoose from 'mongoose';
const PurchaseOrderInspectionSchema = new mongoose.Schema({
    batchID: {
      type: String,
      required: true
    },
    serialNumber: {
      type: String,
      required: true
    },
    estDeliveryDateTime: {
      type: Date,
      required: true
    },
    productIdentificationNumber: {
      type: String
    },
    description: {
      type: String
    },
    totalQuantity: {
      type: Number,
      required: true
    },
    damageQuantity: {
      type: Number
    },
    defectQuantity: {
      type: Number
    },
    goodQuantity: {
      type: Number
    },
    packageSize: {
      type: String
    },
    packageColor: {
      type: String
    },
    packageName: {
      type: String
    },
    rate: {
      type: Number
    },
    amount: {
      type: Number
    },
    deliveryDateTime: {
      type: Date
    },
    compliance: {
      type: String
    },
    pwImage: {
      type: String
    },
    remark: {
      type: String
    },
    supplierName: {
      type: String
    },
    supplierAddress: {
      type: String
    },
    supplierContactNumber: {
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
  
  const OrderInspectionModel = mongoose.model('mychannel_basic_po_inspection', PurchaseOrderInspectionSchema);
  export default OrderInspectionModel;