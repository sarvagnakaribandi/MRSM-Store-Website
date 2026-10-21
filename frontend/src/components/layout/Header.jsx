import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LogoIcon, BagIcon, MenuIcon, CloseIcon } from '../common/Icons';
import { useBag } from '../../context/BagContext';

export const Header = ({ onToggleMobileNav, isMobileNavOpen }) => {
  const { totalItems } = useBag();

  return (
    <header
      style={{
        backgroundColor: 'var(--color-espresso)',
        color: 'var(--color-cream)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)',
        boxShadow: 'var(--shadow-md)',
        borderBottom: '1px solid rgba(231, 214, 193, 0.15)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.85rem',
          paddingBottom: '0.85rem'
        }}
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none'
          }}
        >
          <LogoIcon size={46} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: '700',
                color: 'var(--color-cream)',
                letterSpacing: '0.05em',
                lineHeight: 1.1
              }}
            >
              MR SM
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                fontWeight: '600',
                color: 'var(--color-caramel)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase'
              }}
            >
              Multi Brand Store • Hanamkonda
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}
          className="desktop-nav"
        >
          {[
            { label: 'Home', path: '/' },
            { label: 'Shop', path: '/shop' },
            { label: 'New Arrivals', path: '/new-arrivals' },
            { label: 'Offers', path: '/offers' },
            { label: 'About', path: '/about' },
            { label: 'Contact', path: '/contact' }
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                fontWeight: isActive ? '700' : '500',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--color-caramel)' : 'var(--color-cream)',
                paddingBottom: '4px',
                borderBottom: isActive ? '2px solid var(--color-caramel)' : '2px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Shopping Bag Button */}
          <Link
            to="/bag"
            aria-label={`Shopping Bag with ${totalItems} items`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(231, 214, 193, 0.1)',
              border: '1px solid rgba(231, 214, 193, 0.25)',
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-cream)',
              transition: 'all var(--transition-fast)',
              position: 'relative'
            }}
            className="bag-button"
          >
            <BagIcon size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Bag</span>
            <span
              style={{
                backgroundColor: 'var(--color-caramel)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-full)',
                padding: '2px 7px',
                fontSize: '0.75rem',
                fontWeight: '700',
                lineHeight: 1
              }}
            >
              {totalItems}
            </span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={onToggleMobileNav}
            aria-label="Toggle navigation menu"
            className="mobile-nav-toggle"
            style={{
              display: 'none',
              padding: '6px',
              color: 'var(--color-cream)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(231, 214, 193, 0.2)'
            }}
          >
            {isMobileNavOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
