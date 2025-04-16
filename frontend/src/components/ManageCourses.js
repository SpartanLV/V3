import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/admin/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Title</th>
          <th>Credits</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {courses.map(course => (
          <tr key={course._id}>
            <td>{course.code}</td>
            <td>{course.title}</td>
            <td>{course.credits}</td>
            <td>{course.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ManageCourses;