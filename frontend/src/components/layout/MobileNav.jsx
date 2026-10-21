import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CloseIcon, PhoneIcon, WhatsAppIcon, MapPinIcon, LogoIcon } from '../common/Icons';

export const MobileNav = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-drawer)',
        display: 'flex'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(3px)'
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'relative',
          width: '85%',
          maxWidth: '360px',
          height: '100%',
          backgroundColor: 'var(--color-espresso)',
          color: 'var(--color-cream)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          overflowY: 'auto',
          zIndex: 10
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(231, 214, 193, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogoIcon size={38} />
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: '700' }}>
                MR SM
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-caramel)', letterSpacing: '0.1em' }}>
                MULTI BRAND STORE
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{ color: 'var(--color-cream)', padding: '4px' }}
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { label: 'Home', path: '/' },
            { label: 'Shop Catalogue', path: '/shop' },
            { label: 'New Arrivals', path: '/new-arrivals' },
            { label: 'Exclusive Offers', path: '/offers' },
            { label: 'Shopping Bag', path: '/bag' },
            { label: 'About Store', path: '/about' },
            { label: 'Contact & Location', path: '/contact' }
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.path === '/'}
              style={({ isActive }) => ({
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'var(--color-espresso)' : 'var(--color-cream)',
                backgroundColor: isActive ? 'var(--color-latte)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)'
              })}
            >
              <span>{item.label}</span>
              <span style={{ fontSize: '1.1rem', opacity: 0.6 }}>›</span>
            </NavLink>
          ))}
        </nav>

        {/* Store Verified Information Box in Drawer */}
        <div
          style={{
            marginTop: 'auto',
            padding: '1.5rem',
            borderTop: '1px solid rgba(231, 214, 193, 0.15)',
            backgroundColor: 'var(--color-espresso-dark)'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--color-caramel)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
            Store Location & Contact
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-latte)', marginBottom: '12px', lineHeight: 1.4 }}>
            <MapPinIcon size={14} style={{ display: 'inline', marginRight: '4px' }} />
            1st Floor, 24-7-302/1, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href="tel:+918466007454"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: 'var(--color-cream)'
              }}
            >
              <PhoneIcon size={16} /> Call: 8466007454
            </a>
            <a
              href="https://wa.me/918332867454"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: '#25D366'
              }}
            >
              <WhatsAppIcon size={16} /> WhatsApp: 8332867454
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
