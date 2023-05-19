import express from 'express';
import productController from '../controllers/product.controller.js';

const router = express.Router();

router.route('/init').post(productController.InitProducts);
router.get('/',productController.GetAllProducts);
router.route('/create').post(productController.CreateProduct);
router.route('/update').post(productController.UpdateProduct);
router.route('/viewproduct').get(productController.GetProductById);
router.route('/remove').post(productController.DeleteProduct);
router.route('/checkAvailability').get(productController.checkProductAvailability);

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