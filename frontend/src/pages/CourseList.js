import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import CourseSearch from '../components/CourseSearch';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = (params = {}) => {
    api.get('/courses', { params })
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <CourseSearch onSearch={fetchCourses} />
      <ul>
        {courses.map(course => (
          <li key={course._id}>
            <Link to={`/student/courses/${course._id}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;