import { CustomeAPIError } from '../error/CustomeError.js';
import log4js from 'log4js';

const logger = log4js.getLogger('TraceabilityNetwork');

export const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomeAPIError) {
        logger.log('error', new Error(err.message));
        return res.status(err.statusCode).json({ status: false, err: err.message })
    }
    else {
        logger.log('error', new Error(err.message));
        return res.status(500).json({ status: false, err: err.message })
    }
}