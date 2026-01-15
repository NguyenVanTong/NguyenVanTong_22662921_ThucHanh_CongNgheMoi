// Product Model - Data Access Layer
const db = require('../db/mysql');

class Product {
    // Get all products
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
        return rows;
    }

    // Get product by ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    // Create new product
    static async create(name, price, quantity) {
        const [result] = await db.query(
            'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)',
            [name, parseFloat(price), parseInt(quantity)]
        );
        return result.insertId;
    }

    // Update product
    static async update(id, name, price, quantity) {
        const [result] = await db.query(
            'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?',
            [name, parseFloat(price), parseInt(quantity), parseInt(id)]
        );
        return result.affectedRows;
    }

    // Delete product
    static async delete(id) {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Product;

