import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingForm = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    // Fetch available slots from the backend
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get('/api/available-slots');
        setAvailableSlots(response.data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      }
    };

    fetchAvailableSlots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      setBookingStatus('Please select a slot.');
      return;
    }

    try {
      // Send booking data to the backend
      await axios.post('/api/book-slot', { slot: selectedSlot });
      setBookingStatus('Your booking was successful!');
    } catch (error) {
      setBookingStatus('There was an error with your booking. Please try again.');
    }
  };

  return (
    <div>
      <h2>Book a Slot</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="slot">Choose an available slot:</label>
          <select
            id="slot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <option value="">--Select a Slot--</option>
            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.time}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Book Slot</button>
      </form>

      {bookingStatus && <p>{bookingStatus}</p>}
    </div>
  );
};

export default BookingForm;
