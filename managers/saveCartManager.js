const fs = require('fs');
const cartsFilePath = './data/carts.json';

function saveCart(cart) {
  try {
    const data = fs.readFileSync(cartsFilePath, 'utf8');
    const carts = JSON.parse(data);
    const existingIndex = carts.findIndex(c => c.id === cart.id);
    if (existingIndex !== -1) {
      carts[existingIndex] = cart;
    } else {
      carts.push(cart);
    }
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8');
  } catch (error) {
    console.error(error);
    throw new Error('Error while saving cart');
  }
}

module.exports = saveCart;
