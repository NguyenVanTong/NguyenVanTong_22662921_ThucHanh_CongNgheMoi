// Main Application File - MVC Architecture with Session Management
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));

// Routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/product.routes');

// Root redirect to login
app.get('/', (req, res) => {
    if (req.session && req.session.userId) {
        res.redirect('/products');
    } else {
        res.redirect('/login');
    }
});

// Mount routes
app.use('/', userRoutes);
app.use('/products', productRoutes);

// Error handling
app.use((req, res, next) => {
    res.status(404).render('error', {
        message: 'Page not found',
        error: { status: 404 }
    });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('MVC Architecture with Session Management');
});

module.exports = app;


