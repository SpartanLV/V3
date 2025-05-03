import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import the CSS file
import './CourseSearch.css';

const CourseSearch = () => {
    const [search, setSearch] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCourses = async () => {
        if (search.trim() === '') {
            setCourses([]); // Clear courses if no search term
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get('/api/courses', {
                params: { search },
                withCredentials: true,
            });
            setCourses(res.data);
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Only fetch courses when search input changes, and debounce the requests
        const delayDebounceFn = setTimeout(() => {
            fetchCourses();
        }, 500); // 500ms delay after the user stops typing

        return () => clearTimeout(delayDebounceFn); // Cleanup the previous timeout if input changes
    }, [search]); // Only call fetchCourses when search input changes

    return (
        <div className="container">
            <h2 className="heading">Search Courses</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by course title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            {loading ? (
                <p className="loading">Loading...</p>
            ) : courses.length === 0 && search.trim() !== '' ? (
                <p className="no-results">No courses found.</p>
            ) : (
                <ul className="course-list">
                    {courses.map((course) => (
                        <li key={course._id} className="course-item">
                            <strong>{course.title}</strong> {course.description ? course.description : 'No description available'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CourseSearch;
