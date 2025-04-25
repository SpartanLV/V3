// backend/controllers/socketController.js
const svc = require('../services/messageService');

exports.handleJoinNotifications = socket => userId =>
  socket.join(`user-${userId}`);

exports.handleJoinChat = socket => () =>
  socket.join(`chat-${socket.userId}`);

exports.handleSendMessage = (io, socket) => async ({ recipientId, body }) => {
  if (!recipientId || !body) {
    return socket.emit('error', 'recipientId and body are required');
  }
  try {
    const msg = await svc.createMessage({
      sender:    socket.userId,
      recipient: recipientId,
      body
    });
    io.to(`chat-${recipientId}`).emit('receive-message', msg);
    socket.emit('message-sent', msg);
  } catch (err) {
    console.error('send-message error:', err);
    socket.emit('error', 'Failed to send message');
  }
};
