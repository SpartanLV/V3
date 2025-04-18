import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api'; // Axios setup
import './styling.css'; // Import the CSS file

const ManageCourses = ({ mode }) => {
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '', code: '', description: '', credits: 3, faculty: ''
  });
  const [editData, setEditData] = useState({
    title: '', code: '', description: '', credits: 3, faculty: ''
  });

  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFaculty();
    fetchCourses();
    if (mode === 'edit' && courseId) {
      fetchCourseById(courseId);
    }
  }, [mode, courseId]);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const fetchCourseById = async (id) => {
    try {
      const res = await api.get(`/admin/courses/${id}`);
      setEditData(res.data);
    } catch (err) {
      console.error('Failed to fetch course:', err);
    }
  };

  const fetchFaculty = async () => {
    try {
      const res = await api.get('/admin/users');
      const facultyOnly = res.data.filter(user => user.role === 'faculty');
      setFacultyList(facultyOnly);
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const courseToAdd = { ...newCourse, faculty: newCourse.faculty };
      await api.post('/admin/courses', courseToAdd);
      setNewCourse({ title: '', code: '', description: '', credits: 3, faculty: '' });
      fetchCourses();
      navigate('/admin/courses');
    } catch (err) {
      console.error('Failed to add course:', err.response?.data || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const courseToUpdate = { ...editData, faculty: editData.faculty };
      await api.put(`/admin/courses/${courseId}`, courseToUpdate);
      setEditData({ title: '', code: '', description: '', credits: 3, faculty: '' });
      navigate('/admin/courses');
    } catch (err) {
      console.error('Failed to update course:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error('Failed to delete course:', err.response?.data || err.message);
    }
  };

  const facultySelect = (value, onChange) => (
    <select className="faculty-select" value={value} onChange={onChange} required>
      <option value="">Select Faculty</option>
      {facultyList.map((fac) => (
        <option key={fac._id} value={fac._id}>{fac.name}</option>
      ))}
    </select>
  );

  if (mode === 'add') {
    return (
      <div className="manage-courses-container">
        <h2>Add New Course</h2>
        <form onSubmit={handleAdd} className="course-form">
          <input
            required
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            placeholder="Course Title"
            className="form-input"
          />
          <input
            required
            value={newCourse.code}
            onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            placeholder="Course Code"
            className="form-input"
          />
          <textarea
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            placeholder="Course Description"
            className="form-textarea"
          />
          <input
            type="number"
            value={newCourse.credits}
            onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
            placeholder="Credits"
            className="form-input"
          />
          {facultySelect(newCourse.faculty, (e) => setNewCourse({ ...newCourse, faculty: e.target.value }))}
          <div className="form-actions">
            <button type="submit" className="btn btn-add">Add Course</button>
            <button type="button" className="btn btn-cancel" onClick={() => navigate('/admin/courses')}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  if (mode === 'edit') {
    return (
      <div className="manage-courses-container">
        <h2>Edit Course</h2>
        <form onSubmit={handleUpdate} className="course-form">
          <input
            required
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Course Title"
            className="form-input"
          />
          <input
            required
            value={editData.code}
            onChange={(e) => setEditData({ ...editData, code: e.target.value })}
            placeholder="Course Code"
            className="form-input"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Course Description"
            className="form-textarea"
          />
          <input
            type="number"
            value={editData.credits}
            onChange={(e) => setEditData({ ...editData, credits: parseInt(e.target.value) })}
            placeholder="Credits"
            className="form-input"
          />
          {facultySelect(editData.faculty, (e) => setEditData({ ...editData, faculty: e.target.value }))}
          <div className="form-actions">
            <button type="submit" className="btn btn-update">Update Course</button>
            <button type="button" className="btn btn-cancel" onClick={() => navigate('/admin/courses')}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="manage-courses-container">
      <h2>All Courses</h2>
      <button className="btn btn-add" onClick={() => navigate('/admin/courses/add')}>Add New Course</button>
      <ul className="course-list">
        {courses.map((course) => (
          <li key={course._id} className="course-item">
            <div className="course-details">
              <strong>{course.title}</strong> ({course.code}) - {course.description}
              <br />
              <span>Faculty: {course.faculty.name}</span>
            </div>
            <div className="course-actions">
              <button onClick={() => navigate(`/admin/courses/edit/${course._id}`)} className="btn btn-edit">Edit</button>
              <button onClick={() => handleDelete(course._id)} className="btn btn-delete">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCourses;
