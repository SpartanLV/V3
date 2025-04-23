const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const notificationController = require('../controllers/notificationController');

router.use(authenticateJWT);
router.use(roleCheck('admin'));

router.post('/',          notificationController.createNotification);
router.get('/user',       notificationController.getUserNotifications);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
