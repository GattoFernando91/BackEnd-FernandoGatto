const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const getCart = require('../managers/getCartManager');
const saveCart = require('../managers/saveCartManager');
const io = require('socket.io')(http);

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

    io.emit('productUpdated', cart.products);

    res.json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:cid/product/:pid', (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = getCart(cartId);
    const productIndex = cart.products.findIndex(p => p.product === productId);

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      saveCart(cart);

      io.emit('productUpdated', cart.products);
      res.json({ message: 'Product removed from cart successfully', cart });
    } else {
      res.status(404).json({ error: 'Product not found in cart' });
    }
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
