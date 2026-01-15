// User Controller - Business Logic Layer
const User = require('../models/User');

class UserController {
    // Show login form
    static showLogin(req, res) {
        res.render('login', { error: null });
    }

    // Show register form
    static showRegister(req, res) {
        res.render('register', { error: null });
    }

    // Process login
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            // Find user by username
            const user = await User.getByUsername(username);

            if (!user) {
                return res.render('login', { error: 'Invalid username or password' });
            }

            // Verify password
            const isValid = await User.verifyPassword(password, user.password);

            if (!isValid) {
                return res.render('login', { error: 'Invalid username or password' });
            }

            // Set session
            req.session.userId = user.id;
            req.session.username = user.username;

            res.redirect('/products');
        } catch (error) {
            console.error('Login error:', error);
            res.render('login', { error: 'Login failed. Please try again.' });
        }
    }

    // Process registration
    static async register(req, res) {
        try {
            const { username, email, password, confirmPassword } = req.body;

            // Validate passwords match
            if (password !== confirmPassword) {
                return res.render('register', { error: 'Passwords do not match' });
            }

            // Check if username exists
            const existingUser = await User.getByUsername(username);
            if (existingUser) {
                return res.render('register', { error: 'Username already exists' });
            }

            // Check if email exists
            const existingEmail = await User.getByEmail(email);
            if (existingEmail) {
                return res.render('register', { error: 'Email already exists' });
            }

            // Create user
            const userId = await User.create(username, email, password);

            // Auto-login after registration
            req.session.userId = userId;
            req.session.username = username;

            res.redirect('/products');
        } catch (error) {
            console.error('Registration error:', error);
            res.render('register', { error: 'Registration failed. Please try again.' });
        }
    }

    // Logout
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/login');
        });
    }

    // Display all users (admin view)
    static async index(req, res) {
        try {
            const users = await User.getAll();
            res.render('users', {
                users: users,
                user: req.session.username
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Error fetching users');
        }
    }

    // Create user (admin)
    static async create(req, res) {
        try {
            const { username, email, password } = req.body;
            await User.create(username, email, password);
            res.redirect('/users');
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Error creating user');
        }
    }

    // Update user (admin)
    static async update(req, res) {
        try {
            const { id, username, email, password } = req.body;
            await User.update(id, username, email, password || null);
            res.redirect('/users');
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send('Error updating user');
        }
    }

    // Delete user (admin)
    static async delete(req, res) {
        try {
            const { id } = req.body;
            await User.delete(id);
            res.redirect('/users');
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send('Error deleting user');
        }
    }
}

module.exports = UserController;

