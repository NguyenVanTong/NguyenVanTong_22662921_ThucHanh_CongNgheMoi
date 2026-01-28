require("dotenv").config();
const express = require("express");
const path = require("path");
const productRoutes = require("./routes/product");

const app = express();

// Middleware configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/products", productRoutes);

// Home route - redirect to products list
app.get("/", (req, res) => {
    res.redirect("/products");
});

// 404 handler
app.use((req, res) => {
    res.status(404).render("404", { message: "Trang không tìm thấy" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("error", { message: "Lỗi máy chủ nội bộ" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

