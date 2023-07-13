const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/productManager');

const manager = new ProductManager('../data/products.json');

router.get('/', (req, res) => {
  try {
    const limit = req.query.limit;
    manager.loadProducts();

    if (limit) {
      const products = manager.getProducts().slice(0, limit);
      res.json(products);
    } else {
      const products = manager.getProducts();
      res.json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    manager.loadProducts();
    const product = manager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', (req, res) => {
  try {
    const product = req.body;
    manager.addProduct(product);
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    manager.updateProduct(productId, updatedFields);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    manager.deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;