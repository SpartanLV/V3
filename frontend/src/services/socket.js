// frontend/src/services/socket.js
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true
});

/**
 * Call this once—e.g. after login—to connect and join rooms.
 */
export const setupSocket = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('JWT not found');
  const { id: userId } = jwtDecode(token);

  // Attach token for server auth, then connect:
  socket.auth = { token };
  socket.connect();

  socket.on('connect', () => {
    // join notifications + chat rooms
    socket.emit('join-notifications', userId);
    socket.emit('join-chat');
  });

  return socket;
};

/** Notification subscription */
export const subscribeToNotifications = cb =>
  socket.on('new-notification', cb);

/** Chat subscriptions */
export const subscribeToMessages = cb =>
  socket.on('receive-message', cb);

export const subscribeToMessageSent = cb =>
  socket.on('message-sent', cb);

/** Send a new chat message */
export const sendMessageWS = (recipientId, body) => {
  socket.emit('send-message', { recipientId, body });
};

/** Tear down */
export const disconnectSocket = () => {
  socket.disconnect();
};
