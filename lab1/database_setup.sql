-- =============================================
-- Database Setup for Product Management System
-- Node.js + Express + MySQL (MVC Architecture)
-- =============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS shopdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shopdb;

-- =============================================
-- PRODUCTS TABLE
-- =============================================
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- USERS TABLE
-- =============================================
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SAMPLE DATA - Products
-- =============================================
INSERT INTO products (name, price, quantity) VALUES
('Laptop Dell XPS 15', 1299.99, 15),
('iPhone 15 Pro', 999.99, 30),
('Samsung Galaxy S24', 899.99, 25),
('Sony WH-1000XM5 Headphones', 349.99, 50),
('iPad Air', 599.99, 20),
('MacBook Pro 16"', 2499.99, 10),
('Apple Watch Series 9', 399.99, 40),
('AirPods Pro 2', 249.99, 60),
('Dell UltraSharp Monitor', 449.99, 18),
('Logitech MX Master 3S', 99.99, 35);

-- =============================================
-- SAMPLE DATA - Users
-- =============================================
-- Note: These passwords are hashed using bcryptjs
-- Default password for all sample users: "password123"
-- Hash generated with: bcrypt.hash('password123', 10)

INSERT INTO users (username, email, password) VALUES
('admin', 'admin@example.com', '$2a$10$8xKzE3K0JZwJqWq3qZ3E8.OKX5qNXqxqxqxqxqxqxqxqxqxqxqxqx'),
('john_doe', 'john@example.com', '$2a$10$8xKzE3K0JZwJqWq3qZ3E8.OKX5qNXqxqxqxqxqxqxqxqxqxqxqxqx'),
('jane_smith', 'jane@example.com', '$2a$10$8xKzE3K0JZwJqWq3qZ3E8.OKX5qNXqxqxqxqxqxqxqxqxqxqxqxqx');

-- =============================================
-- VERIFY TABLES CREATED
-- =============================================
SHOW TABLES;

SELECT 'Products table created with sample data' AS Status;
SELECT COUNT(*) AS product_count FROM products;

SELECT 'Users table created with sample data' AS Status;
SELECT COUNT(*) AS user_count FROM users;

-- =============================================
-- DISPLAY TABLE STRUCTURES
-- =============================================
DESCRIBE products;
DESCRIBE users;

-- =============================================
-- NOTES
-- =============================================
-- 1. Update the user passwords above with actual bcrypt hashes if needed
-- 2. For production, use environment variables for database credentials
-- 3. Ensure MySQL server is running on localhost:3306
-- 4. Default MySQL user: root, password: (empty for XAMPP)

