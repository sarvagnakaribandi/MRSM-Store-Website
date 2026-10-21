import React from 'react';

/**
 * Formats Indian Currency with comma groupings (e.g., ₹1,499)
 */
export const formatINR = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const PriceDisplay = ({
  price,
  compareAtPrice = null,
  size = 'md',
  showDiscount = true,
  className = ''
}) => {
  const isDiscounted = compareAtPrice && compareAtPrice > price;
  const discountPercent = isDiscounted
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className={`price-display price-display-${size} ${className}`} style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px' }}>
      <span className="price-current" style={{ color: 'var(--color-espresso)', fontWeight: '700' }}>
        {formatINR(price)}
      </span>
      {isDiscounted && (
        <>
          <span
            className="price-compare"
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'line-through',
              fontSize: '0.85em'
            }}
          >
            {formatINR(compareAtPrice)}
          </span>
          {showDiscount && (
            <span
              className="price-discount-badge"
              style={{
                backgroundColor: 'var(--color-caramel-soft)',
                color: 'var(--color-caramel)',
                fontWeight: '700',
                fontSize: '0.75em',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              {discountPercent}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default PriceDisplay;
