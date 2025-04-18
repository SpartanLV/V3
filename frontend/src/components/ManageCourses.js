import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api'; // Axios setup

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
    fetchFaculty(); // Always fetch faculty list

    if (mode === 'view') fetchCourses();
    if (mode === 'edit' && courseId) fetchCourseById(courseId);
  }, [mode, courseId]);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      console.log('Fetched courses:', res.data);
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
      const res = await api.get('/admin/users'); // Assuming this gets all users with role=faculty
      const facultyOnly = res.data.filter(user => user.role === 'faculty');
      setFacultyList(facultyOnly);
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/courses', newCourse);
      setNewCourse({ title: '', code: '', description: '', credits: 3, faculty: '' });
      fetchCourses(); // Re-fetch the courses to update the list after adding
      navigate('/admin/courses');
    } catch (err) {
      console.error('Failed to add course:', err.response?.data || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/courses/${courseId}`, editData);
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
    <select value={value} onChange={onChange} required>
      <option value="">Select Faculty</option>
      {facultyList.map((fac) => (
        <option key={fac._id} value={fac._id}>{fac.name}</option>
      ))}
    </select>
  );

  const getFacultyNameById = (facultyId) => {
    const faculty = facultyList.find(fac => fac._id === facultyId);
    return faculty ? faculty.name : 'Unknown Faculty';
  };

  if (mode === 'add') {
    return (
      <div>
        <h2>Add New Course</h2>
        <form onSubmit={handleAdd}>
          <input
            required
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            placeholder="Title"
          />
          <input
            required
            value={newCourse.code}
            onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            placeholder="Code"
          />
          <input
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            placeholder="Description"
          />
          <input
            type="number"
            value={newCourse.credits}
            onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
            placeholder="Credits"
          />
          {facultySelect(newCourse.faculty, (e) => setNewCourse({ ...newCourse, faculty: e.target.value }))}
          <button type="submit">Add</button>
          <button type="button" onClick={() => navigate('/admin/courses')}>Cancel</button>
        </form>
      </div>
    );
  }

  if (mode === 'edit') {
    return (
      <div>
        <h2>Edit Course</h2>
        <form onSubmit={handleUpdate}>
          <input
            required
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Title"
          />
          <input
            required
            value={editData.code}
            onChange={(e) => setEditData({ ...editData, code: e.target.value })}
            placeholder="Code"
          />
          <input
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Description"
          />
          <input
            type="number"
            value={editData.credits}
            onChange={(e) => setEditData({ ...editData, credits: parseInt(e.target.value) })}
            placeholder="Credits"
          />
          {facultySelect(editData.faculty, (e) => setEditData({ ...editData, faculty: e.target.value }))}
          <button type="submit">Update</button>
          <button type="button" onClick={() => navigate('/admin/courses')}>Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>All Courses</h2>
      <button onClick={() => navigate('/admin/courses/add')}>Add New Course</button>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <strong>{course.title}</strong> ({course.code}) - {course.description} 
            <br />
            <span>Faculty: {getFacultyNameById(course.faculty)}</span>
            <br />
            <button onClick={() => navigate(`/admin/courses/edit/${course._id}`)}>Edit</button>
            <button onClick={() => handleDelete(course._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCourses;
