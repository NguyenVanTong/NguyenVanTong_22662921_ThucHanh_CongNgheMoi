# Product Management System - Node.js MVC with Session Authentication

**Sinh viên:** Nguyễn Văn Tông  
**MSSV:** 22662921  
**Môn học:** Công Nghệ Mới

## 🗄️ Hướng dẫn cài đặt Database trên XAMPP

### Bước 1: Cài đặt XAMPP
1. Tải XAMPP từ: https://www.apachefriends.org/
2. Cài đặt XAMPP (chọn Apache và MySQL)
3. Khởi động XAMPP Control Panel

### Bước 2: Khởi động MySQL
1. Mở **XAMPP Control Panel**
2. Click nút **Start** bên cạnh **MySQL**
3. Đợi đến khi status hiển thị màu xanh

### Bước 3: Tạo Database
**Cách 1: Sử dụng phpMyAdmin (Giao diện Web)**
1. Mở trình duyệt, truy cập: `http://localhost/phpmyadmin`
2. Click tab **"SQL"** ở menu trên
3. Copy toàn bộ nội dung file `database_setup.sql`
4. Paste vào ô SQL và click **"Go"**
5. Database `shopdb` sẽ được tạo với 2 bảng: `products` và `users`

### Bước 4: Kiểm tra Database
```sql
USE shopdb;
SHOW TABLES;
SELECT * FROM products;
SELECT * FROM users;
```

### Cấu trúc Database

#### Bảng `products`
| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK, AUTO_INCREMENT) | ID sản phẩm |
| name | VARCHAR(255) | Tên sản phẩm |
| price | DECIMAL(10,2) | Giá sản phẩm |
| quantity | INT | Số lượng |
| created_at | TIMESTAMP | Thời gian tạo |
| updated_at | TIMESTAMP | Thời gian cập nhật |

#### Bảng `users`
| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK, AUTO_INCREMENT) | ID người dùng |
| username | VARCHAR(50) UNIQUE | Tên đăng nhập |
| email | VARCHAR(100) UNIQUE | Email |
| password | VARCHAR(255) | Mật khẩu (đã hash) |
| created_at | TIMESTAMP | Thời gian tạo |
| updated_at | TIMESTAMP | Thời gian cập nhật |

---

## 🚀 Hướng dẫn chạy ứng dụng

### 1. Cài đặt Dependencies
```bash
cd lab1
npm init -y
npm install express ejs mysql2 express-session bcryptjs
```

Packages được cài đặt:
- `express`: Web framework
- `ejs`: Template engine
- `mysql2`: MySQL driver
- `express-session`: Session management
- `bcryptjs`: Password hashing

### 2. Cấu hình Database
Kiểm tra file `db/mysql.js`:
```javascript
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',        // Mặc định XAMPP không có password
    database: 'shopdb'
});
```

### 3. Chạy ứng dụng
```bash
node app.js
```

Hoặc dùng nodemon (tự động reload):
```bash
npm install -g nodemon
nodemon app.js
```

### 4. Truy cập ứng dụng
- Mở trình duyệt: `http://localhost:3000`
- Tự động redirect đến trang Login

### 5. Đăng nhập
Tạo tài khoản mới hoặc dùng tài khoản demo:
- **Username:** admin
- **Password:** password123

---

## 📁 Cấu trúc dự án (MVC Architecture)

```
lab1/
│
├── app.js                      # Main application file (Entry point)
├── package.json                # Dependencies configuration
├── database_setup.sql          # Database schema and sample data
├── README.md                   # Documentation (file này)
│
├── models/                     # MODEL LAYER (Data Access)
│   ├── Product.js             # Product model - CRUD operations
│   └── User.js                # User model - Authentication & CRUD
│
├── views/                      # VIEW LAYER (Presentation)
│   ├── login.ejs              # Login page
│   ├── register.ejs           # Registration page
│   ├── products.ejs           # Product management UI
│   ├── users.ejs              # User management UI
│   └── error.ejs              # Error page
│
├── controllers/                # CONTROLLER LAYER (Business Logic)
│   ├── productController.js   # Product business logic
│   └── userController.js      # User & authentication logic
│
├── routes/                     # ROUTING LAYER
│   ├── product.routes.js      # Product routes
│   └── users.js               # User & auth routes
│
├── middleware/                 # MIDDLEWARE
│   └── auth.js                # Authentication middleware
│
├── db/                        # DATABASE CONNECTION
│   └── mysql.js               # MySQL connection pool
│
└── public/                    # STATIC FILES
    └── stylesheets/
        └── style.css
```

---

## 🔄 Luồng hoạt động (MVC Flow)

### 1. Request Flow (Người dùng truy cập)
```
Browser → Routes → Middleware (Auth) → Controller → Model → Database
                                          ↓
Browser ← View (EJS) ← Controller ← Model ← Database
```

### 2. Ví dụ: Xem danh sách sản phẩm
```
1. User truy cập: GET /products
2. Routes (product.routes.js): Nhận request
3. Middleware (auth.js): Kiểm tra session
4. Controller (productController.index): Xử lý logic
5. Model (Product.getAll): Truy vấn database
6. Database: Trả về dữ liệu
7. Controller: Chuẩn bị data
8. View (products.ejs): Render HTML
9. Response: Trả về cho browser
```

---

## 🔐 Session Management

### Cách hoạt động
1. **Login:** User nhập username/password
2. **Verify:** So sánh password với hash trong DB (bcrypt)
3. **Create Session:** Tạo session với userId và username
4. **Store Session:** Lưu session vào memory (express-session)
5. **Authentication:** Middleware kiểm tra session cho mọi request
6. **Logout:** Destroy session

### Session Configuration
```javascript
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));
```

---

