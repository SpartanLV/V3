import React from 'react';
import { Spinner } from 'react-bootstrap';
import './LoadingSpinner.css'; // Optional styling

const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default LoadingSpinner;