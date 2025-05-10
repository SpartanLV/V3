import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProgressBar from '../components/ProgressBar';
import { AuthContext } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [content, setContent] = useState(null);
  const [percent, setPercent] = useState(0);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}/content`)
      .then(res => setContent(res.data))
      .catch(err => console.error(err));

    api.get(`/progress/${id}`)
      .then(res => setPercent(res.data.percent))
      .catch(err => console.error(err));

    api.get('/enrollments', { params: { courseId: id } })
      .then(res => setEnrolled(res.data.length > 0))
      .catch(() => setEnrolled(false));
  }, [id]);

  const handleEnroll = () => {
    api.post('/enrollments', { courseId: id })
      .then(() => setEnrolled(true))
      .catch(err => {
        if (err.response.status === 409) setEnrolled(true);
      });
  };

  const handleCompleteUnit = () => {
    api.patch(`/progress/${id}`, { delta: 1 })
      .then(res => setPercent(res.data.percent))
      .catch(err => console.error(err));
  };

  const handleQuizSubmit = (answers) => {
    api.post(`/courses/${id}/quiz`, { answers })
      .then(() => handleCompleteUnit())
      .catch(err => console.error(err));
  };

  if (!content) return <p>Loading...</p>;

  return (
    <div>
      <h2>{content.title}</h2>
      {!enrolled
        ? <button onClick={handleEnroll}>Enroll</button>
        : <p>Already Enrolled</p>
      }
      <ProgressBar percent={percent} />

      // Update the materials rendering section
      <div>
        <h3>Course Materials</h3>
        {content.materials.length > 0 ? (
          <div className="materials-list">
            {content.materials.map((mat, index) => (
              <div key={mat._id} className="material-item">
                <div className="material-number">{index + 1}.</div>
                <a 
                  href={mat.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="material-link"
                >
                  {mat.title} ({mat.type.toUpperCase()})
                </a>
                {enrolled && (
                  <button 
                    onClick={handleCompleteUnit}
                    className="mark-complete-btn"
                  >
                    ✓ Mark Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-materials">
            <p>No materials available for this course yet.</p>
            {user?.role === 'faculty' && (
              <button 
                onClick={() => navigate(`/faculty/courses/${id}/add-material`)}
                className="add-material-btn"
              >
                Add Material
              </button>
            )}
          </div>
        )}
      </div>

      <div>
        <h3>Pop Quiz</h3>
        {/* simplistic quiz form */}
        <button onClick={() => handleQuizSubmit(/* answers */)}>Submit Quiz</button>
      </div>

      {percent >= 100 && navigate(`/student/courses/${id}/gradesheet`)}
    </div>
  );
};

export default CourseDetail;