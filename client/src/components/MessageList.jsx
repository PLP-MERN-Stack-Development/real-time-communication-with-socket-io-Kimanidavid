import { useEffect, useRef } from 'react';

function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            backgroundColor: message.system ? '#e9ecef' : message.senderId === 'me' ? '#007bff' : '#f8f9fa',
            color: message.system ? '#495057' : message.senderId === 'me' ? 'white' : '#212529',
            alignSelf: message.system ? 'center' : message.senderId === 'me' ? 'flex-end' : 'flex-start',
            maxWidth: '70%',
            wordWrap: 'break-word',
          }}
        >
          {!message.system && (
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              {message.sender}
            </div>
          )}
          <div style={{ fontSize: '1rem' }}>
            {message.message}
          </div>
          {!message.system && (
            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>
              {formatTime(message.timestamp)}
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
