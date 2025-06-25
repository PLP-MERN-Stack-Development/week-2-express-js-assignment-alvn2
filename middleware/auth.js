// middleware/auth.js

module.exports = function authenticate(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized. Missing or invalid API key.' });
  }

  next();
};
