import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts, submitContactInquiry } from '../services/api';
import { useBag } from '../context/BagContext';
import PriceDisplay, { formatINR } from '../components/common/PriceDisplay';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ProductCard from '../components/product/ProductCard';
import { CheckIcon, BagIcon, PhoneIcon, WhatsAppIcon, CloseIcon, MapPinIcon } from '../components/common/Icons';

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

  // Direct "Book Now" Modal States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingFulfillment, setBookingFulfillment] = useState('pickup'); // 'pickup' | 'delivery'
  const [bookingPayment, setBookingPayment] = useState('pay_at_store');   // 'pay_at_store' | 'upi_card'
  const [bookingErrors, setBookingErrors] = useState({});
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        setIsError(false);
        setValidationError('');
        setAddedSuccess(false);

        const data = await getProductById(id);

        if (!data) {
          if (isMounted) setIsError(true);
          return;
        }

        if (isMounted) {
          setProduct(data);
          setSelectedImage(0);
          setSelectedSize(data.sizes && data.sizes.length === 1 ? data.sizes[0] : '');
          setSelectedColour(data.colours && data.colours.length > 0 ? data.colours[0] : null);
          setQuantity(1);

          // Load related products from same category
          if (data.category?.slug) {
            getProducts({ category: data.category.slug }).then((list) => {
              if (isMounted) {
                setRelatedProducts(list.filter((p) => p._id !== data._id).slice(0, 3));
              }
            });
          }
        }
      } catch (err) {
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProduct();
    return () => { isMounted = false; };
  }, [id]);

  const handleAddToBag = () => {
    if (!selectedSize) {
      setValidationError('Please select a size to continue.');
      return;
    }
    if (!selectedColour) {
      setValidationError('Please select a colour to continue.');
      return;
    }

    setValidationError('');
    const res = addToBag(product, selectedSize, selectedColour, quantity);
    if (res.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }
  };

  const handleOpenBooking = () => {
    if (!selectedSize) {
      setValidationError('Please select a size before booking this piece.');
      return;
    }
    if (!selectedColour) {
      setValidationError('Please select a colour before booking this piece.');
      return;
    }
    setValidationError('');
    setBookingErrors({});
    setBookingSuccessData(null);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!bookingName.trim() || bookingName.trim().length < 2) {
      errs.name = 'Please enter your full name (minimum 2 characters).';
    }
    if (!bookingPhone.trim() || !/^[0-9]{10}$/.test(bookingPhone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (Object.keys(errs).length > 0) {
      setBookingErrors(errs);
      return;
    }

    setIsSubmittingBooking(true);
    const refId = `MRSM-BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const lineTotal = product.price * quantity;

    try {
      await submitContactInquiry({
        name: bookingName.trim(),
        phone: bookingPhone.trim(),
        subject: `Direct Booking: ${product.name} (${refId})`,
        message: `Order Booking [${refId}]: ${product.name} | Size: ${selectedSize} | Colour: ${selectedColour.name} | Qty: ${quantity} | Total: ₹${lineTotal} | Fulfillment: ${bookingFulfillment === 'pickup' ? 'Showroom Trial & Pickup' : 'Home Delivery'} | Payment: ${bookingPayment === 'pay_at_store' ? 'Pay at Store on Pickup' : 'UPI/Online Demo'}`
      });
    } catch (err) {
      console.warn('Booking notification notice:', err);
    } finally {
      setIsSubmittingBooking(false);
      setBookingSuccessData({
        refId,
        customerName: bookingName.trim(),
        customerPhone: bookingPhone.trim(),
        totalAmount: lineTotal,
        fulfillment: bookingFulfillment,
        payment: bookingPayment
      });
    }
  };

  if (isLoading) {
    return (
      <div className="section" style={{ minHeight: '60vh' }}>
        <LoadingSpinner message="Fetching product specifications..." />
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
  const currentTotal = product.price * quantity;

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '2rem'
          }}
        >
          <Link to="/" style={{ color: 'var(--color-mocha)' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'var(--color-mocha)' }}>Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${product.category.slug}`} style={{ color: 'var(--color-mocha)' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: 'var(--color-espresso)', fontWeight: '600' }}>{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '3.5rem',
            marginBottom: '4rem'
          }}
        >
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
                      transition: 'all var(--transition-fast)'
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
                          transition: 'all var(--transition-fast)'
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
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--color-espresso)' }}>
                    Select Size:
                  </span>
                  <span style={{ color: 'var(--color-mocha)', fontWeight: '600' }}>
                    {selectedSize ? `Selected: ${selectedSize}` : 'Required'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                          minWidth: '56px',
                          height: '44px',
                          padding: '0 14px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.9rem',
                          fontWeight: isSelected ? '700' : '500',
                          backgroundColor: isSelected ? 'var(--color-espresso)' : 'var(--color-white)',
                          color: isSelected ? 'var(--color-cream)' : 'var(--color-espresso)',
                          border: isSelected ? '2px solid var(--color-espresso)' : '1px solid var(--border-subtle)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{ display: 'block', fontWeight: '600', fontSize: '0.875rem', marginBottom: '8px' }}>
                Quantity:
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-white)' }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '8px 16px', fontSize: '1.1rem', fontWeight: '700' }}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: '700' }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                  style={{ padding: '8px 16px', fontSize: '1.1rem', fontWeight: '700' }}
                  disabled={quantity >= availableStock}
                >
                  +
                </button>
              </div>
              <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#2E6F40', fontWeight: '600' }}>
                ✓ In Stock ({availableStock} units available)
              </span>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="buy-buttons-grid">
                {/* 1. Add to Bag */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToBag}
                  icon={<BagIcon size={18} />}
                  style={{ width: '100%' }}
                >
                  {addedSuccess ? '✓ In Bag' : 'Add to Bag'}
                </Button>

                {/* 2. Book Now (Direct Checkout / Clothes Booking) */}
                <Button
                  variant="caramel"
                  size="lg"
                  onClick={handleOpenBooking}
                  style={{ width: '100%', fontWeight: '700', letterSpacing: '0.06em' }}
                >
                  ⚡ Book Now
                </Button>
              </div>

              {/* Call and WhatsApp Inquiries */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <a
                  href="tel:+918466007454"
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%' }}
                >
                  <PhoneIcon size={14} /> Call Store
                </a>
                <a
                  href={`https://wa.me/918332867454?text=${encodeURIComponent(`Hi Mr. Shiva Yadav, I am inquiring about "${product.name}" in size ${selectedSize || 'standard'}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-caramel btn-sm"
                  style={{ width: '100%' }}
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
          Direct "BOOK NOW" & Payment Simulation Modal
          ========================================================================= */}
      {showBookingModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              padding: '2rem'
            }}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setShowBookingModal(false)}
              aria-label="Close booking modal"
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                color: 'var(--text-muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <CloseIcon size={22} />
            </button>

            {!bookingSuccessData ? (
              /* Booking Form View */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-caramel">Instant Reservation</span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-espresso)', marginBottom: '4px' }}>
                  Book & Reserve Garment
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Reserve your size and trial directly at <strong>MR SM Multi Brand Store (Hanamkonda)</strong>.
                </p>

                {/* Selected Item Summary Card */}
                <div
                  style={{
                    backgroundColor: 'var(--color-latte-soft)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <img
                    src={images[0]}
                    alt={product.name}
                    style={{ width: '64px', height: '76px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-espresso)', marginBottom: '4px' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span>Size: <strong>{selectedSize}</strong></span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        Colour:
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: selectedColour?.hex || '#000', display: 'inline-block' }} />
                        <strong>{selectedColour?.name}</strong>
                      </span>
                      <span>•</span>
                      <span>Qty: <strong>{quantity}</strong></span>
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-espresso)' }}>
                      Total Amount: {formatINR(currentTotal)}
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleConfirmBooking} noValidate>
                  {/* Customer Full Name */}
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" htmlFor="booking-name">
                      Your Full Name <span style={{ color: 'var(--status-error)' }}>*</span>
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      className="form-input"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                    />
                    {bookingErrors.name && <div className="form-error">{bookingErrors.name}</div>}
                  </div>

                  {/* Customer Phone */}
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" htmlFor="booking-phone">
                      Mobile Number (10 digits) <span style={{ color: 'var(--status-error)' }}>*</span>
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      className="form-input"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                    />
                    {bookingErrors.phone && <div className="form-error">{bookingErrors.phone}</div>}
                  </div>

                  {/* Fulfillment Option */}
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">
                      Fulfillment Method
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <label
                        style={{
                          padding: '10px 12px',
                          border: bookingFulfillment === 'pickup' ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: bookingFulfillment === 'pickup' ? 'var(--color-latte-soft)' : 'var(--color-white)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem'
                        }}
                      >
                        <input
                          type="radio"
                          name="fulfillment"
                          checked={bookingFulfillment === 'pickup'}
                          onChange={() => setBookingFulfillment('pickup')}
                        />
                        <div>
                          <strong>Showroom Trial & Pickup</strong>
                          <div style={{ fontSize: '0.75rem', color: '#2E6F40', fontWeight: '700' }}>FREE</div>
                        </div>
                      </label>

                      <label
                        style={{
                          padding: '10px 12px',
                          border: bookingFulfillment === 'delivery' ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: bookingFulfillment === 'delivery' ? 'var(--color-latte-soft)' : 'var(--color-white)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem'
                        }}
                      >
                        <input
                          type="radio"
                          name="fulfillment"
                          checked={bookingFulfillment === 'delivery'}
                          onChange={() => setBookingFulfillment('delivery')}
                        />
                        <div>
                          <strong>Home Delivery</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Warangal / Hanamkonda</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Payment Method Option */}
                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">
                      Payment Preference
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <label
                        style={{
                          padding: '10px 12px',
                          border: bookingPayment === 'pay_at_store' ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: bookingPayment === 'pay_at_store' ? 'var(--color-latte-soft)' : 'var(--color-white)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem'
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={bookingPayment === 'pay_at_store'}
                          onChange={() => setBookingPayment('pay_at_store')}
                        />
                        <div>
                          <strong>Pay at Store on Pickup</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cash / UPI / GPay</div>
                        </div>
                      </label>

                      <label
                        style={{
                          padding: '10px 12px',
                          border: bookingPayment === 'upi_card' ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: bookingPayment === 'upi_card' ? 'var(--color-latte-soft)' : 'var(--color-white)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem'
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={bookingPayment === 'upi_card'}
                          onChange={() => setBookingPayment('upi_card')}
                        />
                        <div>
                          <strong>Simulated Online Pay</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Demo Simulation</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Demo Disclaimer notice */}
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-mocha)',
                      backgroundColor: 'rgba(196, 138, 90, 0.12)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-xs)',
                      marginBottom: '1.25rem'
                    }}
                  >
                    💡 <strong>Demo Reservation:</strong> This reserves your clothing piece at MR SM Multi Brand Store. No actual credit card charge is processed in demo mode.
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      type="submit"
                      variant="caramel"
                      size="lg"
                      isFullWidth
                      isLoading={isSubmittingBooking}
                    >
                      Confirm Booking ({formatINR(currentTotal)})
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setShowBookingModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              /* Booking Success Confirmation View */
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--status-success-bg)',
                    color: 'var(--status-success)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  <CheckIcon size={32} />
                </div>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-espresso)', marginBottom: '6px' }}>
                  Garment Reserved Successfully!
                </h2>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Your clothing reservation has been registered with MR SM Multi Brand Store.
                </p>

                {/* Booking ID Chip */}
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--color-latte-soft)',
                    border: '1px dashed var(--color-caramel)',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '1.05rem',
                    fontWeight: '800',
                    color: 'var(--color-espresso)',
                    letterSpacing: '0.08em',
                    marginBottom: '1.5rem'
                  }}
                >
                  Booking ID: {bookingSuccessData.refId}
                </div>

                {/* Booking Details Card */}
                <div
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div><strong>Garment:</strong> {product.name} ({selectedSize}, {selectedColour?.name})</div>
                  <div><strong>Quantity:</strong> {quantity} item(s)</div>
                  <div><strong>Total to Pay:</strong> <strong style={{ color: 'var(--color-espresso)', fontSize: '1.05rem' }}>{formatINR(bookingSuccessData.totalAmount)}</strong></div>
                  <div><strong>Customer:</strong> {bookingSuccessData.customerName} ({bookingSuccessData.customerPhone})</div>
                  <div>
                    <strong>Pickup Showroom:</strong> 1st Floor, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda
                  </div>
                </div>

                {/* WhatsApp Direct Action Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href={`https://wa.me/918332867454?text=${encodeURIComponent(`Hi Mr. Shiva Yadav, I have booked "${product.name}" (Size: ${selectedSize}, Colour: ${selectedColour?.name}, Qty: ${quantity}, Total: ${formatINR(bookingSuccessData.totalAmount)}). Booking ID: ${bookingSuccessData.refId}. My Name: ${bookingSuccessData.customerName}, Phone: ${bookingSuccessData.customerPhone}. Please hold this for my showroom trial.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-caramel btn-lg"
                    style={{ width: '100%', gap: '8px', fontWeight: '700' }}
                  >
                    <WhatsAppIcon size={20} /> Send Booking to WhatsApp (Mr. Shiva Yadav)
                  </a>

                  <Button
                    variant="primary"
                    size="md"
                    isFullWidth
                    onClick={() => {
                      setShowBookingModal(false);
                      setBookingSuccessData(null);
                    }}
                  >
                    Done & Continue Browsing
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
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
