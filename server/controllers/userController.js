const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Get all online users
const getOnlineUsers = async (req, res) => {
  try {
    const users = await User.find({ isOnline: true })
      .select('username socketId lastSeen')
      .sort({ lastSeen: -1 });

    res.json(users.map(user => ({
      username: user.username,
      id: user.socketId,
      lastSeen: user.lastSeen
    })));
  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .select('username isOnline lastSeen createdAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { username } = req.params;
    const { isOnline } = req.body;

    const user = await User.findOneAndUpdate(
      { username },
      {
        isOnline,
        lastSeen: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

// Register/Login user (simple implementation)
const registerUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }

    let user = await User.findOne({ username: username.trim() });

    if (!user) {
      user = new User({ username: username.trim() });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen
      },
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

module.exports = {
  getOnlineUsers,
  getUserByUsername,
  updateUserStatus,
  registerUser,
};
