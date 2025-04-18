import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const ManageCourses = ({ mode }) => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', code: '', description: '', credits: 3, faculty: '' });
  const [editData, setEditData] = useState({ title: '', code: '', description: '', credits: 3, faculty: '' });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && courseId) {
      const fetch = async () => {
        try {
          const res = await api.get(`/admin/courses/${courseId}`);
          setEditData({
            title: res.data.title,
            code: res.data.code,
            description: res.data.description,
            credits: res.data.credits,
            faculty: res.data.faculty,
          });
          setEditingCourseId(courseId);
        } catch (err) {
          console.error('Failed to fetch course', err);
        }
      };
      fetch();
    }
  }, [mode, courseId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/courses', newCourse);
      setNewCourse({ title: '', code: '', description: '', credits: 3, faculty: '' });
      fetchCourses();
      navigate('/admin/courses');
    } catch (err) {
      console.error('Failed to add course:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/courses/${editingCourseId}`, editData);
      setEditData({ title: '', code: '', description: '', credits: 3, faculty: '' });
      setEditingCourseId(null);
      fetchCourses();
      navigate('/admin/courses');
    } catch (err) {
      console.error('Failed to update course:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  if (mode === 'add') {
    return (
      <div>
        <h2>Add Course</h2>
        <form onSubmit={handleAdd}>
          <input
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            placeholder="Course Title"
            required
          />
          <input
            value={newCourse.code}
            onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            placeholder="Course Code"
            required
          />
          <textarea
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            placeholder="Description"
          />
          <input
            value={newCourse.credits}
            onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
            type="number"
            placeholder="Credits"
          />
          <select
            value={newCourse.faculty}
            onChange={(e) => setNewCourse({ ...newCourse, faculty: e.target.value })}
            required
          >
            <option value="">Select Faculty</option>
            {/* Populate faculty options dynamically */}
            {/* Example: Assuming you have a list of faculty options */}
            <option value="facultyId1">Faculty 1</option>
            <option value="facultyId2">Faculty 2</option>
          </select>
          <button type="submit">Add</button>
          <button onClick={() => navigate('/admin/courses')}>Cancel</button>
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
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Course Title"
            required
          />
          <input
            value={editData.code}
            onChange={(e) => setEditData({ ...editData, code: e.target.value })}
            placeholder="Course Code"
            required
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Description"
          />
          <input
            value={editData.credits}
            onChange={(e) => setEditData({ ...editData, credits: e.target.value })}
            type="number"
            placeholder="Credits"
          />
          <select
            value={editData.faculty}
            onChange={(e) => setEditData({ ...editData, faculty: e.target.value })}
            required
          >
            <option value="">Select Faculty</option>
            <option value="facultyId1">Faculty 1</option>
            <option value="facultyId2">Faculty 2</option>
          </select>
          <button type="submit">Update</button>
          <button onClick={() => navigate('/admin/courses')}>Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Manage Courses</h2>
      <button onClick={() => navigate('/admin/courses/add')}>Add New Course</button>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <strong>{course.title}</strong> ({course.code}) - {course.description}
            <button onClick={() => navigate(`/admin/courses/edit/${course._id}`)}>Edit</button>
            <button onClick={() => handleDelete(course._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCourses;
