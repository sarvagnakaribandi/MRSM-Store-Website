import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/api';
import { useBag } from '../context/BagContext';
import PriceDisplay from '../components/common/PriceDisplay';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ProductCard from '../components/product/ProductCard';
import SizeChart from '../components/product/SizeChart';
import CheckoutModal from '../components/checkout/CheckoutModal';
import {
  BagIcon,
  PhoneIcon,
  WhatsAppIcon
} from '../components/common/Icons';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToBag } = useBag();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColour, setSelectedColour] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Multi-step "Book Now" Checkout Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsError(false);
    setSelectedSize('');
    setSelectedColour(null);
    setQuantity(1);
    setSelectedImage(0);
    setValidationError('');
    setAddedSuccess(false);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    getProductById(id)
      .then((data) => {
        if (!isMounted) return;
        setProduct(data);

        // Pre-select first available colour
        if (data.colours && data.colours.length > 0) {
          setSelectedColour(data.colours[0]);
        }

        // Fetch complementary products in the same category
        if (data.category?.slug) {
          getProducts({ category: data.category.slug, limit: 4 })
            .then((res) => {
              if (isMounted) {
                const filtered = (res.products || []).filter((p) => p._id !== data._id).slice(0, 3);
                setRelatedProducts(filtered);
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error('Error fetching product details:', err);
        if (isMounted) setIsError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle standard "Add to Bag"
  const handleAddToBag = () => {
    if (!selectedSize) {
      setValidationError('Please select a size to add this garment to your bag.');
      return;
    }

    if (product.colours && product.colours.length > 0 && !selectedColour) {
      setValidationError('Please select a colour.');
      return;
    }

    setValidationError('');
    addToBag(product, selectedSize, selectedColour?.name || 'Default', quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  // Handle "⚡ Book Now" -> Opens multi-step CheckoutModal
  const handleOpenBooking = () => {
    if (!selectedSize) {
      setValidationError('Please select a size first to book this piece.');
      return;
    }

    if (product.colours && product.colours.length > 0 && !selectedColour) {
      setValidationError('Please choose a preferred colour.');
      return;
    }

    setValidationError('');
    setShowBookingModal(true);
  };

  if (isLoading) {
    return (
      <div className="section" style={{ minHeight: '60vh' }}>
        <LoadingSpinner message="Fetching garment specifications..." />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="section" style={{ minHeight: '60vh' }}>
        <div className="container">
          <ErrorMessage
            title="Product Not Found"
            message={`We could not locate the requested product with ID "${id}". It may have been removed or updated.`}
          />
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/shop">
              <Button variant="primary">Return to Shop</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80'];

  const availableStock = typeof product.stock === 'number' ? product.stock : 10;

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '6px 8px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
            lineHeight: '1.4'
          }}
        >
          <Link to="/" style={{ color: 'var(--color-mocha)', whiteSpace: 'nowrap' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'var(--color-mocha)', whiteSpace: 'nowrap' }}>Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${product.category.slug}`} style={{ color: 'var(--color-mocha)', whiteSpace: 'nowrap' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span
            style={{
              color: 'var(--color-espresso)',
              fontWeight: '600',
              wordBreak: 'break-word'
            }}
          >
            {product.name}
          </span>
        </nav>

        {/* Product Details Grid */}
        <div className="product-details-grid">
          {/* Left: Product Images Gallery */}
          <div>
            {/* Main Active Image */}
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--border-subtle)',
                aspectRatio: '3 / 4',
                marginBottom: '1rem',
                position: 'relative'
              }}
            >
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {product.isNewArrival && <Badge variant="caramel">New Arrival</Badge>}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <Badge variant="sale">Promotional Offer</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '74px',
                      height: '90px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                      padding: 0,
                      opacity: selectedImage === idx ? 1 : 0.65,
                      transition: 'all var(--transition-fast)',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Buy Box & Options */}
          <div>
            {/* Category */}
            {product.category?.name && (
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: 'var(--color-caramel)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px'
                }}
              >
                {product.category.name}
              </div>
            )}

            {/* Product Title */}
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                color: 'var(--color-espresso)',
                marginBottom: '1rem',
                lineHeight: 1.2
              }}
            >
              {product.name}
            </h1>

            {/* Price Row */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <PriceDisplay
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                size="lg"
              />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Inclusive of all applicable taxes • Free store pickup & trial available
              </div>
            </div>

            {/* Colour Selector */}
            {Array.isArray(product.colours) && product.colours.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--color-espresso)' }}>
                    Select Colour:
                  </span>
                  <span style={{ color: 'var(--color-mocha)', fontWeight: '600' }}>
                    {selectedColour ? selectedColour.name : 'Choose below'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.colours.map((c, idx) => {
                    const isSelected = selectedColour?.name === c.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedColour(c);
                          setValidationError('');
                        }}
                        title={c.name}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--color-latte-soft)' : 'var(--color-white)',
                          border: isSelected ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? '700' : '500',
                          color: 'var(--color-espresso)',
                          transition: 'all var(--transition-fast)',
                          cursor: 'pointer'
                        }}
                      >
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: c.hex,
                            border: '1px solid rgba(0,0,0,0.15)',
                            display: 'inline-block'
                          }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px', marginBottom: '8px', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--color-espresso)' }}>
                    Select Size:
                  </span>
                  <span style={{ color: 'var(--color-mocha)', fontWeight: '600' }}>
                    {selectedSize ? `Selected: ${selectedSize}` : 'Required'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          setSelectedSize(sz);
                          setValidationError('');
                        }}
                        style={{
                          minWidth: '48px',
                          height: '42px',
                          padding: '0 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? '700' : '500',
                          backgroundColor: isSelected ? 'var(--color-espresso)' : 'var(--color-white)',
                          color: isSelected ? 'var(--color-cream)' : 'var(--color-espresso)',
                          border: isSelected ? '2px solid var(--color-espresso)' : '1px solid var(--border-subtle)',
                          transition: 'all var(--transition-fast)',
                          cursor: 'pointer'
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                {/* Size Chart Component (Placed directly below Select Size, as requested) */}
                <SizeChart
                  categorySlug={product.category?.slug || ''}
                  sizes={product.sizes}
                />
              </div>
            )}

            {/* Quantity Stepper */}
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{ display: 'block', fontWeight: '600', fontSize: '0.875rem', marginBottom: '8px' }}>
                Quantity:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-white)' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ padding: '8px 14px', fontSize: '1.1rem', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: '700' }}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                    style={{ padding: '8px 14px', fontSize: '1.1rem', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }}
                    disabled={quantity >= availableStock}
                  >
                    +
                  </button>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#2E6F40', fontWeight: '600', wordBreak: 'break-word' }}>
                  ✓ In Stock ({availableStock} units available)
                </span>
              </div>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div
                style={{
                  backgroundColor: 'var(--status-error-bg)',
                  border: '1px solid #F5C6CB',
                  color: 'var(--status-error)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  marginBottom: '1.25rem'
                }}
              >
                ⚠️ {validationError}
              </div>
            )}

            {/* Action Buttons: Add to Bag + BOOK NOW */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }} className="buy-buttons-grid">
                {/* 1. Add to Bag */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToBag}
                  icon={<BagIcon size={18} />}
                  style={{ width: '100%', fontSize: '0.9rem', padding: '0.75rem 0.6rem', whiteSpace: 'nowrap', justifyContent: 'center' }}
                >
                  {addedSuccess ? '✓ In Bag' : 'Add to Bag'}
                </Button>

                {/* 2. Book Now (Direct Multi-step Checkout) */}
                <Button
                  variant="caramel"
                  size="lg"
                  onClick={handleOpenBooking}
                  style={{ width: '100%', fontWeight: '700', letterSpacing: '0.04em', fontSize: '0.9rem', padding: '0.75rem 0.6rem', whiteSpace: 'nowrap', justifyContent: 'center' }}
                >
                  ⚡ Book Now
                </Button>
              </div>

              {/* Call and WhatsApp Inquiries */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <a
                  href="tel:+918466007454"
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem 0.4rem', whiteSpace: 'nowrap' }}
                >
                  <PhoneIcon size={14} /> Call Store
                </a>
                <a
                  href={`https://wa.me/918332867454?text=${encodeURIComponent(`Hi Mr. Shiva Yadav, I am inquiring about "${product.name}" in size ${selectedSize || 'standard'}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-caramel btn-sm"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem 0.4rem', whiteSpace: 'nowrap' }}
                >
                  <WhatsAppIcon size={14} /> WhatsApp Store
                </a>
              </div>
            </div>

            {/* Store Information Box */}
            <div
              style={{
                backgroundColor: 'var(--color-latte-soft)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ fontWeight: '700', color: 'var(--color-espresso)', marginBottom: '4px' }}>
                Store Visit & Sizing Assistance
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Want to try this on? Visit <strong>MR SM Multi Brand Store</strong> at Subedari, Hanamkonda (Opp. Royal Enfield Showroom). Our team will assist with custom fit and adjustments.
              </p>
            </div>
          </div>
        </div>

        {/* Product Specification Tabs / Details */}
        <div
          style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            marginBottom: '4rem'
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '1rem' }}>
            Product Specifications & Details
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-mocha)', marginBottom: '4px' }}>
                Fabric Composition
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-espresso)' }}>
                {product.fabric || '100% Premium Cotton Blend'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-mocha)', marginBottom: '4px' }}>
                Fit Type
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-espresso)' }}>
                {product.fit || 'Tailored Modern Fit'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-mocha)', marginBottom: '4px' }}>
                Care Guide
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-espresso)' }}>
                {product.careInstructions || 'Machine wash cold with like colours'}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="section-header" style={{ textAlign: 'left', margin: '0 0 2rem 0' }}>
              <span className="section-eyebrow">Complementary Styles</span>
              <h2 className="section-title">You May Also Like</h2>
            </div>
            <div className="grid-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          UNIFIED MULTI-STEP CHECKOUT MODAL (Book Now)
          Address -> Payment Method -> UPI QR Screen -> Payment Success -> Order Placed Success Card
          ========================================================================= */}
      {showBookingModal && (
        <CheckoutModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          items={[
            {
              product,
              name: product.name,
              size: selectedSize,
              colour: selectedColour?.name || 'Standard',
              quantity,
              price: product.price,
              image: images[0]
            }
          ]}
        />
      )}

      <style>{`
        @media (max-width: 640px) {
          .buy-buttons-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailsPage;
