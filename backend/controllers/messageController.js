// backend/controllers/messageController.js
const svc = require('../services/messageService');

exports.sendMessage = async (req, res) => {
  try {
    const { recipient, body } = req.body;
    if (!recipient || !body) {
      return res.status(400).json({ error: 'recipient and body are required' });
    }
    const msg = await svc.createMessage({
      sender: req.user.id,
      recipient,
      body
    });
    return res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const msgs = await svc.getUserMessages(req.user.id);
    return res.json(msgs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load messages' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const updated = await svc.markMessageRead(req.params.id, req.user.id);
    return res.json(updated);
  } catch (err) {
    if (err.message === 'NotFound') return res.status(404).json({ error: 'Message not found' });
    if (err.code === 'FORBIDDEN') return res.status(403).json({ error: 'Not your message' });
    console.error(err);
    return res.status(500).json({ error: 'Failed to mark read' });
  }
};
