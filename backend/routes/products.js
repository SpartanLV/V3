// server/routes/products.js
const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'CSE110', price: 22000 },
  { id: 2, name: 'CSE111', price: 22000 },
  { id: 3, name: 'CSE112', price: 22000 }
];

router.get('/', (req, res) => {
  res.json(products);
});

module.exports = router;