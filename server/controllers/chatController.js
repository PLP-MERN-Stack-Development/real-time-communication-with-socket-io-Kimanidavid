const User = require('../models/User');
const Message = require('../models/Message');

// Handle user joining chat
const handleUserJoin = async (io, socket, username) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, socketId: socket.id });
    } else {
      user.socketId = socket.id;
      user.isOnline = true;
      user.lastSeen = new Date();
    }
    await user.save();

    // Store in memory for real-time operations
    socket.username = username;
    socket.userId = user._id;

    // Get all online users
    const onlineUsers = await User.find({ isOnline: true });
    io.emit('user_list', onlineUsers.map(u => ({
      username: u.username,
      id: u.socketId,
      lastSeen: u.lastSeen
    })));

    io.emit('user_joined', {
      username,
      id: socket.id,
      timestamp: new Date()
    });

    console.log(`${username} joined the chat`);
  } catch (error) {
    console.error('Error handling user join:', error);
    socket.emit('error', { message: 'Failed to join chat' });
  }
};

// Handle sending messages
const handleSendMessage = async (io, socket, messageData) => {
  try {
    const message = new Message({
      ...messageData,
      sender: socket.username || 'Anonymous',
      senderId: socket.id,
      timestamp: new Date(),
    });

    await message.save();

    // Broadcast to all clients
    io.emit('receive_message', {
      ...message.toObject(),
      id: message._id
    });
  } catch (error) {
    console.error('Error saving message:', error);
    socket.emit('error', { message: 'Failed to send message' });
  }
};

// Handle typing indicators
const handleTyping = (io, socket, isTyping) => {
  try {
    if (isTyping) {
      socket.isTyping = true;
    } else {
      socket.isTyping = false;
    }

    // Get all typing users
    const typingUsers = [];
    io.sockets.sockets.forEach(sock => {
      if (sock.isTyping && sock.username) {
        typingUsers.push(sock.username);
      }
    });

    io.emit('typing_users', typingUsers);
  } catch (error) {
    console.error('Error handling typing:', error);
  }
};

// Handle private messages
const handlePrivateMessage = async (io, socket, { to, message }) => {
  try {
    const privateMessage = new Message({
      sender: socket.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date(),
      isPrivate: true,
      recipient: to, // This should be username
      recipientId: to, // This should be socket ID
    });

    await privateMessage.save();

    // Send to recipient and sender
    socket.to(to).emit('private_message', privateMessage);
    socket.emit('private_message', privateMessage);
  } catch (error) {
    console.error('Error saving private message:', error);
    socket.emit('error', { message: 'Failed to send private message' });
  }
};

// Handle user disconnection
const handleDisconnect = async (io, socket) => {
  try {
    if (socket.username) {
      io.emit('user_left', {
        username: socket.username,
        id: socket.id,
        timestamp: new Date()
      });
      console.log(`${socket.username} left the chat`);

      // Update user status in database
      await User.findOneAndUpdate(
        { socketId: socket.id },
        { isOnline: false, lastSeen: new Date() }
      );
    }

    // Update online users list
    const onlineUsers = await User.find({ isOnline: true });
    io.emit('user_list', onlineUsers.map(u => ({
      username: u.username,
      id: u.socketId
    })));

    // Update typing users
    const typingUsers = [];
    io.sockets.sockets.forEach(sock => {
      if (sock.isTyping && sock.username) {
        typingUsers.push(sock.username);
      }
    });
    io.emit('typing_users', typingUsers);
  } catch (error) {
    console.error('Error handling disconnect:', error);
  }
};

module.exports = {
  handleUserJoin,
  handleSendMessage,
  handleTyping,
  handlePrivateMessage,
  handleDisconnect,
};
