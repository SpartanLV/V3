import React from 'react';

const ProgressBar = ({ percent }) => (
  <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px', width: '100%', margin: '10px 0' }}>
    <div style={{ width: `${percent}%`, height: '20px', backgroundColor: '#4caf50', borderRadius: '2px' }} />
    <div style={{ textAlign: 'center', marginTop: '-20px', fontWeight: 'bold' }}>{Math.round(percent)}%</div>
  </div>
);

export default ProgressBar;