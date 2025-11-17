import { useState, useRef, useEffect } from 'react';

function MessageInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      onTyping(false);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: '0.75rem',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          fontSize: '1rem',
        }}
        autoFocus
      />
      <button
        type="submit"
        disabled={!message.trim()}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: message.trim() ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: message.trim() ? 'pointer' : 'not-allowed',
        }}
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;
