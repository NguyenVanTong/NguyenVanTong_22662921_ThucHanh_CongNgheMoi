// Product Controller - Business Logic Layer
const Product = require('../models/Product');

class ProductController {
    // Display all products
    static async index(req, res) {
        try {
            const products = await Product.getAll();
            res.render('products', {
                products: products,
                user: req.session.username
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).send('Error fetching products');
        }
    }

    // Show edit form
    static async edit(req, res) {
        try {
            const product = await Product.getById(req.params.id);
            const products = await Product.getAll();
            res.render('products', {
                products: products,
                editProduct: product,
                user: req.session.username
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).send('Error fetching product');
        }
    }

    // Create new product
    static async create(req, res) {
        try {
            const { name, price, quantity } = req.body;
            await Product.create(name, price, quantity);
            res.redirect('/products');
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).send('Error creating product');
        }
    }

    // Update product
    static async update(req, res) {
        try {
            const { id, name, price, quantity } = req.body;
            await Product.update(id, name, price, quantity);
            res.redirect('/products');
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).send('Error updating product');
        }
    }

    // Delete product
    static async delete(req, res) {
        try {
            const { id } = req.body;
            await Product.delete(id);
            res.redirect('/products');
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).send('Error deleting product');
        }
    }
}

module.exports = ProductController;

