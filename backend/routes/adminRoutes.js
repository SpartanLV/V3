const express = require('express');
const router = express.Router();
const { getUsers, addUser, deleteUser } = require('../controllers/userController');
const { generateReport } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// User routes
router.get('/users', auth, roleCheck('super_admin'), getUsers);
router.post('/users', auth, roleCheck('super_admin'), addUser);
router.delete('/users/:id', auth, roleCheck('super_admin'), deleteUser);

// Report routes (fixed syntax)
router.get('/reports/:type', auth, roleCheck('admin'), generateReport);
router.get('/reports/:type/:format', auth, roleCheck('admin'), generateReport);

module.exports = router;