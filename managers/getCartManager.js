const fs = require('fs');
const cartsFilePath = './data/carts.json';

function getCart(cartId) {
  try {
    const data = fs.readFileSync(cartsFilePath, 'utf8');
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cartId);
    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error while reading carts file');
  }
}

module.exports = getCart;
