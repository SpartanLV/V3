// frontend/src/pages/Messages.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import ChatBox from '../components/ChatBox';

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode(token);
      console.log('Messages.js -> decoded JWT payload:', decoded);
      setCurrentUserId(decoded.Id);

      try {
        const res = await api.get('/users');
        console.log('Messages.js -> fetched users:', res.data);
        const filtered = res.data.filter(user => user._id !== decoded.Id);
        setUsers(filtered);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ display: 'flex', height: '80vh', padding: 16 }}>
      <div
        style={{
          width: 250,
          borderRight: '1px solid #ccc',
          paddingRight: 12,
          overflowY: 'auto',
        }}
      >
        <h3>Contacts</h3>
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            style={{
              padding: 8,
              cursor: 'pointer',
              backgroundColor: selectedUser?._id === user._id ? '#e3f2fd' : 'transparent',
              borderRadius: '4px',
              marginBottom: '8px',
            }}
          >
            {user.name || user.email}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, paddingLeft: 12 }}>
        {selectedUser ? (
          <>
            <h4>Chatting with {selectedUser.name || selectedUser.email}</h4>
            <ChatBox
            recipient={selectedUser}
            currentUserId = {currentUserId}/>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
