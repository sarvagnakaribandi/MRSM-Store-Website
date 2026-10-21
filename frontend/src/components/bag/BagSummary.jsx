import React, { useState } from 'react';
import { formatINR } from '../common/PriceDisplay';
import Button from '../common/Button';
import { PhoneIcon, WhatsAppIcon } from '../common/Icons';
import CheckoutModal from '../checkout/CheckoutModal';

export const BagSummary = ({
  items = [],
  totalItems,
  subtotal,
  totalSavings,
  onClearBag
}) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Delivery is free for store pickup or orders over ₹999
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  return (
    <div
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: '100px'
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.4rem',
          color: 'var(--color-espresso)',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem'
        }}
      >
        Order Summary
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.925rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Items Count:</span>
          <span style={{ fontWeight: '600', color: 'var(--color-espresso)' }}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.925rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
          <span style={{ fontWeight: '600', color: 'var(--color-espresso)' }}>
            {formatINR(subtotal)}
          </span>
        </div>

        {totalSavings > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.925rem' }}>
            <span style={{ color: '#2E6F40' }}>Total MRP Savings:</span>
            <span style={{ fontWeight: '700', color: '#2E6F40' }}>
              − {formatINR(totalSavings)}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.925rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Store Pickup / Shipping:</span>
          <span style={{ fontWeight: '600', color: shippingFee === 0 ? '#2E6F40' : 'var(--color-espresso)' }}>
            {shippingFee === 0 ? 'FREE (Store Pickup)' : formatINR(shippingFee)}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: '1rem',
            borderTop: '2px solid var(--border-subtle)',
            marginTop: '0.5rem'
          }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-espresso)' }}>
            Estimated Total:
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-espresso)' }}>
            {formatINR(grandTotal)}
          </span>
        </div>
      </div>

      {/* Checkout Action Button */}
      <Button
        variant="primary"
        isFullWidth
        size="lg"
        onClick={() => setShowCheckoutModal(true)}
        disabled={totalItems === 0}
        style={{ marginBottom: '1rem', fontWeight: '700', letterSpacing: '0.04em' }}
      >
        Proceed to Checkout ({formatINR(grandTotal)})
      </Button>

      {/* Store Call / WhatsApp Help */}
      <div
        style={{
          backgroundColor: 'var(--color-latte-soft)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.85rem',
          textAlign: 'center'
        }}
      >
        <div style={{ fontWeight: '600', color: 'var(--color-espresso)', marginBottom: '6px' }}>
          Prefer to order by Phone or WhatsApp?
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
          <a
            href="tel:+918466007454"
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            <PhoneIcon size={14} /> Call Store
          </a>
          <a
            href="https://wa.me/918332867454"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-caramel btn-sm"
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            <WhatsAppIcon size={14} /> WhatsApp
          </a>
        </div>
      </div>

      {/* Clear Bag Secondary Action */}
      {totalItems > 0 && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={onClearBag}
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              textDecoration: 'underline',
              cursor: 'pointer',
              background: 'none',
              border: 'none'
            }}
          >
            Empty Shopping Bag
          </button>
        </div>
      )}

      {/* Unified Multi-step Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          items={items.map((it) => ({
            product: { name: it.name, price: it.price },
            name: it.name,
            size: it.size,
            colour: it.colour,
            quantity: it.quantity,
            price: it.price,
            image: it.image
          }))}
          onOrderSuccess={() => {
            if (onClearBag) onClearBag();
          }}
        />
      )}
    </div>
  );
};

export default BagSummary;
