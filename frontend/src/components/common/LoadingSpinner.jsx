import React from 'react';

export const LoadingSpinner = ({ message = 'Loading collections...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner" />
      {message && <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
