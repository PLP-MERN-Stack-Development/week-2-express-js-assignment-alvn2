// Load environment variables from .env file
require('dotenv').config();
console.log("API Key:", process.env.API_KEY);


// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Import middleware
const logger = require('./middleware/logger');
const authenticate = require('./middleware/auth');
const validateProduct = require('./middleware/validateProduct');

// Middleware setup
app.use(bodyParser.json());
app.use(logger); // ✅ logger middleware used after `app` is defined

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Hello World! Welcome to the Product API! Go to /api/products to see all products.');
});

//  Search products by name
app.get('/api/products/search', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Search query "name" is required' });
  }

  const keyword = name.toLowerCase();
  const results = products.filter(p =>
    p.name.toLowerCase().includes(keyword)
  );

  res.status(200).json({
    total: results.length,
    products: results
  });
});

// GET /api/products - Get all products with filtering and pagination
app.get('/api/products', (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  let result = [...products];

  // Filter by category if provided
  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Pagination logic
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedResult = result.slice(startIndex, endIndex);

  res.status(200).json({
    page: parseInt(page),
    limit: parseInt(limit),
    total: result.length,
    products: paginatedResult
  });
});

// GET /api/products/stats - Get product category statistics
app.get('/api/products/stats', (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  res.status(200).json({ stats });
});


// GET /api/products/:id - Get a specific product
const { NotFoundError } = require('./errors/customErrors');
app.get('/api/products/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new NotFoundError('Product not found'));
  }
  res.status(200).json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', authenticate, validateProduct,(req, res) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock: inStock ?? true
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', authenticate, validateProduct,(req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
   return next(new NotFoundError('Product not found'));
  }

  const { name, description, price, category, inStock } = req.body;
  products[productIndex] = {
    ...products[productIndex],
    name: name ?? products[productIndex].name,
    description: description ?? products[productIndex].description,
    price: price ?? products[productIndex].price,
    category: category ?? products[productIndex].category,
    inStock: inStock ?? products[productIndex].inStock
  };

  res.status(200).json(products[productIndex]);
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authenticate,(req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return next(new NotFoundError('Product not found'));
  }

  products.splice(productIndex, 1);
  res.status(204).send();
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
