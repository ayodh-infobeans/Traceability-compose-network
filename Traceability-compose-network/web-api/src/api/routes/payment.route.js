import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import { verifyToken } from '../middleware/jwtAuthent.js';

const router = express.Router();


router.route('/makePayment').post(verifyToken,paymentController.makePayment);
router.route('/getTransactionById').get(verifyToken,paymentController.GetTransactionById);
router.route('/getAllTransactions').get(verifyToken,paymentController.GetAllTransactions);


// router.route('/orderShipment').post(orderController.OrderShipment);
// router.route('/confirmDeliverOrder').post(orderController.ConfirmDeliveredOrder);


router.get('/status', (req, res) => {
	res.json({
		message: 'OK',
		timestamp: new Date().toISOString(),
		IP: req.ip,
		URL: req.originalUrl,
	});
});

export default router;