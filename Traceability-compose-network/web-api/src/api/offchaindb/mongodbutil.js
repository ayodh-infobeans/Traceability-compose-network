'use strict';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


import RawModel from './../../models/rawmodel.js';
import ProductModel from './../../models/productmodel.js';
import HistoryModel from './../../models/historymodel.js';
import PurchaseOrderModel from './../../models/purchaseordermodel.js';
import PackageDetailModel from './../../models/packagedetailmodel.js';
import BatchModel from './../../models/batchmodel.js';
import OrderShipmentModel from './../../models/ordershipmentmodel.js';
import PaymentModel from './../../models/paymentmodel.js';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPathi = path.resolve(__dirname, 'config.json');
const configData = fs.readFileSync(configPathi, 'utf-8');
const config = JSON.parse(configData);
const modelToID =config.modelToID;

const modelToModel = {

  "RawModel": RawModel,
  "ProductModel":  ProductModel,
  "PurchaseOrderModel": PurchaseOrderModel,
  "PackageDetailModel": PackageDetailModel,
  "BatchModel": BatchModel,
  "OrderShipmentModel":OrderShipmentModel,
  "HistoryModel": HistoryModel,
  "PaymentModel": PaymentModel

}

// const modelToID = {
//   "RawModel": "rawID",
//   "ProductModel": "productId",
//   "PurchaseOrderModel": "poNumber",
//   "PackageDetailModel": "packageId",
//   "BatchModel": "batchId",
//   "OrderShipmentModel": "purchaseOrderId",
//   "HistoryModel": "key",
//   "PaymentModel": "paymentRefrenceNumber"
// };



// const getID = (model) => {
//   let ID;
//   switch (model) {
//       case 'org1':
//           ccp = appUtils.buildCCPOrg1();
//           break;
//       case 'org2':
//           ccp = appUtils.buildCCPOrg2();
//           break;
//       case 'org3':
//           ccp = appUtils.buildCCPOrg3();
//           break;
//   }
//   return ID;
// }



export default {
  writeToMongoDB: async function(uri, modelStr, key, value) {
    try {

      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
        .then(() => {
          console.log('Connected to MongoDB');
          
        })
        .catch((error) => {
          console.error('Connection error:', error);
        });
      
      let ID = modelToID[modelStr];
      let model =  modelToModel[modelStr]
      console.log("ID ==",ID);
      console.log("key ==",key);
      console.log("model ==",model);

      const existingRecord = await model.findOne({[ID]: key });
      console.log("existingRecord ==",existingRecord);
     
      if (existingRecord) {
          // await RaBatchModelwModel.replaceOne({rawID: key }, value);
          console.log("at update product");
          await model.updateOne({[ID]: key }, value)
            .then(result => {
              console.log('Document updated:', result);
            })
            .catch(error => {
              console.error('Error updating document:', error);
            });

      } else {
          // If the record doesn't exist, insert it
          // await RawModel.insertOne(value);
          await model.create(value)
          .then(createdDocument => {
            console.log('Document created:', createdDocument);
          })
          .catch(error => {
            console.error('Error creating document:', error);
          });
      }

      return true;
    } catch (error) {
      console.error('Error writing to MongoDB:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  },

  deleteRecord: async function(uri, modelStr, key) {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      
      let ID = modelToID[modelStr];
      let model =  modelToModel[modelStr];
      const existingRecord = await model.findOne({ [ID]: key });
      if (existingRecord) {
        await model.deleteOne({ [ID]: key });
      }
      return true;
    } catch (error) {
      console.error('Error deleting record from MongoDB:', error);
      throw error;
    } finally {
      mongoose.connection.close();
    }
  }

};



