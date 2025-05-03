import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ReviewForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/reviews', { courseId, facultyId: courseId, rating, comment })
      .then(() => navigate('/'))
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Review Course</h2>
      <label>
        Rating:
        <select value={rating} onChange={e => setRating(e.target.value)}>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <label>
        Comment:
        <textarea value={comment} onChange={e => setComment(e.target.value)} />
      </label>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm