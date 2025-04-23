// src/components/NotificationBell.js

import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, ListGroup, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { subscribeToNotifications } from '../services/socket';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // fetch initial notifications for the current user
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/api/notifications/user');
        if (!isMounted) return;
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNotifications();

    // subscribe to real-time notifications
    const unsubscribe = subscribeToNotifications((notification) => {
      // prepend new notification and bump unread count
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(c => c + 1);
    });

    return () => {
      // cleanup on unmount
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" id="dropdown-notifications">
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <Badge pill bg="danger" className="ms-1">
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: '300px' }}>
        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" />
          </div>
        ) : (
          <ListGroup variant="flush">
            {notifications.length === 0 ? (
              <ListGroup.Item className="text-center text-muted">
                No notifications
              </ListGroup.Item>
            ) : notifications.map(n => (
              <ListGroup.Item
                key={n._id}
                action
                onClick={() => markAsRead(n._id)}
                className={!n.read ? 'fw-bold' : ''}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    {/* show notification type */}
                    <Badge bg={
                      n.type === 'urgent' ? 'danger'
                      : n.type === 'warning' ? 'warning'
                      : 'secondary'
                    } pill className="me-2">
                      {n.type.toUpperCase()}
                    </Badge>
                    {n.message}
                  </div>
                  <small className="text-muted">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;
