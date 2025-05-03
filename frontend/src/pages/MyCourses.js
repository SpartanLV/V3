// frontend/src/pages/MyCourses.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    api.get('/enrollments')   // returns [{ course: { _id, title, … } }, …]
      .then(res => setEnrollments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>My Courses</h2>
      {enrollments.length === 0
        ? <p>You haven’t enrolled in any courses yet.</p>
        : (
          <ul>
            {enrollments.map(enr => (
              <li key={enr._id}>
                <Link to={`/student/courses/${enr.course._id}`}>
                  {enr.course.title}
                </Link>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
};

export default MyCourses;
