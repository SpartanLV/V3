import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const Gradesheet = () => {
  const { courseId } = useParams();
  const [grade, setGrade] = useState(null);
  
  useEffect(() => {
    api.get(`/grades/${courseId}`)
      .then(res => setGrade(res.data))
      .catch(err => console.error(err));
  }, [courseId]);

  if (!grade) return <p>Loading grades...</p>;

  return (
    <div>
      <h2>Grades for Course {courseId}</h2>
      <p>Score: {grade.score}</p>
      <Link to={`student/courses/${courseId}/review`}>Leave a Review</Link>
    </div>
  );
};

export default Gradesheet;