const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const getCart = require('./managers/getCartManager');
const saveCart = require('./managers/saveCartManager');

router.post('/', (req, res) => {
  try {
    const cartId = uuidv4();
    const cart = { id: cartId, products: [] };
    saveCart(cart);
    res.status(201).json({ message: 'Cart created successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:cid', (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = getCart(cartId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    const cart = getCart(cartId);
    const existingProduct = cart.products.find(p => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    saveCart(cart);

    res.json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = router;
