require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/admin-module')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('join-notifications', (userId) => {
    socket.join(`user-${userId}`);
  });
});
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./middleware/auth'), require('./middleware/roleCheck')('admin'), require('./routes/adminRoutes'));
app.use('/api/bookings', require('./middleware/auth'), require('./routes/bookingRoutes'));
app.use('/api/notifications', require('./middleware/auth'), require('./routes/notificationRoutes'));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));