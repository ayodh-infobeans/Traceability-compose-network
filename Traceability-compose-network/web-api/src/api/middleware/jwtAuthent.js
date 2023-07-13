
import jwt from "jsonwebtoken";
import log4js from 'log4js';
import util from 'util';
import dotenv from 'dotenv';
dotenv.config();
import { createCustomeError } from "./../error/CustomeError.js";

const SECRET_TOKEN = process.env.SECRET_TOKEN;
const logger = log4js.getLogger('TraceabilityNetwork');
export const verifyToken = (req, res, next) => {
    
    const token = req.token;
    if (token) {
        // verifies secret and checks exp
        console.log("Token ==",token);
        console.log("SECRET_TOKEN ==",SECRET_TOKEN);
        jwt.verify(token, SECRET_TOKEN, (err, decoded) => {
            
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
    } else {
        return next(createCustomeError("Forbidden access apply token", 403));
    }
}


