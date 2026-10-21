import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div
      className="section"
      style={{
        backgroundColor: 'var(--bg-primary)',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <div className="container" style={{ maxWidth: '580px' }}>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '6rem',
            fontWeight: '700',
            color: 'var(--color-caramel)',
            lineHeight: 1,
            display: 'block',
            marginBottom: '1rem'
          }}
        >
          404
        </span>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>
          Page Not Found
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          The page or garment collection you are looking for does not exist or may have moved.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/">
            <Button variant="primary">Return to Home</Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline">Browse Catalogue</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
