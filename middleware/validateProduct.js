function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Product name is required and must be a string' });
  }

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Product description is required and must be a string' });
  }

  if (price === undefined || typeof price !== 'number') {
    return res.status(400).json({ error: 'Product price is required and must be a number' });
  }

  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Product category is required and must be a string' });
  }

  if (inStock !== undefined && typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'inStock must be a boolean if provided' });
  }

  next(); // ✅ All good, proceed to the route handler
}

module.exports = validateProduct;
