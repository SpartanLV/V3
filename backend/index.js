// In server/index.js
const io = require('socket.io')(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true
    }
  });
  
  // Handle connections
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Handle joining notification room
    socket.on('join-notifications', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined notifications room`);
    });
  
    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });