import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const ManageUsers = ({ mode }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
  const [editUser, setEditUser] = useState({ name: '', email: '', role: '' });
  const { userId } = useParams();
  const navigate = useNavigate();

  // Fetch all users from the backend
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
      await api.post('/admin/users', newUser); // Call backend controller to add user
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
      await api.put(`/admin/users/${userId}`, editUser); // Call backend controller to update user
      setEditUser({ name: '', email: '', role: '' });
      fetchUsers();
      navigate('/admin/users');
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`); // Call backend controller to delete user
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  if (mode === 'add') {
    return (
      <div>
        <h2>Add User</h2>
        <form onSubmit={handleAdd}>
          <input
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            required
          />
          <input
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Password"
            required
          />
          <input
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            placeholder="Role"
            required
          />
          <button type="submit">Add</button>
          <button onClick={() => navigate('/admin/users')}>Cancel</button>
        </form>
      </div>
    );
  }

  if (mode === 'edit') {
    return (
      <div>
        <h2>Edit User</h2>
        <form onSubmit={handleUpdate}>
          <input
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            placeholder="Email"
            required
          />
          <input
            value={editUser.role}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            placeholder="Role"
            required
          />
          <button type="submit">Update</button>
          <button onClick={() => navigate('/admin/users')}>Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Manage Users</h2>
      <button onClick={() => navigate('/admin/users/add')}>Add New User</button>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.name}</strong> ({user.email}) - {user.role}
            <button onClick={() => navigate(`/admin/users/edit/${user._id}`)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
