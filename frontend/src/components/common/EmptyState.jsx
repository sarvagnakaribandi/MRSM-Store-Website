import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export const EmptyState = ({
  icon = '🛍️',
  title = 'No products found',
  description = 'Try adjusting your search query or removing filters to see available collections.',
  actionText = 'View All Products',
  actionLink = '/shop',
  onAction = null
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 style={{ color: 'var(--color-espresso)' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{description}</p>
      {onAction ? (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      ) : actionLink ? (
        <Link to={actionLink}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
