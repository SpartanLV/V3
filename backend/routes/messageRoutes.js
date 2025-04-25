const router    = require('express').Router();
const auth      = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const mc        = require('../controllers/messageController');

router.use(auth);
router.post('/',       roleCheck('admin'), mc.sendMessage);
router.post('/direct', mc.sendMessage);
router.get('/',        mc.getConversations);
router.patch('/:id/read', mc.markRead);

module.exports = router;