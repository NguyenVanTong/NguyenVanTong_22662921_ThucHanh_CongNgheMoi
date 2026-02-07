const { v4: uuidv4 } = require('uuid');
const Product = require('../models/product.model');

exports.create = async (req, res) => {
  try {
    const product = {
      id: uuidv4(),
      name: req.body.name,
      price: req.body.price,
      url_image: req.body.url_image,
    };

    const data = await Product.create(product);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findAll = async (req, res) => {
  const data = await Product.findAll();
  res.json(data);
};

exports.findOne = async (req, res) => {
  const data = await Product.findById(req.params.id);
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await Product.update(req.params.id, req.body);
  res.json(data);
};

exports.delete = async (req, res) => {
  await Product.remove(req.params.id);
  res.json({ message: 'Deleted successfully' });
};
