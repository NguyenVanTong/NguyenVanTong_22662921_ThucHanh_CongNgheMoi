const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const productController = require('../controllers/productController');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'public', 'upload');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname || '').toLowerCase();
		const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
		cb(null, `${Date.now()}-${baseName}${ext}`);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype && file.mimetype.startsWith('image/')) {
		return cb(null, true);
	}
	cb(new Error('Chi cho phep upload file anh'));
};

const upload = multer({ storage, fileFilter });

router.get('/', productController.listProducts);
router.get('/new', productController.showCreateForm);
router.post('/', upload.single('image'), productController.createProduct);
router.get('/:id', productController.showDetail);
router.get('/:id/edit', productController.showEditForm);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
