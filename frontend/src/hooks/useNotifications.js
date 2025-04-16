import { useState, useEffect } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';

export default function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/notifications?userId=${userId}`);
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => n.status === 'unread').length);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    fetchNotifications();

    // Socket.io for real-time updates
    const socket = io('http://localhost:5000');
    socket.on(`notification-${userId}`, (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => socket.disconnect();
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => 
          n._id === notificationId ? { ...n, status: 'read' } : n
        )
      );
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  return { notifications, unreadCount, markAsRead };
}