import mongoose from 'mongoose';

const PackageDetailSchema = new mongoose.Schema({
    packageId: {
      type: String,
      required: true
    },
    assetId:{
      type: String,
      required: true
    },
    packageDimensions: {
      type: String,
      required: false
    },
    packageWeight: {
      type: Number,
      required: false
    },
    assetId: {
      type: String,
      required: false
    },
    assetFragility: {
      type: String
    },
    barCode: {
      type: String
    }
  });
  
  const PackageDetailModel = mongoose.model('mychannel_basic_package_detail', PackageDetailSchema);
  export default PackageDetailModel;