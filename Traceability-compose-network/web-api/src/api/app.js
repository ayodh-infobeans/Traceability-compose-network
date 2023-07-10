import express from 'express';
import bodyparser from 'body-parser';
import { apiRoute } from './routes/index.js';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import bearerToken from 'express-bearer-token';
import {errorHandler,notFound} from './middleware/index.js'
const app = express();
dotenv.config();
const PORT = process.env.PORT || 4001;

app.use(morgan('combined'));
app.use(cors());
app.use(bodyparser.json());
app.use(bearerToken());
apiRoute(app);

/*======================================================
for handle error
======================================================*/
app.use(errorHandler);

/*======================================================
for undefined route
======================================================*/
app.use(notFound);


const start = async () => {
    try {
        // await connectDB(dbURL);
        app.listen(PORT, () => { console.log(`Server is working ${PORT}`) });
       
    } catch (error) {
        console.log("error " + error.message)
    }
}

start();


