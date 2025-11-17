import { useEffect } from 'react';
import { useSocket } from '../socket/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';

function Chat({ username, onLogout }) {
  const {
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    setTyping,
  } = useSocket();

  useEffect(() => {
    connect(username);
    return () => disconnect();
  }, [username, connect, disconnect]);

  const handleSendMessage = (message) => {
    sendMessage(message);
  };

  const handleTyping = (isTyping) => {
    setTyping(isTyping);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#f8f9fa', borderRight: '1px solid #dee2e6', padding: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Online Users ({users.length})</h3>
          <UserList users={users} />
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '1rem', backgroundColor: '#007bff', color: 'white', borderBottom: '1px solid #dee2e6' }}>
          <h2 style={{ margin: 0 }}>Chat Room</h2>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            Connected as {username} • {isConnected ? '🟢 Online' : '🔴 Offline'}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          <MessageList messages={messages} />
          {typingUsers.length > 0 && (
            <div style={{ fontStyle: 'italic', color: '#666', marginTop: '0.5rem' }}>
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}
        </div>

        {/* Message Input */}
        <div style={{ borderTop: '1px solid #dee2e6', padding: '1rem' }}>
          <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
