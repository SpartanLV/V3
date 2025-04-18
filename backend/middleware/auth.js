// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('User authenticated:', req.user);  // Add this log
    next();
  } catch (err) {
    console.log('Invalid token');
    res.status(400).json({ error: "Invalid token" });
  }
};
