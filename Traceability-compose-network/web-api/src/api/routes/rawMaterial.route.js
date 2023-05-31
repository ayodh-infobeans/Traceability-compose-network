import express from 'express';
import rawMaterialController from '../controllers/rawMaterial.controller.js';

const router = express.Router();

router.get('/',rawMaterialController.GetAllRawMaterial);
router.route('/create').post(rawMaterialController.CreateRawMaterial);
router.route('/update').post(rawMaterialController.UpdateRawMaterial);
router.route('/viewRawMaterial').get(rawMaterialController.GetRawMaterialById);
router.route('/remove').post(rawMaterialController.DeleteRawMaterial);
router.route('/checkAvailability').get(rawMaterialController.CheckRawMaterialAvailability);

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