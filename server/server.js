const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Import middleware
const logger = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateSocket } = require('./middleware/auth');

// Import controllers
const {
  handleUserJoin,
  handleSendMessage,
  handleTyping,
  handlePrivateMessage,
  handleDisconnect
} = require('./controllers/chatController');

// Import routes
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Legacy API routes (for backward compatibility)
app.get('/api/messages', async (req, res) => {
  try {
    const Message = require('./models/Message');
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const User = require('./models/User');
    const users = await User.find({ isOnline: true });
    res.json(users.map(u => ({ username: u.username, id: u.socketId })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server with MVC Architecture is running');
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username) => {
    handleUserJoin(io, socket, username);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    handleSendMessage(io, socket, messageData);
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    handleTyping(io, socket, isTyping);
  });

  // Handle private messages
  socket.on('private_message', (data) => {
    handlePrivateMessage(io, socket, data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    handleDisconnect(io, socket);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
