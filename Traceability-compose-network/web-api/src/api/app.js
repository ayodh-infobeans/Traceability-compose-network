import express from 'express';
import bodyparser from 'body-parser';
import rawMaterialRoutes from './routes/rawMaterial.route.js';
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
// session.js
let session = null;

function getSession() {
  return session;
}

function setSession(newSession) {
  session = newSession;
}// console.log('#############', rawMaterialRoutes)

const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(bodyparser.json());

// Server

async function connectToMongoDB() {
  try {
    const connectionString = "mongodb://localhost:27017/test";
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB abcd');
    // Start your application or perform further operations
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Handle the error appropriately
  }
}
connectToMongoDB();

app.listen(4000, ()=> {
    console.log("server started");
});

// Routes
app.use('/rawMaterials', rawMaterialRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

export default{
    getSession,
    setSession
}
