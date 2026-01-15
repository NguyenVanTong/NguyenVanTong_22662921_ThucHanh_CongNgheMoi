// User Model - Data Access Layer
const db = require('../db/mysql');
const bcrypt = require('bcryptjs');

class User {
    // Get all users
    static async getAll() {
        const [rows] = await db.query('SELECT id, username, email, created_at FROM users ORDER BY id DESC');
        return rows;
    }

    // Get user by ID
    static async getById(id) {
        const [rows] = await db.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    // Get user by username
    static async getByUsername(username) {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    // Get user by email
    static async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    // Create new user
    static async create(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users(username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        return result.insertId;
    }

    // Update user
    static async update(id, username, email, password = null) {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await db.query(
                'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
                [username, email, hashedPassword, parseInt(id)]
            );
            return result.affectedRows;
        } else {
            const [result] = await db.query(
                'UPDATE users SET username = ?, email = ? WHERE id = ?',
                [username, email, parseInt(id)]
            );
            return result.affectedRows;
        }
    }

    // Delete user
    static async delete(id) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;

