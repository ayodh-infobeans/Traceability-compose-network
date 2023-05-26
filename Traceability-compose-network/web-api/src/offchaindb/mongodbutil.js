'use strict';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import RawModel from '../models/rawmodel.js';
import ProductModel from '../models/productmodel.js';

export default {
  writeToMongoDB: async function(uri, dbName, key, value) {
    try {
      // mongoose.connect(uri);
    
      // const collectionName = dbName.toLowerCase(); // Use the lowercased database name as the collection name
      // const collection = mongoose.connection.collection(collectionName);

      Model=RawModel;
      Model=ProductModel;
      
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
      const existingRecord = await RawModel.findOne({ rawID: key });
      if (existingRecord) {
          // await RawModel.replaceOne({rawID: key }, value);
          await RawModel.updateOne({rawID: key }, value)
            .then(result => {
              console.log('Document updated:', result);
            })
            .catch(error => {
              console.error('Error updating document:', error);
            });

      } else {
          // If the record doesn't exist, insert it
          // await RawModel.insertOne(value);
          await RawModel.create(value)
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

  deleteRecord: async function(uri, dbName, key) {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      const existingRecord = await RawModel.findOne({ rawID: key });
      if (existingRecord) {
        await RawModel.deleteOne({ rawID: key });
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


// // Perform any cleanup tasks before server shutdown
// const cleanupTasks = async () => {
//   try {
//     // Delete data from the MongoDB collection
//     await RawModel.deleteMany();

//     // Close the Mongoose connection
//     await mongoose.connection.close();

//     console.log('Cleanup tasks completed. Server closed.');
//     process.exit(0); // Exit the server process
//   } catch (error) {
//     console.error('Error during cleanup:', error);
//     process.exit(1); // Exit the server process with an error code
//   }
// };

// // Listen for the 'SIGINT' signal
// process.on('SIGINT', cleanupTasks);


