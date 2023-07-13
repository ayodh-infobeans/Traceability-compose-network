import express from 'express';
import orderController from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/jwtAuthent.js';
import upload from '../storage/multerIndex.js';
const router = express.Router();


// Apply the verifyToken middleware to the routes
// router.route('/createPurchaseOrder').post(verifyToken, orderController.CreatePurchaseOrder);
// router.route('/insertPackageDetail').post(verifyToken, orderController.InsertPackageDetail);

router.route('/createPurchaseOrder').post(verifyToken, orderController.CreatePurchaseOrder);
router.route('/insertPackageDetail').post(verifyToken,orderController.InsertPackageDetail);
router.route('/createBatch').post(verifyToken,orderController.CreateBatch);

router.route('/orderShipment').post(verifyToken,upload.fields([{ name: 'data[weighbridgeSlipImage]', maxCount: 1 },
{ name: 'data[tbwImage]', maxCount: 1 },{ name: 'data[vehicleImage]', maxCount: 1 }]),orderController.OrderShipment);

router.route('/purchaseOrderInspection').post(verifyToken,orderController.PurchaseOrderInspection);
router.route('/confirmDeliverOrder').post(verifyToken,orderController.ConfirmDeliveredOrder);
router.route('/getkeyhistory').get(verifyToken,orderController.getKeyHistory);
router.route('/getSummary').get(verifyToken,orderController.getSummary);

router.get('/status', (req, res) => {
	res.json({
		message: 'OK',
		timestamp: new Date().toISOString(),
		IP: req.ip,
		URL: req.originalUrl,
	});
});

export default router;