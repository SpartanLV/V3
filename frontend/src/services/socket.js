import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
  withCredentials: true,
  autoConnect: false
});

export const setupSocket = (userId) => {
  socket.auth = { userId };
  socket.connect();
  
  socket.on('connect', () => {
    socket.emit('join-notifications', userId);
  });

  return socket;
};

export const subscribeToNotifications = (callback) => {
  socket.on('new-notification', callback);
};

export const disconnectSocket = () => {
  socket.disconnect();
};