require("dotenv").config();
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const productRoutes = require("./routes/productRoutes");
const { initProductsTable } = require("./config/dynamodb");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "product-app-secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  res.locals.formData = req.flash("formData")[0] || {};
  next();
});

app.get("/", (req, res) => {
  res.redirect("/products");
});

app.use("/products", productRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(`Loi he thong: ${err.message}`);
});

async function startServer() {
  await initProductsTable();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Khong the khoi dong ung dung:", error.message);
  process.exit(1);
});
