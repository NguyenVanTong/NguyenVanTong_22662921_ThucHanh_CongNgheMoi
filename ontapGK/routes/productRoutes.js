const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const productController = require("../controllers/productController");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "public", "upload");

function toSlug(value = "") {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const productName = (req.body.name || "").trim();
    const sourceName = productName || path.basename(file.originalname, ext);
    const baseName = toSlug(sourceName) || "san-pham";
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }
  cb(new Error("Chi cho phep upload file anh"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

function runUploadSingle(fieldName, redirectResolver) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (error) => {
      if (!error) {
        return next();
      }

      const redirectTo = redirectResolver(req);
      if (error.code === "LIMIT_FILE_SIZE") {
        req.flash("error", "Anh vuot qua dung luong 5MB.");
      } else {
        req.flash("error", error.message || "Upload anh that bai.");
      }

      req.flash("formData", req.body || {});
      return res.redirect(redirectTo);
    });
  };
}

router.get("/", productController.listProducts);
router.get("/new", productController.showCreateForm);
router.post(
  "/",
  runUploadSingle("image", () => "/products/new"),
  productController.createProduct,
);
router.get("/:id", productController.showDetail);
router.get("/:id/edit", productController.showEditForm);
router.put(
  "/:id",
  runUploadSingle("image", (req) => `/products/${req.params.id}/edit`),
  productController.updateProduct,
);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
