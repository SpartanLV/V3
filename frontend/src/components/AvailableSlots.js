import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AvailableSlots = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get('/api/bookings/available-slots');
        setSlots(res.data);
      } catch (err) {
        setError('Failed to fetch slots. Try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlots();
  }, []);

  const handleBooking = async (slotId) => {
    try {
      const res = await axios.post('/api/bookings/book-slot', 
        { slotId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      // Update local state
      setSlots(prev => prev.filter(s => s._id !== slotId));
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading available slots...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="slots-container">
      <h2>Available Slots</h2>
      <div className="slots-grid">
        {slots.map(slot => (
          <div key={slot._id} className="slot-card">
            <div className="slot-header">
              <h3>{slot.facility}</h3>
              <span className="slot-time">
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </span>
            </div>
            <button 
              onClick={() => handleBooking(slot._id)}
              className="book-button"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableSlots;