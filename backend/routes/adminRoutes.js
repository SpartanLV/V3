const express = require('express');
const router = express.Router();
const { getUsers, addUser, deleteUser } = require('../controllers/userController');
const { generateReport } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// User routes
router.get('/users', auth, roleCheck('admin'), getUsers);
router.post('/users', auth, roleCheck('admin'), addUser);
router.delete('/users/:id', auth, roleCheck('admin'), deleteUser);

// Report routes (fixed syntax)
router.get('/reports/:type', auth, roleCheck('admin'), generateReport);
router.get('/reports/:type/:format', auth, roleCheck('admin'), generateReport);

module.exports = router;