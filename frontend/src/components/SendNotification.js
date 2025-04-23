// src/components/SendNotification.js

import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const SendNotification = () => {
  const [formData, setFormData] = useState({
    recipientType: 'all',   // 'all' | 'user' | 'role'
    recipientId: '',        // will hold userId or role
    message: '',
    notificationType: 'info'
  });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch users once on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        // API might return { users: [...] } or directly an array
        const fetched = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.users)
            ? res.data.users
            : [];
        setUsers(fetched);
      } catch (err) {
        console.error('Could not load users', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    // build payload
    const payload = {
      message: formData.message,
      type: formData.notificationType
    };
    if (formData.recipientType === 'user') {
      payload.userId = formData.recipientId;
    } else if (formData.recipientType === 'role') {
      payload.role = formData.recipientId;
    }
    console.log('Sending to:', api.defaults.baseURL + '/notifications');
    console.log('Sending payload:', payload);
    console.log('Recipient Type:', formData.recipientType);

    try {
      await api.post('/notifications', payload);
      setSuccess(true);
      // reset form
      setFormData({
        recipientType: 'all',
        recipientId: '',
        message: '',
        notificationType: 'info'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send notification');
    }
  };

  return (
    <div className="p-4 border rounded">
      <h4>Send Notification</h4>
      {success && <Alert variant="success">Notification sent successfully!</Alert>}
      {error   && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Recipient Type */}
        <Form.Group className="mb-3">
          <Form.Label>Recipient Type</Form.Label>
          <Form.Select
            value={formData.recipientType}
            onChange={e => setFormData({
              ...formData,
              recipientType: e.target.value,
              recipientId: ''  // clear previous selection
            })}
          >
            <option value="all">All Users</option>
            <option value="user">Specific User</option>
            <option value="role">By Role</option>
          </Form.Select>
        </Form.Group>

        {/* Specific User Selector */}
        {formData.recipientType === 'user' && (
          <Form.Group className="mb-3">
            <Form.Label>Select User</Form.Label>
            {loadingUsers ? (
              <Spinner animation="border" />
            ) : (
              <Form.Select
                required
                value={formData.recipientId}
                onChange={e => setFormData({ ...formData, recipientId: e.target.value })}
              >
                <option value="" disabled>— pick a user —</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
        )}

        {/* Role Selector */}
        {formData.recipientType === 'role' && (
          <Form.Group className="mb-3">
            <Form.Label>Select Role</Form.Label>
            <Form.Select
              required
              value={formData.recipientId}
              onChange={e => setFormData({ ...formData, recipientId: e.target.value })}
            >
              <option value="" disabled>— pick a role —</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
        )}

        {/* Message */}
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            required
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
          />
        </Form.Group>

        {/* Notification Type */}
        <Form.Group className="mb-3">
          <Form.Label>Notification Type</Form.Label>
          <Form.Select
            value={formData.notificationType}
            onChange={e => setFormData({ ...formData, notificationType: e.target.value })}
          >
            <option value="info">Information</option>
            <option value="warning">Warning</option>
            <option value="urgent">Urgent</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit">Send Notification</Button>
      </Form>
    </div>
  );
};

export default SendNotification;
