// Authentication Middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated
        next();
    } else {
        // User is not authenticated, redirect to login
        res.redirect('/login');
    }
};

// Check if user is already logged in
const redirectIfAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is already logged in, redirect to products
        res.redirect('/products');
    } else {
        next();
    }
};

module.exports = { requireAuth, redirectIfAuth };

