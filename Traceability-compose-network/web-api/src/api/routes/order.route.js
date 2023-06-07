import express from 'express';
import orderController from '../controllers/order.controller.js';

const router = express.Router();


router.route('/createPurchaseOrder').post(orderController.CreatePurchaseOrder);
router.route('/insertPackageDetail').post(orderController.InsertPackageDetail);
router.route('/createBatch').post(orderController.CreateBatch);
router.route('/orderShipment').post(orderController.OrderShipment);
router.route('/confirmDeliverOrder').post(orderController.ConfirmDeliveredOrder);


router.get('/status', (req, res) => {
	res.json({
		message: 'OK',
		timestamp: new Date().toISOString(),
		IP: req.ip,
		URL: req.originalUrl,
	});
});

export default router;