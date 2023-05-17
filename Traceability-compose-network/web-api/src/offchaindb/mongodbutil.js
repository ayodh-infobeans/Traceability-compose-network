
'use strict';
import { MongoClient } from 'mongodb';
// const { MongoClient } = require('mongodb');

export default {
  writeToMongoDB: async function(uri, dbName, key, value) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(dbName);
  
      // Check if the database exists
    //   const dbList = await client.db().admin().listDatabases();
    //   const dbExists = dbList.databases.some((dbItem) => dbItem.name === dbName);
  
    //   if (!dbExists) {
    //     // If the database doesn't exist, create it
    //     await db.createCollection('genericCollectionName'); // Replace 'genericCollectionName' with your desired collection name
    //   }
  
      const collectionName = dbName; // Use the lowercased database name as the collection name
      const collection = db.collection(collectionName);
  
      if (key) {
        // If a key is specified, attempt to find the record by key
        const existingRecord = await collection.findOne({ _id: key });
  
        if (existingRecord) {
          // If the record exists, update it
          value._id = key;
          await collection.replaceOne({ _id: key }, value);
        } else {
          // If the record doesn't exist, insert it
          await collection.insertOne(value);
        }
      } else {
        // If no key is specified, insert the value as a new document
        await collection.insertOne(value);
      }
  
      return true;
    } catch (error) {
      console.error('Error writing to MongoDB:', error);
      throw error;
    } finally {
      await client.close();
    }
  },

  deleteRecord: async function(uri, dbName, key) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collectionName = dbName;
      const collection = db.collection(collectionName);
  
      const existingRecord = await collection.findOne({ _id: key });
  
      if (existingRecord) {
        const revision = existingRecord._rev;
        await collection.deleteOne({ _id: key, _rev: revision });
      }
  
      return true;
    } catch (error) {
      console.error('Error deleting record from MongoDB:', error);
      throw error;
    } finally {
      await client.close();
    }
  }
}; 


