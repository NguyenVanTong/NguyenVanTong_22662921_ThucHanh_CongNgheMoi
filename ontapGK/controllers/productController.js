const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ProductModel = require('../models/productModel');

function removeLocalUpload(imageUrl) {
	if (!imageUrl) {
		return;
	}

	const fileName = path.basename(imageUrl);
	const absolutePath = path.join(__dirname, '..', 'public', 'upload', fileName);

	if (fs.existsSync(absolutePath)) {
		fs.unlinkSync(absolutePath);
	}
}

exports.listProducts = async (req, res, next) => {
	try {
		const products = await ProductModel.getAll();
		products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		res.render('products/index', { products });
	} catch (error) {
		next(error);
	}
};

exports.showCreateForm = (req, res) => {
	res.render('products/create');
};

exports.createProduct = async (req, res, next) => {
	try {
		const { name, price, description } = req.body;
		const now = new Date().toISOString();
		const imageUrl = req.file ? `/upload/${req.file.filename}` : '';

		const product = {
			id: uuidv4(),
			name: (name || '').trim(),
			price: Number(price) || 0,
			description: (description || '').trim(),
			imageUrl,
			createdAt: now,
			updatedAt: now,
		};

		await ProductModel.create(product);
		res.redirect('/products');
	} catch (error) {
		next(error);
	}
};

exports.showEditForm = async (req, res, next) => {
	try {
		const product = await ProductModel.getById(req.params.id);
		if (!product) {
			return res.status(404).send('Khong tim thay san pham');
		}

		res.render('products/edit', { product });
	} catch (error) {
		next(error);
	}
};

exports.updateProduct = async (req, res, next) => {
	try {
		const { id } = req.params;
		const existing = await ProductModel.getById(id);

		if (!existing) {
			return res.status(404).send('Khong tim thay san pham');
		}

		const { name, price, description } = req.body;
		const payload = {
			name: (name || '').trim(),
			price: Number(price) || 0,
			description: (description || '').trim(),
			updatedAt: new Date().toISOString(),
		};

		if (req.file) {
			payload.imageUrl = `/upload/${req.file.filename}`;
			removeLocalUpload(existing.imageUrl);
		}

		await ProductModel.update(id, payload);
		res.redirect('/products');
	} catch (error) {
		next(error);
	}
};

exports.deleteProduct = async (req, res, next) => {
	try {
		const deleted = await ProductModel.delete(req.params.id);
		if (!deleted) {
			return res.status(404).send('Khong tim thay san pham');
		}

		removeLocalUpload(deleted.imageUrl);
		res.redirect('/products');
	} catch (error) {
		next(error);
	}
};

exports.showDetail = async (req, res, next) => {
	try {
		const product = await ProductModel.getById(req.params.id);
		if (!product) {
			return res.status(404).send('Khong tim thay san pham');
		}

		res.render('products/detail', { product });
	} catch (error) {
		next(error);
	}
};
