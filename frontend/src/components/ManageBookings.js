import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h3>Manage Bookings</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Facility</th>
            <th>Time Slot</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking._id}>
              <td>{booking.facility}</td>
              <td>
                {new Date(booking.startTime).toLocaleString()} - 
                {new Date(booking.endTime).toLocaleTimeString()}
              </td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBookings;