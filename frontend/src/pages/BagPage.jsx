import React from 'react';
import { Link } from 'react-router-dom';
import { useBag } from '../context/BagContext';
import BagItem from '../components/bag/BagItem';
import BagSummary from '../components/bag/BagSummary';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export const BagPage = () => {
  const {
    items,
    updateQuantity,
    removeFromBag,
    clearBag,
    totalItems,
    subtotal,
    totalSavings
  } = useBag();

  if (items.length === 0) {
    return (
      <div className="section" style={{ minHeight: '70vh', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <EmptyState
            icon="🛍️"
            title="Your Shopping Bag is Empty"
            description="You haven't added any clothing pieces yet. Explore our latest arrivals in formal shirts, chinos, denim, and celebratory ethnic wear."
            actionText="Start Shopping"
            actionLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="section-eyebrow">Review Selected Pieces</span>
          <h1 style={{ marginBottom: '0.5rem' }}>Shopping Bag ({totalItems})</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review your sizes, colours, and quantities before completing your order inquiry with MR SM Store.
          </p>
        </div>

        {/* Demo Disclaimer Banner */}
        <div
          style={{
            backgroundColor: 'var(--color-latte)',
            border: '1px solid var(--color-latte-dark)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ fontSize: '0.875rem', color: 'var(--color-espresso)' }}>
            💡 <strong>Demo Presentation:</strong> This cart simulates the client shopping experience. No credit cards or real payments are processed.
          </div>
          <Link to="/shop">
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-mocha)', textDecoration: 'underline' }}>
              + Continue Shopping
            </span>
          </Link>
        </div>

        {/* Two-Column Grid: Bag Items vs Order Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}
          className="bag-layout-grid"
        >
          {/* Left: Items List */}
          <div style={{ flex: '1 1 60%' }}>
            {items.map((item) => (
              <BagItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromBag}
              />
            ))}

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/shop">
                <Button variant="outline" size="sm">
                  ← Add More Products
                </Button>
              </Link>
              <button
                type="button"
                onClick={clearBag}
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--status-error)',
                  textDecoration: 'underline'
                }}
              >
                Clear All Items
              </button>
            </div>
          </div>

          {/* Right: Order Summary Box */}
          <div style={{ flex: '1 1 40%' }}>
            <BagSummary
              items={items}
              totalItems={totalItems}
              subtotal={subtotal}
              totalSavings={totalSavings}
              onClearBag={clearBag}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BagPage;
