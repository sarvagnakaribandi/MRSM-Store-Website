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
      {/* ======================================================== */}
      {/* DESKTOP HEADER (Laptops & Desktops: min-width: 1025px)   */}
      {/* 100% Exact & Untouched                                    */}
      {/* ======================================================== */}
      <div
        className="container desktop-header-bar"
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
              className="brand-subtitle"
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
            { label: 'My Orders', path: '/my-orders' },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          {/* My Orders Button */}
          <Link
            to="/my-orders"
            aria-label="View My Orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(231, 214, 193, 0.1)',
              border: '1px solid rgba(231, 214, 193, 0.25)',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-cream)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all var(--transition-fast)'
            }}
          >
            <span>📦</span>
            <span className="orders-label">Orders</span>
          </Link>

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
            <span className="bag-label" style={{ fontSize: '0.85rem', fontWeight: '600' }}>Bag</span>
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
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE HEADER (Phones & Tablets: max-width: 1024px)       */}
      {/* Matches Pic 2 & Pic 3 Reference Exactly                   */}
      {/* Left: 3-line Menu | Center: MR SM Store | Right: Bag      */}
      {/* ======================================================== */}
      <div
        className="container mobile-header-bar"
        style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.65rem',
          paddingBottom: '0.65rem',
          position: 'relative'
        }}
      >
        {/* Left: 3-line Hamburger Menu Button (Pic 2 & Pic 3) */}
        <button
          type="button"
          onClick={onToggleMobileNav}
          aria-label="Toggle navigation menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            border: '1px solid rgba(196, 138, 90, 0.35)',
            backgroundColor: 'rgba(196, 138, 90, 0.1)',
            color: 'var(--color-cream)',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
            transition: 'all 0.2s ease'
          }}
        >
          {isMobileNavOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>

        {/* Center: Luxury Centered Brand Name (Pic 2 & Pic 3) */}
        <Link
          to="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            textDecoration: 'none',
            padding: '0 8px'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: '700',
              color: 'var(--color-cream)',
              letterSpacing: '0.08em',
              lineHeight: 1.1
            }}
          >
            MR SM
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem',
              fontWeight: '600',
              color: 'var(--color-caramel)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginTop: '2px',
              whiteSpace: 'nowrap'
            }}
          >
            MULTI BRAND STORE
          </span>
        </Link>

        {/* Right: Shopping Bag Button (Pic 2 & Pic 3) */}
        <Link
          to="/bag"
          aria-label={`Shopping Bag with ${totalItems} items`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            height: '42px',
            minWidth: '42px',
            padding: '0 10px',
            borderRadius: '8px',
            border: '1px solid rgba(196, 138, 90, 0.35)',
            backgroundColor: 'rgba(196, 138, 90, 0.1)',
            color: 'var(--color-cream)',
            textDecoration: 'none',
            flexShrink: 0,
            transition: 'all 0.2s ease'
          }}
        >
          <BagIcon size={20} />
          <span
            style={{
              backgroundColor: 'var(--color-caramel)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              padding: '2px 6px',
              fontSize: '0.725rem',
              fontWeight: '700',
              lineHeight: 1
            }}
          >
            {totalItems}
          </span>
        </Link>
      </div>

      <style>{`
        /* Desktop & Laptop Browsers: Keep exact horizontal top navigation */
        @media (min-width: 1025px) {
          .desktop-header-bar {
            display: flex !important;
          }
          .mobile-header-bar {
            display: none !important;
          }
        }

        /* Mobile & Tablet Browsers: Switch to clean centered brand with left menu */
        @media (max-width: 1024px) {
          .desktop-header-bar {
            display: none !important;
          }
          .mobile-header-bar {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
