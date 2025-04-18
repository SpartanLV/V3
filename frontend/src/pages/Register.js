import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { inferRoleFromEmail } from '../utils/roleUtils';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validate email domain for role
    const role = inferRoleFromEmail(form.email);
    if (!role) {
      setError('Please use a @g.bracu.ac.bd (student) or @bracu.ac.bd (staff) email.');
      return;
    }
  
    console.log("Registering with:", form);
    console.log("Inferred role:", role);
    
    try {
      // Send form data, including role, to backend
      console.log("Form data before registration:", form)
      const response = await api.post('/auth/register', { ...form, role });
      console.log("Registration success:", response.data);

      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />

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

      <button type="submit">Register</button>
    </form>
  );
}
