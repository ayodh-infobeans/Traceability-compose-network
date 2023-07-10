import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import { verifyToken } from '../middleware/jwtAuthent.js';

const router = express.Router();


router.route('/makePayment').post(verifyToken,paymentController.makePayment);
router.route('/getTransactionById').get(verifyToken,paymentController.GetTransactionById);
router.route('/getAllTransactions').get(verifyToken,paymentController.GetAllTransactions);

export default router;