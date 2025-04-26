// frontend/src/components/ChatBox.js
import React, { useEffect, useState, useRef } from 'react';
import {
  setupSocket,
  subscribeToMessages,
  subscribeToMessageSent,
  sendMessageWS,
  disconnectSocket,
} from '../services/socket';
import api from '../services/api';

const ChatBox = ({ recipient, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // Scroll to the bottom whenever messages change
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Early bail if we lack either ID
    if (!recipient?._id || !currentUserId) {
      console.warn('ChatBox: missing recipient or current user ID');
      return;
    }

    // 1) Load existing messages
    const fetchMessages = async () => {
      try {
        const res = await api.get('/messages');
        const twoWay = res.data.filter(msg =>
          (msg.sender === currentUserId && msg.recipient === recipient._id) ||
          (msg.sender === recipient._id && msg.recipient === currentUserId)
        );
        setMessages(twoWay);
        scrollToBottom();
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    fetchMessages();

    // 2) Setup socket listeners
    setupSocket();
    const handler = (msg) => {
      // only append if this message is between us
      if (
        (msg.sender === currentUserId && msg.recipient === recipient._id) ||
        (msg.sender === recipient._id && msg.recipient === currentUserId)
      ) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      }
    };
    subscribeToMessages(handler);
    subscribeToMessageSent(handler);

    // 3) Cleanup on unmount or recipient change
    return () => {
      disconnectSocket();
      setMessages([]);  // reset chat window
    };

  }, [recipient, currentUserId]);

  const handleSend = (e) => {
    e.preventDefault();
    // Guard again before sending
    if (!input.trim() || !recipient?._id || !currentUserId) {
      console.warn('ChatBox: missing recipient or current user ID');
      return;
    }
    // send over WebSocket (server will tag sender via token)
    sendMessageWS(recipient._id, input.trim());
    setInput('');
  };

  return (
    <div className="chatbox" style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
      <div style={{ height: 300, overflowY: 'auto', marginBottom: 8 }}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              textAlign: msg.sender === currentUserId ? 'right' : 'left',
              marginBottom: 4,
            }}
          >
            <span
              style={{
                background: msg.sender === currentUserId ? '#b3d4fc' : '#eee',
                padding: '6px 10px',
                borderRadius: 12,
                display: 'inline-block',
                maxWidth: '80%',
                wordWrap: 'break-word',
              }}
            >
              {msg.body}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '8px',
            fontSize: '14px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
