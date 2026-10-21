import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { MapPinIcon, PhoneIcon, WhatsAppIcon } from '../components/common/Icons';

export const AboutPage = () => {
  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow">Our Story & Heritage</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1rem' }}>
            About MR SM Multi Brand Store
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Elevating men's fashion in Hanamkonda with superior fabrics, sharp tailoring, and multi-brand diversity.
          </p>
        </div>

        {/* Feature Story Section */}
        <div className="responsive-split-grid" style={{ alignItems: 'center', marginBottom: '4rem' }}>
          <div
            style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              aspectRatio: '4 / 3',
              backgroundImage: 'url(https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1rem' }}>
              The MR SM Philosophy
            </h2>
            <p>
              Under the visionary leadership of <strong>Mr. Shiva Yadav</strong>, <strong>MR SM Multi Brand Store</strong> was founded to provide men in Warangal and Hanamkonda with a refined alternative to crowded generic retail.
            </p>
            <p>
              We believe a well-fitting shirt and sharp trousers are not just clothing — they are a gentleman's everyday armour. By carefully vetting fabrics, stitch counts, collar shapes, and cuts across trusted brand lines, we deliver wardrobe excellence you can see and feel.
            </p>
            <div
              style={{
                backgroundColor: 'var(--color-latte-soft)',
                borderLeft: '4px solid var(--color-caramel)',
                padding: '12px 18px',
                marginTop: '1.25rem',
                fontSize: '0.9rem',
                color: 'var(--color-espresso)'
              }}
            >
              "Our mission is simple: To ensure every man in our city leaves our store feeling confident, comfortably fitted, and dressed for success."
              <br />
              <strong style={{ display: 'block', marginTop: '6px', color: 'var(--color-mocha)' }}>
                — Mr. Shiva Yadav, Proprietor
              </strong>
            </div>
          </div>
        </div>

        {/* 3 Pillars / Values */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <span className="section-eyebrow">Why Shop With Us</span>
            <h2 className="section-title">The Three Pillars of MR SM</h2>
          </div>

          <div className="grid-3">
            {[
              {
                title: 'Multi-Brand Variety',
                icon: '👔',
                desc: 'A versatile spectrum of styles, from 100% Egyptian cotton formal shirts to stretch selvedge denim and festive Bandhgalas.'
              },
              {
                title: 'Fit & Fabric Integrity',
                icon: '📐',
                desc: 'Carefully chosen weaves that maintain breathable comfort in Telangana weather while ensuring crisp, long-lasting structure.'
              },
              {
                title: 'Personalized Service',
                icon: '🤝',
                desc: 'Visit our Subedari showroom for direct styling consultation, size guidance, and attentive in-person customer care.'
              }
            ].map((pillar, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{pillar.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '8px' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Store Location Card & Call to Action */}
        <div
          style={{
            backgroundColor: 'var(--color-espresso)',
            color: 'var(--color-cream)',
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream)', marginBottom: '1rem' }}>
            Visit Our Showroom in Subedari, Hanamkonda
          </h2>
          <p style={{ color: 'var(--color-latte)', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
            Experience our complete collections in person. Located right opposite the Royal Enfield Showroom, beside A to Z Medicals.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/shop">
              <Button variant="caramel">Explore Catalog Online</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" style={{ color: 'var(--color-cream)', borderColor: 'var(--color-latte)' }}>
                Get Store Directions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
