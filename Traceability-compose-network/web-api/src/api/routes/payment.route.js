import express from 'express';
import paymentController from '../controllers/payment.controller.js';

const router = express.Router();


router.route('/makePayment').post(paymentController.makePayment);
router.route('/getTransactionById').get(paymentController.GetTransactionById);
router.route('/getAllTransactions').get(paymentController.GetAllTransactions);

export default router;