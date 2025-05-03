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

      <div>
        <h3>Materials</h3>
        {content.materials.map(mat => (
          <div key={mat._id}>
            {/* render based on type */}
            <a href={`http://localhost:5000/uploads/${mat.filename}`} target="_blank" rel="noreferrer">{mat.title}</a>
            <button onClick={handleCompleteUnit}>Mark Complete</button>
          </div>
        ))}
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