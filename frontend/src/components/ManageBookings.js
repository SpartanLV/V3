// src/components/ManageBookings.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/admin/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      }
    };
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await api.delete(`/admin/bookings/${id}`);
      setBookings(bookings.filter((booking) => booking._id !== id));
    } catch (err) {
      console.error('Failed to cancel booking', err);
    }
  };

  return (
    <div>
      <h2>Manage Field Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Booking Date</th>
            <th>Field</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.date}</td>
              <td>{booking.field}</td>
              <td>
                <button onClick={() => cancelBooking(booking._id)}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBookings;
