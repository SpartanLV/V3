// frontend/src/components/ChatBox.js
import React, { useEffect, useState, useRef } from 'react';
import {
  setupSocket,
  subscribeToMessages,
  subscribeToMessageSent,
  sendMessageWS,
  disconnectSocket,
} from '../services/socket';
import axios from 'axios';

const ChatBox = ({ recipient }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // Scroll to the bottom
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get('/api/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.filter(
          (msg) =>
            (msg.sender === recipient._id || msg.recipient === recipient._id)
        );
        setMessages(filtered);
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    fetchMessages();
    const socket = setupSocket();

    // Listen for incoming messages
    subscribeToMessages((msg) => {
      if (
        msg.sender === recipient._id ||
        msg.recipient === recipient._id
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    subscribeToMessageSent((msg) => {
      if (
        msg.sender === recipient._id ||
        msg.recipient === recipient._id
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [recipient]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
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
              textAlign: msg.sender === recipient._id ? 'left' : 'right',
              marginBottom: 4,
            }}
          >
            <span
              style={{
                background: msg.sender === recipient._id ? '#eee' : '#b3d4fc',
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
        <button type="submit" style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
