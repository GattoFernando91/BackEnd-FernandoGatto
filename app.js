const express = require('express');
const fs = require('fs');
const ProductManager = require('./ProductManager');

const app = express();
const manager = new ProductManager('products.json');

app.get('/products', async (req, res) => {
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

app.get('/products/:pid', async (req, res) => {
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

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
