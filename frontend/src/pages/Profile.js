import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';  // Assuming you've set up an API service
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useContext(AuthContext);  // Get the current logged-in user
  const [profile, setProfile] = useState(null);  // User's profile data
  const [isEditing, setIsEditing] = useState(false);  // State to toggle edit mode
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // Fetch profile data on component mount
  useEffect(() => {
    if (user?.role) {
      // Fetch user profile data from the backend
      api
        .get('/users/profile')
        .then((response) => {
          setProfile(response.data);  // Set profile data
          setFormData({
            name: response.data.name,
            email: response.data.email,
            password: '', // Don't expose password
          });
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          navigate('/login');  // Redirect to login if the user isn't authenticated
        });
    }
  }, [user, navigate]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for profile update
  const handleSubmit = (e) => {
    e.preventDefault();

    // Send update request to the backend
    api
      .put('/users/profile', formData)
      .then((response) => {
        setProfile(response.data);  // Update local profile data
        setIsEditing(false);  // Exit edit mode
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  if (!profile) {
    return <LoadingSpinner />; // Show loading spinner while profile is being fetched
  }

  return (
    <div className="profile-container">
      <h2>{user.role === 'student' ? 'Student Profile' : 'Faculty Profile'}</h2>

      {/* If not editing, show profile data */}
      {!isEditing ? (
        <div className="profile-info">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          {/* Add more fields as needed */}
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        // If editing, show form to update profile
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep the current password"
            />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
