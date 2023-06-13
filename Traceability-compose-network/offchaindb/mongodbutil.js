'use strict';
import mongoose from 'mongoose';

var modelToID = {
  RawModel: "rawID",
  ProductModel: "productId",
  PurchaseOrderModel: "poNumber",
  PackageDetailModel: "packageId",
  BatchModel: "batchId",
  OrderShipmentModel: "purchaseOrderId",
  HistoryModel: "key",
  PaymentModel: "paymentRefrenceNumber"
};

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

      var ID = modelToID[model];
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
      
      var ID = modelToID[model];
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

