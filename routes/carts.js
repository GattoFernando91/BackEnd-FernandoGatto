const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const cartsFilePath = './data/carts.json';

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

function getCart(cartId) {
  const data = fs.readFileSync(cartsFilePath, 'utf8');
  const carts = JSON.parse(data);
  const cart = carts.find(c => c.id === cartId);
  return cart;
}

function saveCart(cart) {
  const data = fs.readFileSync(cartsFilePath, 'utf8');
  const carts = JSON.parse(data);
  const existingIndex = carts.findIndex(c => c.id === cart.id);
  if (existingIndex !== -1) {
    carts[existingIndex] = cart;
  } else {
    carts.push(cart);
  }
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8');
}

module.exports = router;