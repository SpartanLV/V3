import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './styling.css';

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

  const resolveConflict = async (id) => {
    try {
      await api.put(`/admin/bookings/${id}/resolve`);
      setBookings(bookings.map((booking) =>
        booking._id === id ? { ...booking, conflictResolved: true } : booking
      ));
    } catch (err) {
      console.error('Failed to resolve conflict', err);
    }
  };

  return (
    <div className="manage-bookings-container">
      <h2 className="heading">Manage Field Bookings</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Facility</th>
            <th>Booking Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.user ? `${booking.user.name} (${booking.user.email})` : 'Unknown'}</td>
              <td>{booking.facility}</td>
              <td>{`${new Date(booking.startTime).toLocaleString()} - ${new Date(booking.endTime).toLocaleString()}`}</td>
              <td>
                {booking.status === 'cancelled' ? (
                  <span className="status cancelled">Cancelled</span>
                ) : booking.status === 'approved' ? (
                  <span className="status approved">Approved</span>
                ) : (
                  <span className="status">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                )}
              </td>
              <td>
                <div className="action-buttons">
                  {booking.status !== 'cancelled' && (
                    <button className="btn btn-cancel" onClick={() => cancelBooking(booking._id)}>
                      Cancel
                    </button>
                  )}
                  {!booking.conflictResolved && (
                    <button className="btn btn-resolve" onClick={() => resolveConflict(booking._id)}>
                      Resolve Conflict
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBookings;
