import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PhoneIcon, WhatsAppIcon, MapPinIcon, ChevronRightIcon } from '../components/common/Icons';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        setIsLoading(true);
        const [cats, featured, arrivals] = await Promise.all([
          getCategories(),
          getProducts({ featured: true }),
          getProducts({ newArrival: true })
        ]);

        if (isMounted) {
          setCategories(cats);
          setFeaturedProducts(featured.slice(0, 4));
          setNewArrivals(arrivals.slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadHomeData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-espresso)',
          color: 'var(--color-cream)',
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: 'linear-gradient(to right, rgba(43, 29, 23, 0.94) 30%, rgba(43, 29, 23, 0.72) 70%, rgba(43, 29, 23, 0.45)), url(https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }}
      >
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div style={{ maxWidth: '650px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(196, 138, 90, 0.25)',
                color: 'var(--color-caramel)',
                border: '1px solid var(--color-caramel)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.8rem',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              Hanamkonda's Multi-Brand Destination
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.15,
                color: 'var(--color-cream)',
                marginBottom: '1.25rem'
              }}
            >
              Tailored Distinction for the Modern Gentleman.
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                color: 'var(--color-latte)',
                lineHeight: 1.6,
                marginBottom: '2rem'
              }}
            >
              Explore handcrafted shirts, executive trousers, premium denim, and occasion wear curated under one roof at <strong>MR SM Multi Brand Store</strong>.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/shop">
                <Button variant="caramel" size="lg">
                  Shop Collection
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" style={{ color: 'var(--color-cream)', borderColor: 'var(--color-latte)' }}>
                  Visit Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Shortcuts */}
      <section className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Curated Collections</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Everyday essentials and occasion wear crafted for comfort, fit, and style.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {categories.map((cat) => (
              <Link
                key={cat.slug || cat._id}
                to={`/shop?category=${cat.slug}`}
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-card)',
                  backgroundImage: `linear-gradient(to top, rgba(43, 29, 23, 0.9) 0%, rgba(43, 29, 23, 0.2) 65%, transparent 100%), url(${cat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform var(--transition-base), box-shadow var(--transition-base)'
                }}
                className="category-card"
              >
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.5rem',
                      color: 'var(--color-cream)',
                      marginBottom: '4px'
                    }}
                  >
                    {cat.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-caramel)',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Explore Collection <ChevronRightIcon size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="section section-latte">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-eyebrow">Handpicked Styles</span>
              <h2 className="section-title" style={{ margin: 0 }}>Featured Menswear</h2>
            </div>
            <Link to="/shop">
              <Button variant="outline" size="sm">
                View All Items
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Promotional Banner (Demo) */}
      <section
        style={{
          backgroundColor: 'var(--color-mocha)',
          color: 'var(--color-cream)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          borderTop: '2px solid var(--color-caramel)',
          borderBottom: '2px solid var(--color-caramel)'
        }}
      >
        <div className="container" style={{ maxWidth: '780px' }}>
          <span
            style={{
              backgroundColor: 'var(--color-caramel)',
              color: 'var(--color-white)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'inline-block',
              marginBottom: '1rem'
            }}
          >
            Sample Demo Offer
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              color: 'var(--color-cream)',
              marginBottom: '1rem'
            }}
          >
            Festive & Executive Season Curation
          </h2>
          <p style={{ color: 'var(--color-latte)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Enjoy up to 25% off sample savings on selected formal cotton shirts and tailored trousers. Visit our Hanamkonda showroom for personalized size fitting.
          </p>
          <Link to="/offers">
            <Button variant="caramel" size="md">
              View Special Offers
            </Button>
          </Link>
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-eyebrow">Latest Additions</span>
              <h2 className="section-title" style={{ margin: 0 }}>Fresh in Store</h2>
            </div>
            <Link to="/new-arrivals">
              <Button variant="outline" size="sm">
                See All New Arrivals
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid-4">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Store Introduction & Verified Location */}
      <section className="section section-latte">
        <div className="container">
          <div className="responsive-split-grid" style={{ alignItems: 'center' }}>
            <div>
              <span className="section-eyebrow">Local Heritage & Quality</span>
              <h2 style={{ marginBottom: '1.25rem' }}>Welcome to MR SM Multi Brand Store</h2>
              <p>
                Founded and managed by <strong>Mr. Shiva Yadav</strong>, MR SM Multi Brand Store provides men in Hanamkonda and Warangal with high-calibre clothing at genuine value.
              </p>
              <p>
                Whether you need crisp two-ply formal shirts for corporate presentations, breathable linen polos for the weekend, or majestic ethnic wear for celebrations, our in-store collection is thoughtfully curated to meet your needs.
              </p>

              <div
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  marginTop: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}>
                  <MapPinIcon size={18} style={{ color: 'var(--color-caramel)', flexShrink: 0 }} />
                  <span>
                    1st Floor, 24-7-302/1, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda, Warangal
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                  <a href="tel:+918466007454" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-espresso)', fontWeight: '600' }}>
                    <PhoneIcon size={16} /> 8466007454
                  </a>
                  <a href="https://wa.me/918332867454" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#25D366', fontWeight: '600' }}>
                    <WhatsAppIcon size={16} /> 8332867454
                  </a>
                </div>
              </div>
            </div>

            <div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                aspectRatio: '4 / 3',
                backgroundImage: 'url(https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </div>
        </div>
      </section>

      <style>{`
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
