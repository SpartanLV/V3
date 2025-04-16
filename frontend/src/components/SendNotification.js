import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';

const SendNotification = () => {
  const [formData, setFormData] = useState({
    recipientType: 'all',
    recipientId: '',
    message: '',
    notificationType: 'info'
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    
    try {
      await api.post('/admin/notifications', formData);
      setSuccess(true);
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
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Recipient Type</Form.Label>
          <Form.Select 
            value={formData.recipientType}
            onChange={(e) => setFormData({...formData, recipientType: e.target.value})}
          >
            <option value="all">All Users</option>
            <option value="user">Specific User</option>
            <option value="role">By Role</option>
          </Form.Select>
        </Form.Group>

        {formData.recipientType !== 'all' && (
          <Form.Group className="mb-3">
            <Form.Label>
              {formData.recipientType === 'user' ? 'User ID' : 'Role'}
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.recipientId}
              onChange={(e) => setFormData({...formData, recipientId: e.target.value})}
              required
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Notification Type</Form.Label>
          <Form.Select
            value={formData.notificationType}
            onChange={(e) => setFormData({...formData, notificationType: e.target.value})}
          >
            <option value="info">Information</option>
            <option value="warning">Warning</option>
            <option value="urgent">Urgent</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Send Notification
        </Button>
      </Form>
    </div>
  );
};

export default SendNotification;