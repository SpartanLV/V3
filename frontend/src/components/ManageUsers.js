import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './styling.css'; // Unified styling

const ManageUsers = ({ mode }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
  const [editUser, setEditUser] = useState({ name: '', email: '', role: '' });
  const { userId } = useParams();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && userId) {
      const u = users.find((u) => u._id === userId);
      if (u) setEditUser({ name: u.name, email: u.email, role: u.role });
    }
  }, [mode, userId, users]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newUser);
      setNewUser({ name: '', email: '', password: '', role: '' });
      fetchUsers();
      navigate('/admin/users');
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${userId}`, editUser);
      setEditUser({ name: '', email: '', role: '' });
      fetchUsers();
      navigate('/admin/users');
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const renderForm = (isEdit = false) => {
    const user = isEdit ? editUser : newUser;
    const setUser = isEdit ? setEditUser : setNewUser;
    const handleSubmit = isEdit ? handleUpdate : handleAdd;

    return (
      <div className="manage-users-container">
        <h2>{isEdit ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <input
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
            required
          />
          {!isEdit && (
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Password"
              required
            />
          )}
          <input
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            placeholder="Role"
            required
          />
          <div className="form-buttons">
            <button type="submit" className={`btn ${isEdit ? 'btn-update' : 'btn-add'}`}>
              {isEdit ? 'Update User' : 'Add User'}
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => navigate('/admin/users')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  if (mode === 'add') return renderForm(false);
  if (mode === 'edit') return renderForm(true);

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>
      <button className="btn btn-add" onClick={() => navigate('/admin/users/add')}>
        Add New User
      </button>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user._id} className="user-item">
            <strong>{user.name}</strong> ({user.email}) - {user.role}
            <div className="user-actions">
              <button
                className="btn btn-edit"
                onClick={() => navigate(`/admin/users/edit/${user._id}`)}
              >
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(user._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
