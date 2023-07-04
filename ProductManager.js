const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.lastProductId = 0;
        this.loadProducts();
    }

loadProducts() {
    try {
        const data = fs.readFileSync(this.path, 'utf8');
        this.products = JSON.parse(data);
        if (this.products.length > 0) {
            this.lastProductId = this.products[this.products.length - 1].id;
        }
    } catch (error) {
        this.products = [];
        this.lastProductId = 0;
    }
}

saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
}

addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.error('All fields are required.');
        return;
    }

    const existingProduct = this.products.find(p => p.code === product.code);
    if (existingProduct) {
        console.error('Product code already exists.');
        return;
    }

    const newProduct = { ...product, id: ++this.lastProductId };
    this.products.push(newProduct);
    this.saveProducts();
    console.log('Product added:', newProduct);
}

getProducts() {
    return this.products;
}

getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
        console.error('Product not found.');
        return null;
    } else {
        console.log('Product found:', product);
        return product;
    }
}

updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
        console.error('Product not found.');
        return;
    }

    const updatedProduct = { ...this.products[productIndex], ...updatedFields };
    this.products[productIndex] = updatedProduct;
    this.saveProducts();
    console.log('Product updated:', updatedProduct);
    }

deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
        console.error('Product not found.');
        return;
    }

    const deletedProduct = this.products.splice(productIndex, 1)[0];
    this.saveProducts();
    console.log('Product deleted:', deletedProduct);
    }
}

module.exports = ProductManager;