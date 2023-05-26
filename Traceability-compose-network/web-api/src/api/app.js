import express from 'express';
import bodyparser from 'body-parser';
import rawMaterialRoutes from './routes/rawMaterial.route.js';
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import morgan from 'morgan';
import cors from 'cors';
import expressJWT from 'express-jwt';
import jwt from 'jsonwebtoken';
import bearerToken from 'express-bearer-token';
import log4js from 'log4js';
import mongoose from 'mongoose';
import util from 'util';
const logger = log4js.getLogger('TraceabilityNetwork');

const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(bodyparser.json());

app.use(bearerToken());

app.use((req, res, next) => {
  logger.debug('New req for %s', req?.originalUrl);
  if (req?.originalUrl.indexOf('/user') >= 0 || req?.originalUrl.indexOf('/user/login') >= 0 || req?.originalUrl.indexOf('/user/register') >= 0) {
      return next();
  }
  var token = req.token;
  jwt.verify(token,'thisismysecret', (err, decoded) => {
      if (err) {
          console.log(`Error ================:${err}`)
          res.send({
              success: false,
              message: 'Failed to authenticate token. Make sure to include the ' +
                  'token returned from /users call in the authorization header ' +
                  ' as a Bearer token'
          });
          return;
      } else {
          req.userName = decoded.userName;
          req.OrgMSP = decoded.OrgMSP;
          logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.userName, decoded.OrgMSP));
          return next();
      }
  });
});

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
app.use('/products', productRoutes);
app.use('/rawMaterials', rawMaterialRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

