import express from 'express';
import rawMaterialController from '../controllers/rawMaterial.controller.js';
import { verifyToken } from '../middleware/jwtAuthent.js';
import upload from '../storage/multerIndex.js';

const router = express.Router();

router.get('/',verifyToken ,rawMaterialController.GetAllRawMaterial);
router.route('/create').post(verifyToken ,upload.single('data[productImage]'),rawMaterialController.CreateRawMaterial);
router.route('/update').post(verifyToken ,upload.single('data[productImage]'),rawMaterialController.UpdateRawMaterial);
router.route('/viewRawMaterial').get(verifyToken ,rawMaterialController.GetRawMaterialById);
router.route('/remove').post(verifyToken ,rawMaterialController.DeleteRawMaterial);
router.route('/checkAvailability').get(verifyToken ,rawMaterialController.CheckRawMaterialAvailability);
router.route('/confirmAvailability').post(verifyToken ,rawMaterialController.ConfirmRawMaterialAvailability);

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