const { io } = require('socket.io-client');

// Test users
const testUsers = [
  { username: 'Alice', room: 'general' },
  { username: 'Bob', room: 'general' },
  { username: 'Charlie', room: 'support' },
  { username: 'Diana', room: 'support' },
  { username: 'Eve', room: 'random' }
];

// Test messages
const testMessages = [
  'Hello everyone!',
  'How is everyone doing?',
  'This is a test message',
  'Real-time chat is working!',
  'Socket.IO is awesome',
  'Testing multiple rooms',
  'Can you see this message?',
  'Great job on the app!',
  'Time for some testing',
  'Last message from me'
];

const sockets = [];

function createTestUser(user) {
  const socket = io('http://localhost:5000');

  socket.on('connect', () => {
    console.log(`${user.username} connected`);
    socket.emit('user_join', user);
  });

  socket.on('receive_message', (message) => {
    console.log(`${user.username} received: ${message.message} from ${message.sender}`);
  });

  socket.on('user_joined', (data) => {
    console.log(`${user.username} saw ${data.username} join`);
  });

  socket.on('user_list', (users) => {
    console.log(`${user.username} user list: ${users.map(u => u.username).join(', ')}`);
  });

  sockets.push({ socket, user });
  return socket;
}

function sendRandomMessage(socket, user) {
  const message = testMessages[Math.floor(Math.random() * testMessages.length)];
  socket.emit('send_message', {
    message: `${message} - from ${user.username}`,
    timestamp: new Date().toISOString()
  });
  console.log(`${user.username} sent: ${message}`);
}

function startTesting() {
  console.log('Starting test with multiple users...');

  // Create all test users
  testUsers.forEach(user => {
    createTestUser(user);
  });

  // Wait for connections
  setTimeout(() => {
    console.log('All users connected, starting message sending...');

    // Send messages periodically
    const messageInterval = setInterval(() => {
      sockets.forEach(({ socket, user }) => {
        if (Math.random() > 0.7) { // 30% chance to send message each interval
          sendRandomMessage(socket, user);
        }
      });
    }, 2000); // Every 2 seconds

    // Stop after 30 seconds
    setTimeout(() => {
      clearInterval(messageInterval);
      console.log('Test completed, disconnecting...');
      sockets.forEach(({ socket, user }) => {
        socket.disconnect();
        console.log(`${user.username} disconnected`);
      });
      process.exit(0);
    }, 30000);

  }, 2000); // Wait 2 seconds for connections
}

// Handle connection errors
process.on('unhandledRejection', (error) => {
  console.error('Test failed:', error);
  process.exit(1);
});

startTesting();
