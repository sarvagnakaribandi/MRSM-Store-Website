import React, { useState, useEffect } from 'react';
import { getOffers } from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getOffers()
      .then((data) => {
        if (isMounted) setOffers(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="section-eyebrow">Curated Savings</span>
          <h1 style={{ marginBottom: '0.5rem' }}>Promotional Offers & Value Sets</h1>
          <p style={{ maxWidth: '650px', color: 'var(--text-muted)' }}>
            Special price reductions across premium men's cotton shirts, tailored trousers, and festive celebration garments.
          </p>
        </div>

        {/* Demo Disclaimer */}
        <div
          style={{
            backgroundColor: 'var(--color-latte-soft)',
            border: '1px solid var(--border-subtle)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '2rem',
            fontSize: '0.85rem',
            color: 'var(--color-espresso)'
          }}
        >
          🏷️ <strong>Notice:</strong> These promotional prices are sample demonstration discounts designed to showcase store promotions to prospective clients.
        </div>

        {isLoading ? (
          <LoadingSpinner message="Gathering promotional selections..." />
        ) : (
          <ProductGrid
            products={offers}
            emptyTitle="No Active Offers"
            emptyMessage="All items are currently at regular catalog pricing."
          />
        )}
      </div>
    </div>
  );
};

export default OffersPage;
