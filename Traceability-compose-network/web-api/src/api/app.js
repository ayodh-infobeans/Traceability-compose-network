import express from 'express';
import bodyparser from 'body-parser';
import rawMaterialRoutes from './routes/rawMaterial.route.js';
import userRoutes from './routes/user.route.js';
import morgan from 'morgan';
import cors from 'cors';

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
app.listen(4000, ()=> {
    console.log("server started");
});

// Routes
app.use('/rawMaterials', rawMaterialRoutes);
app.use('/user', userRoutes);

export default{
    getSession,
    setSession
}