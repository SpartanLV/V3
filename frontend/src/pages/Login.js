import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { inferRoleFromEmail } from '../utils/roleUtils';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const role = inferRoleFromEmail(form.email);
    if (!role) {
      setError('Unrecognized domain. Use @g.bracu.ac.bd or @bracu.ac.bd');
      return;
    }

    try {
      const res = await api.post('/auth/login', { ...form, role });
      login(res.data.token, res.data.user);

      // redirect where they came from, or default by role
      const from = location.state?.from?.pathname || (role === 'student' ? '/student/home' : '/admin/users');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <input
        type="email"
        name="email"
        placeholder="BRACU Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Login</button>
    </form>
  );
}
