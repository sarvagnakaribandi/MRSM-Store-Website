import React from 'react';
import Button from './Button';

export const ErrorMessage = ({
  title = 'Something went wrong',
  message = 'Unable to fetch data from the store server. Please verify the backend connection.',
  onRetry = null
}) => {
  return (
    <div className="error-state">
      <h3>{title}</h3>
      <p style={{ color: 'var(--color-espresso)', marginBottom: '1.25rem' }}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
