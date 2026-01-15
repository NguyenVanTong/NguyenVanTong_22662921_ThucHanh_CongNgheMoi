const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

// Home
router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM products');
    res.render('products', { products: rows });
});

// Add product
router.post('/add', async (req, res) => {
    const { name, price, quantity } = req.body;
    await db.query(
        'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)',
        [name, price, quantity]
    );
    res.redirect('/');
});

//delete product
router.post('/delete', async (req, res) => {
    const { id } = req.body;

    try {
        await db.query(
            'DELETE FROM products WHERE id = ?',
            [id]
        );

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Delete failed');
    }
});

//update product
router.post('/update/:id', async (req, res) => {
    const { id } = req.body;
    await db.query(
        'UPDATE products\n' +
        'SET name = ?, price = ?, quantity = ?\n' +
        'WHERE id = ?\n',
        [id, name, price, quantity]
    );
    res.redirect('/');
});


module.exports = router;
