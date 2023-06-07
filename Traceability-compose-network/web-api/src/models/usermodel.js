import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId:{
    type:String,
    unique:true,
    required:true
  },
  userName:String,
  userEmail:{
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  userContact:{
    type: String,
    required: true,
    unique:false,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: 'Contact number must be a 10-digit number.',
    },
  },
  userAddress:String,
  orgMSP:{
    type:String,
    required:true
  },
  userType:{
    type:String,
    required:true
  }
});

const UserModel = mongoose.model('user_details', UserSchema);

export default UserModel;

