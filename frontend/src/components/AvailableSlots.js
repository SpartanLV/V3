// src/components/AvailableSlots.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // optional: add styles

const AvailableSlots = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const res = await axios.get('/api/bookings/available-slots', {
                    withCredentials: true,
                });
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
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvailableSlots;
