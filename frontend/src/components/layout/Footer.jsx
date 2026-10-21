import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon, PhoneIcon, WhatsAppIcon, MapPinIcon } from '../common/Icons';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-espresso)',
        color: 'var(--color-cream)',
        borderTop: '3px solid var(--color-caramel)',
        marginTop: 'auto'
      }}
    >
      <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '3rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem'
          }}
        >
          {/* Column 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <LogoIcon size={48} />
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    color: 'var(--color-cream)',
                    lineHeight: 1.1
                  }}
                >
                  MR SM
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-caramel)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}
                >
                  Multi Brand Store
                </span>
              </div>
            </div>
            <p style={{ color: 'var(--color-latte)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Curated premium men's clothing store located in Subedari, Hanamkonda. Featuring top quality formal shirts, casuals, trousers, jeans, and ethnic collections.
            </p>
            <div
              style={{
                marginTop: '1rem',
                padding: '0.6rem 0.85rem',
                backgroundColor: 'rgba(231, 214, 193, 0.08)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(231, 214, 193, 0.15)',
                fontSize: '0.8rem',
                color: 'var(--color-latte)'
              }}
            >
              <strong>Proprietor:</strong> Mr. Shiva Yadav
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--color-caramel)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              Explore Store
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'Store Home', path: '/' },
                { label: 'All Collections', path: '/shop' },
                { label: 'New Arrivals', path: '/new-arrivals' },
                { label: 'Seasonal Offers', path: '/offers' },
                { label: 'Track My Orders', path: '/my-orders' },
                { label: 'About MR SM', path: '/about' },
                { label: 'Store Visit & Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    style={{
                      color: 'var(--color-latte)',
                      fontSize: '0.9rem',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--color-caramel)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--color-latte)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Men's Categories */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--color-caramel)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              Men's Categories
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                'Formal Cotton Shirts',
                'Casual Shirts & Polos',
                'Tailored Trousers & Chinos',
                'Stretch Denim Jeans',
                'Ethnic Kurtas & Waistcoats',
                'Blazers & Occasion Wear'
              ].map((cat, idx) => (
                <li key={idx}>
                  <Link
                    to="/shop"
                    style={{
                      color: 'var(--color-latte)',
                      fontSize: '0.9rem',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--color-caramel)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--color-latte)')}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Verified Store Contact */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--color-caramel)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              Visit Our Store
            </h4>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-latte)',
                lineHeight: 1.5,
                marginBottom: '1rem',
                display: 'flex',
                gap: '8px'
              }}
            >
              <MapPinIcon size={18} style={{ color: 'var(--color-caramel)', flexShrink: 0, marginTop: '2px' }} />
              <span>
                1st Floor, 24-7-302/1, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda, Warangal
              </span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a
                href="tel:+918466007454"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--color-cream)',
                  fontSize: '0.9rem'
                }}
              >
                <PhoneIcon size={16} style={{ color: 'var(--color-caramel)' }} />
                <span>+91 8466007454</span>
              </a>

              <a
                href="https://wa.me/918332867454"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#25D366',
                  fontSize: '0.9rem'
                }}
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp: 8332867454</span>
              </a>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-latte-dark)', marginTop: '0.5rem' }}>
                <strong>Store Hours:</strong> 10:00 AM – 9:30 PM (Daily)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(231, 214, 193, 0.15)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--color-latte)'
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong>MR SM Multi Brand Store</strong>. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: 'rgba(196, 138, 90, 0.2)',
                color: 'var(--color-caramel)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-xs)',
                fontWeight: '600'
              }}
            >
              Demo Presentation
            </span>
            <span>Simulated storefront for client review & feedback</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
