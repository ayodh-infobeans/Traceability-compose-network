import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: true
  },
  paymentReferenceNumber: {
    type: String,
    required: true
  },
  vendorName: {
    type: String,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  invoiceAmount: {
    type: Number,
    required: true
  },
  paymentAmount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Due', 'Paid', 'Overdue'],
    required: true
  },
  notes: {
    type: String,
    required: true
  }
});

const PaymentModel = mongoose.model('mychannel_basic_Payment', PaymentSchema);

export default PaymentModel;
