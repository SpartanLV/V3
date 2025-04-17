import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, ListGroup } from 'react-bootstrap';
import api from '../services/api';
import { subscribeToNotifications } from '../services/socket';

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/notifications?userId=${userId}`);
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    fetchNotifications();
    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };
    
    subscribeToNotifications(handleNewNotification);
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(unreadCount - 1);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-notifications">
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && <Badge pill bg="danger">{unreadCount}</Badge>}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <ListGroup variant="flush">
          {notifications.map(notification => (
            <ListGroup.Item 
              key={notification._id}
              action 
              onClick={() => markAsRead(notification._id)}
              className={!notification.read ? 'fw-bold' : ''}
            >
              {notification.message}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;

