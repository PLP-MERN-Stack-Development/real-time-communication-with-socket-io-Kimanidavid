# Real-Time Chat Application with Socket.IO

A full-stack MERN real-time chat application featuring multiple chat rooms, file uploads, typing indicators, read receipts, and private messaging.

## 🚀 Features

### Core Features
- **Real-Time Messaging**: Instant message delivery using Socket.IO
- **Multiple Chat Rooms**: Predefined rooms (general, support, random)
- **User Management**: Join/leave notifications and online user lists
- **File Uploads**: Image uploads with size limits (5MB max)
- **Message History**: Paginated message history per room

### Advanced Features
- **Typing Indicators**: See when users are typing
- **Read Receipts**: Track message read status
- **Private Messaging**: Direct messages between users
- **Message Reactions**: Add emoji reactions to messages
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Socket.IO Client
- **Backend**: Node.js, Express.js, Socket.IO Server
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS with custom components

## 📋 Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Modern web browser

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd real-time-communication-with-socket-io
```

### 2. Install Dependencies

#### Server Dependencies
```bash
cd server
pnpm install
```

#### Client Dependencies
```bash
cd ../client
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 4. Start the Application

#### Start the Server (Terminal 1)
```bash
cd server
pnpm run dev
```
The server will start on `http://localhost:5000`

#### Start the Client (Terminal 2)
```bash
cd client
pnpm run dev
```
The client will start on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 🧪 Testing

### Manual Testing
1. Open multiple browser tabs/windows
2. Join with different usernames
3. Test messaging across rooms
4. Try file uploads and private messaging

### Automated Testing
Run the test script to simulate multiple users:
```bash
cd client
node test-socket.cjs
```

This will create 5 test users across different rooms and send automated messages for 30 seconds.

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── socket/        # Socket.IO client setup
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── public/uploads/    # File uploads directory
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env              # Environment variables
└── README.md
```

## 🔧 Available Scripts

### Client Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### Server Scripts
- `pnpm run dev` - Start development server with nodemon

## 🌐 API Endpoints

### REST Endpoints
- `GET /api/rooms` - Get available chat rooms
- `GET /api/messages/:room` - Get messages for a room (paginated)
- `GET /api/users/:room` - Get users in a room
- `POST /api/upload` - Upload image files

### Socket.IO Events

#### Client → Server
- `user_join` - Join chat with username and room
- `send_message` - Send a message
- `send_file` - Send a file message
- `join_room` - Switch to different room
- `typing` - Indicate typing status
- `private_message` - Send private message
- `message_read` - Mark message as read

#### Server → Client
- `receive_message` - New message received
- `user_joined` - User joined notification
- `user_left` - User left notification
- `user_list` - Updated user list
- `room_messages` - Initial room messages
- `typing_users` - Current typing users
- `private_message` - Private message received
- `read_receipt` - Message read confirmation

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `CLIENT_URL` | Frontend URL | http://localhost:5173 |

## 📝 Development Notes

- Messages are stored in memory (not persisted to database)
- File uploads are limited to images (JPEG, PNG, GIF) under 5MB
- Maximum 100 messages per room before old messages are removed
- CORS is configured for cross-origin requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a learning assignment and is not licensed for commercial use.

## 🆘 Troubleshooting

### Common Issues
- **Port already in use**: Change PORT in `.env` or kill the process using the port
- **CORS errors**: Ensure CLIENT_URL matches your frontend URL
- **Socket connection fails**: Check if server is running on correct port

### Debug Mode
- Server logs all connections and messages
- Client console shows Socket.IO events
- Use browser dev tools to inspect network requests

## 📸 Screenshots

### Login Screen
![Login Screen](screenshots/login-screen.png)
*The initial login screen where users enter their username and select a chat room.*

### Chat Interface
![Chat Interface](screenshots/chat-interface.png)
*The main chat interface showing messages, user list, and room selector.*

### Multiple Rooms
![Multiple Rooms](screenshots/multiple-rooms.png)
*Demonstration of switching between different chat rooms (general, support, random).*

### File Upload
![File Upload](screenshots/file-upload.png)
*File upload functionality showing image sharing in chat.*

### Typing Indicators
![Typing Indicators](screenshots/typing-indicators.png)
*Real-time typing indicators showing when users are composing messages.*

### Mobile View
![Mobile View](screenshots/mobile-view.png)
*Responsive design working on mobile devices.*

### Test Script Running
![Test Script](screenshots/test-script.png)
*Automated test script simulating multiple users and messages.*

## 📚 Resources

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
