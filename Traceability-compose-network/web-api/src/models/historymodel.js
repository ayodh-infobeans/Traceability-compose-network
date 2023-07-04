
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MySchema = new Schema({
  key: {
    type: String,
    required: true
  },
  is_delete: {
    type: Boolean,
    required: true
  },
  value: {
    type: {
      type: String,
      enum: ['Buffer'],
      required: false
    },
    data: {
      type: [Number],
      required: false
    }
  },
  timestamp: {
    type: Date,
    required: true
  },
  blocknumber: {
    type: Number,
    required: true
  },
  sequence: {
    type: Number,
    required: true
  }
});

const HistoryModel = mongoose.model('mychannel_basic_history', MySchema);


export default HistoryModel;