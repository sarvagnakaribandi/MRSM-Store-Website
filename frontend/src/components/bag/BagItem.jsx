import React from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon } from '../common/Icons';
import { formatINR } from '../common/PriceDisplay';

export const BagItem = ({ item, onUpdateQuantity, onRemove }) => {
  const lineTotal = item.price * item.quantity;
  const originalLineTotal = (item.compareAtPrice || item.price) * item.quantity;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr auto',
        gap: '1.25rem',
        padding: '1.25rem',
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem',
        alignItems: 'center'
      }}
      className="bag-item-card"
    >
      {/* Product Image */}
      <Link to={`/products/${item.productId}`}>
        <img
          src={item.image || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80'}
          alt={item.name}
          style={{
            width: '100px',
            height: '120px',
            objectFit: 'cover',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-latte-soft)'
          }}
        />
      </Link>

      {/* Details */}
      <div>
        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '4px' }}>
          <Link
            to={`/products/${item.productId}`}
            style={{ color: 'var(--color-espresso)' }}
          >
            {item.name}
          </Link>
        </h4>

        {/* Selected Variant Attributes */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '10px'
          }}
        >
          <span>
            Size: <strong style={{ color: 'var(--color-espresso)' }}>{item.size}</strong>
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            Colour:
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: item.colour?.hex || '#000',
                display: 'inline-block',
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            />
            <strong style={{ color: 'var(--color-espresso)' }}>{item.colour?.name}</strong>
          </span>
        </div>

        {/* Unit Price */}
        <div style={{ fontSize: '0.9rem', color: 'var(--color-mocha)', marginBottom: '8px' }}>
          Unit Price: <strong>{formatINR(item.price)}</strong>
        </div>

        {/* Quantity Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty:</span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden'
            }}
          >
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              style={{
                padding: '4px 10px',
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-espresso)',
                fontWeight: '700'
              }}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              style={{
                padding: '4px 12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                minWidth: '32px',
                textAlign: 'center'
              }}
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              style={{
                padding: '4px 10px',
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-espresso)',
                fontWeight: '700'
              }}
              aria-label="Increase quantity"
              disabled={item.quantity >= (item.stock || 10)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Line Total & Remove */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-espresso)' }}>
            {formatINR(lineTotal)}
          </div>
          {originalLineTotal > lineTotal && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              {formatINR(originalLineTotal)}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name} from bag`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            color: 'var(--status-error)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-xs)',
            transition: 'background-color var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--status-error-bg)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <TrashIcon size={16} />
          <span>Remove</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .bag-item-card {
            grid-template-columns: 80px 1fr !important;
          }
          .bag-item-card > div:last-child {
            grid-column: 1 / -1;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-top: 1px solid var(--border-subtle);
            padding-top: 8px;
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default BagItem;
