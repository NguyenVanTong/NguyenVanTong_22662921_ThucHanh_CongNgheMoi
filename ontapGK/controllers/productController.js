const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const ProductModel = require("../models/productModel");

function removeLocalUpload(imageUrl) {
  if (!imageUrl) {
    return;
  }

  const fileName = path.basename(imageUrl);
  const absolutePath = path.join(__dirname, "..", "public", "upload", fileName);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

function validateProductInput({ name, price, description }) {
  const errors = [];
  const normalizedName = (name || "").trim();
  const numericPrice = Number(price);
  const normalizedDescription = (description || "").trim();

  if (!normalizedName) {
    errors.push("Ten san pham khong duoc de trong.");
  }

  if (normalizedName.length > 120) {
    errors.push("Ten san pham toi da 120 ky tu.");
  }

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    errors.push("Gia phai la so khong am.");
  }

  if (normalizedDescription.length > 1000) {
    errors.push("Mo ta toi da 1000 ky tu.");
  }

  return {
    errors,
    payload: {
      name: normalizedName,
      price: numericPrice,
      description: normalizedDescription,
    },
  };
}

function removeUploadedFile(file) {
  if (file && file.path && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
}

exports.listProducts = async (req, res, next) => {
  try {
    const keyword = (req.query.q || "").trim().toLowerCase();
    const products = await ProductModel.getAll();

    const filteredProducts = products
      .filter((product) => {
        if (!keyword) {
          return true;
        }

        const name = (product.name || "").toLowerCase();
        const description = (product.description || "").toLowerCase();
        return name.includes(keyword) || description.includes(keyword);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.render("products/index", {
      products: filteredProducts,
      keyword,
    });
  } catch (error) {
    next(error);
  }
};

exports.showCreateForm = (req, res) => {
  res.render("products/create");
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;
    const validation = validateProductInput({ name, price, description });

    if (validation.errors.length) {
      removeUploadedFile(req.file);
      req.flash("error", validation.errors.join(" "));
      req.flash("formData", { name, price, description });
      return res.redirect("/products/new");
    }

    const now = new Date().toISOString();
    const imageUrl = req.file ? `/upload/${req.file.filename}` : "";

    const product = {
      id: uuidv4(),
      name: validation.payload.name,
      price: validation.payload.price,
      description: validation.payload.description,
      imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    await ProductModel.create(product);
    req.flash("success", "Them san pham thanh cong.");
    res.redirect("/products");
  } catch (error) {
    removeUploadedFile(req.file);
    req.flash("error", `Them san pham that bai: ${error.message}`);
    req.flash("formData", req.body || {});
    return res.redirect("/products/new");
  }
};

exports.showEditForm = async (req, res, next) => {
  try {
    const product = await ProductModel.getById(req.params.id);
    if (!product) {
      req.flash("error", "Khong tim thay san pham.");
      return res.redirect("/products");
    }

    res.render("products/edit", { product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await ProductModel.getById(id);

    if (!existing) {
      removeUploadedFile(req.file);
      req.flash("error", "Khong tim thay san pham.");
      return res.redirect("/products");
    }

    const { name, price, description } = req.body;
    const validation = validateProductInput({ name, price, description });

    if (validation.errors.length) {
      removeUploadedFile(req.file);
      req.flash("error", validation.errors.join(" "));
      return res.redirect(`/products/${id}/edit`);
    }

    const payload = {
      name: validation.payload.name,
      price: validation.payload.price,
      description: validation.payload.description,
      updatedAt: new Date().toISOString(),
    };

    if (req.file) {
      payload.imageUrl = `/upload/${req.file.filename}`;
      removeLocalUpload(existing.imageUrl);
    }

    await ProductModel.update(id, payload);
    req.flash("success", "Cap nhat san pham thanh cong.");
    res.redirect("/products");
  } catch (error) {
    removeUploadedFile(req.file);
    req.flash("error", `Cap nhat san pham that bai: ${error.message}`);
    return res.redirect(`/products/${req.params.id}/edit`);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await ProductModel.delete(req.params.id);
    if (!deleted) {
      req.flash("error", "Khong tim thay san pham.");
      return res.redirect("/products");
    }

    removeLocalUpload(deleted.imageUrl);
    req.flash("success", "Xoa san pham thanh cong.");
    res.redirect("/products");
  } catch (error) {
    next(error);
  }
};

exports.showDetail = async (req, res, next) => {
  try {
    const product = await ProductModel.getById(req.params.id);
    if (!product) {
      req.flash("error", "Khong tim thay san pham.");
      return res.redirect("/products");
    }

    res.render("products/detail", { product });
  } catch (error) {
    next(error);
  }
};
