# Product Management System - Node.js MVC with Session Authentication

**Sinh viên:** Nguyễn Văn Tông  
**MSSV:** 22662921  
**Môn học:** Công Nghệ Mới

## 📋 Tính năng

### ✅ Hoàn thiện đầy đủ các yêu cầu:

1. **CRUD đầy đủ cho Products và Users**
   - ✓ Create (Thêm)
   - ✓ Read (Xem/Liệt kê)
   - ✓ Update (Sửa)
   - ✓ Delete (Xóa)

2. **Login + Session Management**
   - ✓ Đăng ký tài khoản (Register)
   - ✓ Đăng nhập (Login)
   - ✓ Đăng xuất (Logout)
   - ✓ Bảo vệ routes với session
   - ✓ Mã hóa password với bcrypt

3. **Kiến trúc MVC rõ ràng**
   - ✓ **Models**: Product.js, User.js (Data Access Layer)
   - ✓ **Views**: EJS templates (Presentation Layer)
   - ✓ **Controllers**: productController.js, userController.js (Business Logic)
   - ✓ **Middleware**: auth.js (Authentication)
   - ✓ **Routes**: Routing logic

4. **Giao diện đẹp và responsive**
   - ✓ CSS hiện đại với gradient
   - ✓ Form validation
   - ✓ Responsive design

---

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

**Cách 2: Sử dụng MySQL Command Line**
```bash
# Mở Command Prompt hoặc Terminal
cd C:\xampp\mysql\bin

# Đăng nhập MySQL (password mặc định là rỗng)
mysql -u root -p

# Trong MySQL prompt, chạy:
source D:\HK2_Nam4\CongNgheMoi\NguyenVanTong_22662921_ThucHanh_CongNgheMoi\lab1\database_setup.sql
```

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
npm install
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

## 🆚 So sánh Node.js vs Java Servlet + JSP

| Tiêu chí | Node.js + Express + EJS | Java Servlet + JSP |
|----------|------------------------|---------------------|
| **Ngôn ngữ** | JavaScript (cả client & server) | Java (server), HTML/JSP (view) |
| **Kiến trúc** | Single-threaded, Event-driven | Multi-threaded |
| **Performance** | Tốt cho I/O operations, real-time | Tốt cho CPU-intensive tasks |
| **Learning Curve** | Dễ học hơn, syntax đơn giản | Khó hơn, cần hiểu OOP và Java |
| **Setup** | Đơn giản (npm install) | Phức tạp (Tomcat, WAR deployment) |
| **Hot Reload** | ✅ Có (nodemon) | ❌ Cần restart server |
| **Template Engine** | EJS, Pug, Handlebars | JSP, JSTL |
| **ORM/Database** | Sequelize, TypeORM, raw SQL | Hibernate, JDBC |
| **Session** | express-session (memory/store) | HttpSession (built-in) |
| **Deployment** | Heroku, Vercel, AWS Lambda | Tomcat, GlassFish, WildFly |
| **Community** | Rất lớn, NPM packages | Lớn, Maven repositories |
| **Startup Time** | Rất nhanh (~1s) | Chậm (~5-10s) |
| **Memory Usage** | Thấp hơn | Cao hơn |
| **Scalability** | Horizontal scaling dễ dàng | Vertical scaling thường dùng |
| **Async Support** | Native (async/await, Promises) | CompletableFuture (từ Java 8+) |

### Chi tiết so sánh:

#### 1. **Routing**

**Node.js + Express:**
```javascript
app.get('/products', requireAuth, ProductController.index);
app.post('/products/add', requireAuth, ProductController.create);
```
- Đơn giản, rõ ràng
- Middleware dễ thêm

**Java Servlet:**
```java
@WebServlet("/products")
public class ProductServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        // Logic here
    }
}
```
- Verbose hơn
- Cần annotations hoặc web.xml

#### 2. **Database Access**

**Node.js (async/await):**
```javascript
static async getAll() {
    const [rows] = await db.query('SELECT * FROM products');
    return rows;
}
```
- Async/await tự nhiên
- Non-blocking I/O

**Java JDBC:**
```java
public List<Product> getAll() {
    List<Product> products = new ArrayList<>();
    try (Connection conn = dataSource.getConnection();
         PreparedStatement stmt = conn.prepareStatement("SELECT * FROM products");
         ResultSet rs = stmt.executeQuery()) {
        while (rs.next()) {
            products.add(new Product(rs.getInt("id"), ...));
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return products;
}
```
- Nhiều boilerplate code
- Try-catch bắt buộc

#### 3. **Template Rendering**

**EJS (Node.js):**
```html
<% products.forEach(p => { %>
    <tr>
        <td><%= p.name %></td>
        <td>$<%= p.price %></td>
    </tr>
<% }) %>
```

**JSP (Java):**
```jsp
<c:forEach items="${products}" var="p">
    <tr>
        <td>${p.name}</td>
        <td>$${p.price}</td>
    </tr>
</c:forEach>
```

#### 4. **Session Management**

**Node.js:**
```javascript
req.session.userId = user.id;
if (req.session.userId) {
    // Authenticated
}
```

**Java Servlet:**
```java
HttpSession session = request.getSession();
session.setAttribute("userId", user.getId());
if (session.getAttribute("userId") != null) {
    // Authenticated
}
```

### Kết luận:

**Node.js + Express tốt cho:**
- ✅ Dự án cần phát triển nhanh (startup, MVP)
- ✅ Real-time applications (chat, notifications)
- ✅ RESTful APIs
- ✅ Microservices
- ✅ Team biết JavaScript

**Java Servlet + JSP tốt cho:**
- ✅ Enterprise applications lớn
- ✅ Ứng dụng cần type-safety mạnh
- ✅ Tích hợp với hệ thống Java legacy
- ✅ Team có kinh nghiệm Java
- ✅ Ứng dụng xử lý phức tạp, multi-threading

---

## 🎯 Điểm nổi bật của dự án

1. **MVC rõ ràng:** Tách biệt hoàn toàn Model, View, Controller
2. **Security:** Password hashing với bcrypt, session management
3. **User Experience:** Giao diện đẹp, responsive, validation
4. **Code Quality:** Clean code, comments rõ ràng
5. **Documentation:** Hướng dẫn chi tiết, dễ hiểu

---

## 📝 Tác giả

**Nguyễn Văn Tông**  
MSSV: 22662921  
Lớp: [Tên lớp]  
Trường: [Tên trường]

---

## 📞 Liên hệ

Nếu có thắc mắc về dự án, vui lòng liên hệ qua email hoặc tạo issue trên repository.

---

## 📄 License

MIT License - Free to use for educational purposes.

