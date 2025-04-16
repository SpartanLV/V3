const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth'); // No destructuring
const roleCheck = require('../middleware/roleCheck'); // No destructuring

// Test middleware stack first
router.get('/test', auth, (req, res) => res.send('Auth works'));
router.get('/test-role', auth, roleCheck('admin'), (req, res) => res.send('RoleCheck works'));

// Then your actual routes
router.get('/users', auth, roleCheck('super_admin'), userController.getUsers);
router.post('/users', auth, roleCheck('super_admin'), userController.addUser);
router.delete('/users/:id', auth, roleCheck('super_admin'), userController.deleteUser);


router.get('/reports/:type', auth, roleCheck('admin'), reportController.generateReport);
router.get('/reports/:type/:format', auth, roleCheck('admin'), reportController.generateReport);

module.exports = router;