// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// Route imports
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const gradeRoutes = require('./routes/gradeRoutes');

const app = express();
const httpServer = createServer(app);

// 🛑 IMPORTANT: CORS middleware BEFORE all other middlewares/routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Body parser & static file serving
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/admin-module', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// === SOCKET AUTH MIDDLEWARE ===
// Verify JWT on socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id;
    next();
  } catch (e) {
    next(new Error('Authentication error'));
  }
});

// === SOCKET EVENT HANDLERS ===
io.on('connection', (socket) => {
  // Notifications: join personal notifications room
  socket.on('join-notifications', (userId) => {
    socket.join(`user-${userId}`);
  });

  // Chat: join personal chat room
  socket.on('join-chat', () => {
    socket.join(`chat-${socket.userId}`);
  });

  // Chat: handle send-message events
  socket.on('send-message', async ({ recipientId, body }) => {
    try {
      // 1) Persist message
      const Message = require('./models/Message');
      const msg = await Message.create({
        sender: socket.userId,
        recipient: recipientId,
        body
      });

      // 2) Emit to recipient's room
      io.to(`chat-${recipientId}`).emit('receive-message', msg);

      // 3) Acknowledge back to sender
      socket.emit('message-sent', msg);
    } catch (err) {
      console.error('send-message error:', err);
      socket.emit('error', 'Message delivery failed');
    }
  });
});

// Make io accessible in controllers/routes if needed
app.set('io', io);

// === ROUTES MOUNTING ===
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use(
  '/api/admin',
  require('./middleware/auth'),
  require('./middleware/roleCheck')('admin'),
  adminRoutes
);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('api/users', userRoutes);
console.log('User routes mounted at /api/users, messages at /api/messages');
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/grades', gradeRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
