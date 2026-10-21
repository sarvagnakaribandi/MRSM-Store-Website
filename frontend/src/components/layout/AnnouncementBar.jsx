import React from 'react';
import { PhoneIcon, WhatsAppIcon, MapPinIcon } from '../common/Icons';

export const AnnouncementBar = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-espresso-dark)',
        color: 'var(--color-latte)',
        fontSize: '0.75rem',
        padding: '6px 16px',
        borderBottom: '1px solid rgba(196, 138, 90, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <MapPinIcon size={14} /> Subedari, Hanamkonda, Warangal
        </span>
        <a
          href="tel:+918466007454"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-latte)'
          }}
        >
          <PhoneIcon size={14} /> +91 8466007454
        </a>
        <a
          href="https://wa.me/918332867454"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#25D366'
          }}
        >
          <WhatsAppIcon size={14} /> WhatsApp: 8332867454
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            backgroundColor: 'var(--color-caramel)',
            color: '#FFFFFF',
            fontSize: '0.65rem',
            padding: '1px 6px',
            borderRadius: '3px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Demo Mode
        </span>
        <span style={{ color: 'var(--color-latte-dark)' }}>
          Presentation Storefront for Client Review
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
