import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './styling.css';

const ManageCourses = ({ mode }) => {
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [materials, setMaterials] = useState([{ title: '', link: '', type: 'pdf' }]);

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
      setMaterials(res.data.materials || []);
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

  const handleMaterialChange = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;
    setMaterials(updated);
  };

  const addMaterial = () => {
    setMaterials([...materials, { title: '', link: '', type: 'pdf' }]);
  };

  const removeMaterial = (index) => {
    const updated = [...materials];
    updated.splice(index, 1);
    setMaterials(updated);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const courseToAdd = { ...newCourse, faculty: newCourse.faculty, materials };
      await api.post('/admin/courses', courseToAdd);
      setNewCourse({ title: '', code: '', description: '', credits: 3, faculty: '' });
      setMaterials([{ title: '', link: '', type: 'pdf' }]);
      fetchCourses();
      navigate('/admin/courses');
    } catch (err) {
      console.error('Failed to add course:', err.response?.data || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const courseToUpdate = { ...editData, faculty: editData.faculty, materials };
      await api.put(`/admin/courses/${courseId}`, courseToUpdate);
      setEditData({ title: '', code: '', description: '', credits: 3, faculty: '' });
      setMaterials([{ title: '', link: '', type: 'pdf' }]);
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

  const renderMaterialInputs = () => (
    <div>
      <h4>Course Materials</h4>
      {materials.map((mat, index) => (
        <div key={index} className="material-row">
          <input
            placeholder="Title"
            value={mat.title}
            onChange={(e) => handleMaterialChange(index, 'title', e.target.value)}
            required
          />
          <input
            placeholder="Link (URL)"
            value={mat.link}
            onChange={(e) => handleMaterialChange(index, 'link', e.target.value)}
            required
          />
          <select
            value={mat.type}
            onChange={(e) => handleMaterialChange(index, 'type', e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
          </select>
          <button type="button" onClick={() => removeMaterial(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addMaterial}>Add Material</button>
    </div>
  );

  const formFields = (data, setData, onSubmit) => (
    <form onSubmit={onSubmit} className="course-form">
      <input
        required
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        placeholder="Course Title"
        className="form-input"
      />
      <input
        required
        value={data.code}
        onChange={(e) => setData({ ...data, code: e.target.value })}
        placeholder="Course Code"
        className="form-input"
      />
      <textarea
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        placeholder="Course Description"
        className="form-textarea"
      />
      <input
        type="number"
        value={data.credits}
        onChange={(e) => setData({ ...data, credits: parseInt(e.target.value) })}
        placeholder="Credits"
        className="form-input"
      />
      {facultySelect(data.faculty, (e) => setData({ ...data, faculty: e.target.value }))}
      {renderMaterialInputs()}
      <div className="form-actions">
        <button type="submit" className="btn btn-add">Save</button>
        <button type="button" className="btn btn-cancel" onClick={() => navigate('/admin/courses')}>Cancel</button>
      </div>
    </form>
  );

  if (mode === 'add') {
    return (
      <div className="manage-courses-container">
        <h2>Add New Course</h2>
        {formFields(newCourse, setNewCourse, handleAdd)}
      </div>
    );
  }

  if (mode === 'edit') {
    return (
      <div className="manage-courses-container">
        <h2>Edit Course</h2>
        {formFields(editData, setEditData, handleUpdate)}
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
              <span>Faculty: {course.faculty?.name || 'N/A'}</span>
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
