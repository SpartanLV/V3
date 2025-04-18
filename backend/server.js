// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

// 🛑 IMPORTANT: Apply CORS middleware BEFORE all other middlewares/routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Other middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/admin-module')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
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

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
