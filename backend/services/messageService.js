// backend/services/messageService.js
const Message = require('../models/Message');

exports.createMessage = async ({ sender, recipient, body }) => {
  return Message.create({ sender, recipient, body });
};

exports.getUserMessages = async (userId) => {
  return Message.find({
    $or: [{ sender: userId }, { recipient: userId }]
  })
  .sort('createdAt')
  .lean();
};

exports.markMessageRead = async (messageId, userId) => {
  const msg = await Message.findById(messageId);
  if (!msg) throw new Error('NotFound');
  if (![msg.sender.toString(), msg.recipient.toString()].includes(userId)) {
    const err = new Error('Forbidden');
    err.code = 'FORBIDDEN';
    throw err;
  }
  msg.read = true;
  return msg.save();
};
