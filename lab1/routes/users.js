// User Routes - Authentication & User Management
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { requireAuth, redirectIfAuth } = require('../middleware/auth');

// Public routes (login/register)
router.get('/login', redirectIfAuth, UserController.showLogin);
router.post('/login', UserController.login);
router.get('/register', redirectIfAuth, UserController.showRegister);
router.post('/register', UserController.register);

// Protected routes
router.get('/logout', UserController.logout);

// User management routes (require authentication)
router.get('/users', requireAuth, UserController.index);
router.post('/users/add', requireAuth, UserController.create);
router.post('/users/update', requireAuth, UserController.update);
router.post('/users/delete', requireAuth, UserController.delete);

module.exports = router;


