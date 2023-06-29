import express from 'express';
import productController from '../controllers/product.controller.js';
import { verifyToken } from '../middleware/jwtAuthent.js';
const router = express.Router();

router.get('/',verifyToken,productController.GetAllProducts);
router.route('/create').post(verifyToken,productController.CreateProduct);
router.route('/update').post(verifyToken,productController.UpdateProduct);
router.route('/viewProduct').get(verifyToken,productController.GetProductById);
router.route('/remove').post(verifyToken,productController.DeleteProduct);
router.route('/checkAvailability').get(verifyToken,productController.CheckProductAvailability);
router.route('/confirmAvailability').post(verifyToken,productController.ConfirmProductAvailability);

router.get('/status', (req, res) => {
	res.json({
		message: 'OK',
		timestamp: new Date().toISOString(),
		IP: req.ip,
		URL: req.originalUrl,
	});
});

export default router;

// export default router;