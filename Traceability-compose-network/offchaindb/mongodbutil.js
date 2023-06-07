'use strict';
import mongoose from 'mongoose';
import RawModel from './models/rawmodel.js';
import ProductModel from './models/productmodel.js';
import HistoryModel from './models/historymodel.js';
import PurchaseOrderModel from './models/purchaseordermodel.js';
import PackageDetailModel from './models/packagedetailmodel.js';
import BatchModel from './models/batchmodel.js';
import OrderShipmentModel from './models/ordershipmentmodel.js';
import PaymentModel from './models/paymentmodel.js';
// import OrderInspectionModel from '../../models/purchaseorderinspectionmodel.js';


export default {
  writeToMongoDB: async function(uri, model, key, value) {
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

      if (model===RawModel){
          var ID ="rawID";
      } 
      if (model===ProductModel){
         var ID = "productId";
      }
      if (model===PurchaseOrderModel){
        var ID = "poNumber";
      }
      if (model===PackageDetailModel){
        var ID = "packageId";
      }
      if (model===BatchModel){
        var ID = "batchId";
      }
      if (model===OrderShipmentModel){
        var ID = "purchaseOrderId";
      }
      if (model===HistoryModel){
         var ID = "key";
      }
      if (model===PaymentModel){
        var ID = "paymentRefrenceNumber";
     }
    
      const existingRecord = await model.findOne({[ID]: key });
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

  deleteRecord: async function(uri, model, key) {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      
      if (model===RawModel){
        var ID ="rawID";
      } 
      if (model===ProductModel){
        var ID = "productId";
      }
      if (model===HistoryModel){
        var ID = "key";
      }
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



