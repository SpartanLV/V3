import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailableSlots = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('12345'); // Example userId, this should be dynamically passed

    // Fetch available slots from the backend
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const res = await axios.get('/api/bookings/available-slots');
                setSlots(res.data);
            } catch (err) {
                setError('Failed to fetch slots.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, []);

    // Handle booking of the slot
    const handleBooking = async (slotId) => {
        try {
            const response = await axios.post('/api/bookings/book-slot', {
                userId,
                slotId,
            });
            alert(response.data.message); // Show success message
        } catch (err) {
            alert(err.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) return <p>Loading available slots...</p>;
    if (error) return <p>{error}</p>;
    if (slots.length === 0) return <p>No available slots right now.</p>;

    return (
        <div className="available-slots-container">
            <h2>Available Booking Slots</h2>
            <ul className="slots-list">
                {slots.map((slot, idx) => (
                    <li key={idx} className="slot-item">
                        <strong>{slot.facility}</strong><br />
                        {new Date(slot.startTime).toLocaleString()} → {new Date(slot.endTime).toLocaleString()}
                        <button
                            onClick={() => handleBooking(slot._id)}
                            className="btn btn-primary"
                        >
                            Book This Slot
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvailableSlots;
