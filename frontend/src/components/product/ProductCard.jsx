import React from 'react';
import { Link } from 'react-router-dom';
import PriceDisplay from '../common/PriceDisplay';
import Badge from '../common/Badge';

export const ProductCard = ({ product }) => {
  if (!product) return null;

  const isSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const primaryImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="product-card">
      {/* Image & Badges */}
      <div className="product-card-image-wrap">
        <Link to={`/products/${product._id}`} tabIndex={-1}>
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="product-card-image"
          />
        </Link>

        <div className="product-card-badges">
          {product.isNewArrival && (
            <Badge variant="caramel">New Arrival</Badge>
          )}
          {isSale && (
            <Badge variant="sale">Special Offer</Badge>
          )}
        </div>
      </div>

      {/* Card Details */}
      <div className="product-card-body">
        {product.category?.name && (
          <span className="product-card-category">{product.category.name}</span>
        )}

        <h3 className="product-card-title">
          <Link to={`/products/${product._id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Colours available count preview */}
        {Array.isArray(product.colours) && product.colours.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {product.colours.map((c, i) => (
                <span
                  key={i}
                  title={c.name}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: '1px solid rgba(0,0,0,0.15)',
                    display: 'inline-block'
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {product.colours.length} {product.colours.length === 1 ? 'colour' : 'colours'}
            </span>
          </div>
        )}

        {/* Price Row */}
        <div className="product-card-price-row">
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="md"
          />
        </div>

        {/* Action Link */}
        <div style={{ marginTop: '12px' }}>
          <Link
            to={`/products/${product._id}`}
            className="btn btn-outline btn-sm btn-full"
            style={{ fontSize: '0.75rem' }}
          >
            Select Size & Colour
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
