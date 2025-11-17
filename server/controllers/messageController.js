const Message = require('../models/Message');

// Get messages with pagination
const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'username')
      .sort({ timestamp: 1 }); // Re-sort to ascending for display

    const totalMessages = await Message.countDocuments();
    const totalPages = Math.ceil(totalMessages / limit);

    res.json({
      messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalMessages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Get messages for a specific user (private messages)
const getUserMessages = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUser = req.user?.username;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUser, recipient: username },
        { sender: username, recipient: currentUser }
      ],
      isPrivate: true
    })
    .sort({ timestamp: 1 })
    .limit(100);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Get recent messages (for initial load)
const getRecentMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.find({ isPrivate: false })
      .sort({ timestamp: -1 })
      .limit(limit)
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching recent messages:', error);
    res.status(500).json({ error: 'Failed to fetch recent messages' });
  }
};

// Delete a message (admin or sender only)
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const user = req.user;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is the sender or admin
    if (message.sender !== user.username && user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    await Message.findByIdAndDelete(messageId);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

// Search messages
const searchMessages = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const messages = await Message.find({
      message: { $regex: query, $options: 'i' },
      isPrivate: false // Only search public messages
    })
    .sort({ timestamp: -1 })
    .limit(50)
    .populate('sender', 'username');

    res.json(messages);
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({ error: 'Failed to search messages' });
  }
};

module.exports = {
  getMessages,
  getUserMessages,
  getRecentMessages,
  deleteMessage,
  searchMessages,
};
