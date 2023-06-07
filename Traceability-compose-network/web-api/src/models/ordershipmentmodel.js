import mongoose from 'mongoose';
const OrderShipmentSchema = new mongoose.Schema({
  purchaseOrderId: {
    type: String,
    required: true
  },
  batchId: {
    type: String,
    required: true
  },
  batchUnitPrice: {
    type: Number,
    required: true
  },
  shipStartLocation: {
    type: String,
    required: true
  },
  shipEndLocation: {
    type: String,
    required: true
  },
  estDeliveryDateTime: {
    type: Date,
    required: true
  },
  gpsCoordinates: {
    type: String
  },
  notes: {
    type: String
  },
  status: {
    type: String
  },
  weighbridgeSlipImage: {
    type: String
  },
  weighbridgeSlipNumber: {
    type: String
  },
  weighbridgeDate: {
    type: Date
  },
  tbwImage: {
    type: String
  },
  vehicleType: {
    type: String
  },
  vehicleNumber: {
    type: String
  },
  vehicleImage: {
    type: String
  },
  vehicleColor: {
    type: String
  }
});

  
const OrderShipmentModel = mongoose.model('mychannel_basic_order_shipment', OrderShipmentSchema);
export default OrderShipmentModel;