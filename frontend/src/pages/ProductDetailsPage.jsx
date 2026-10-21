import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getProducts, submitContactInquiry } from '../services/api';
import { useBag } from '../context/BagContext';
import PriceDisplay, { formatINR } from '../components/common/PriceDisplay';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ProductCard from '../components/product/ProductCard';
import SizeChart from '../components/product/SizeChart';
import {
  CheckIcon,
  BagIcon,
  PhoneIcon,
  WhatsAppIcon,
  CloseIcon,
  MapPinIcon
} from '../components/common/Icons';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Multi-step "Book Now" Checkout States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = Address, 2 = Payment Method, 3 = Success Card

  // Step 1: Address & Receiver Details (Matches user reference Image 1 & 2)
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('doorstep'); // 'doorstep' | 'store_pickup'
  const [houseNumber, setHouseNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [pincode, setPincode] = useState('506001');
  const [addressType, setAddressType] = useState('Home'); // 'Home' | 'Office' | 'Others'
  const [isDefaultAddress, setIsDefaultAddress] = useState(true);
  const [addressErrors, setAddressErrors] = useState({});

  // Step 2: Payment Method (Matches user reference Image 3)
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'online'
  const [selectedOnlineOption, setSelectedOnlineOption] = useState('phonepe'); // 'phonepe' | 'gpay' | 'cards' | 'netbanking'
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Step 3: Placed Order Success Data
  const [placedOrderData, setPlacedOrderData] = useState(null);

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
    setAddressErrors({});
    setCheckoutStep(1);
    setPlacedOrderData(null);
    setShowBookingModal(true);
  };

  // Step 1 Validation -> Proceed to Payment Step 2
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const errs = {};

    if (!receiverName.trim() || receiverName.trim().length < 2) {
      errs.name = 'Please provide receiver full name.';
    }
    if (!receiverPhone.trim() || !/^[0-9]{10}$/.test(receiverPhone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (deliveryMode === 'doorstep') {
      if (!houseNumber.trim()) {
        errs.houseNumber = 'House number / Flat / Building is required.';
      }
      if (!streetAddress.trim()) {
        errs.streetAddress = 'Locality / Street / Landmark is required.';
      }
      if (!pincode.trim() || !/^[0-9]{6}$/.test(pincode.trim())) {
        errs.pincode = 'Valid 6-digit Pincode is required.';
      }
    }

    if (Object.keys(errs).length > 0) {
      setAddressErrors(errs);
      return;
    }

    setAddressErrors({});
    setCheckoutStep(2); // Advance to Payment Method step
  };

  // Step 2 Action -> Place Order & Trigger Step 3 Success Card
  const handlePlaceOrder = async () => {
    setIsSubmittingOrder(true);
    const orderId = `MRSM-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const originalTotal = (product.compareAtPrice || product.price) * quantity;
    const baseTotal = product.price * quantity;
    const onlineDiscount = paymentMethod === 'online' ? 50 : 0;
    const finalAmount = Math.max(0, baseTotal - onlineDiscount);

    const fullAddress =
      deliveryMode === 'store_pickup'
        ? 'Store Trial & Pickup at 1st Floor, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda'
        : `${houseNumber.trim()}, ${streetAddress.trim()}, Pincode: ${pincode.trim()} (${addressType})`;

    const paymentLabel =
      paymentMethod === 'cod'
        ? deliveryMode === 'store_pickup'
          ? 'Pay at Store upon Trial / Pickup'
          : 'Cash on Delivery (COD)'
        : `Pay Online (Instant UPI - ${selectedOnlineOption.toUpperCase()})`;

    try {
      await submitContactInquiry({
        name: receiverName.trim(),
        phone: receiverPhone.trim(),
        subject: `New Order Placed: ${orderId} (${product.name})`,
        message: `ORDER CONFIRMATION [${orderId}]\nItem: ${product.name}\nSize: ${selectedSize}\nColour: ${selectedColour.name}\nQty: ${quantity}\nTotal Amount: ₹${finalAmount}\nDelivery Mode: ${deliveryMode === 'store_pickup' ? 'Showroom Pickup' : 'Home Delivery'}\nAddress: ${fullAddress}\nPayment: ${paymentLabel}`
      });
    } catch (err) {
      console.warn('Order submission notice:', err);
    } finally {
      setIsSubmittingOrder(false);
      setPlacedOrderData({
        orderId,
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        productName: product.name,
        size: selectedSize,
        colour: selectedColour.name,
        colourHex: selectedColour.hex,
        quantity,
        originalTotal,
        finalAmount,
        onlineDiscount,
        deliveryMode,
        fullAddress,
        paymentLabel
      });
      setCheckoutStep(3); // Show Order Placed Success Card
    }
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
  const currentTotal = product.price * quantity;
  const onlineDiscount = 50;
  const payOnlineTotal = Math.max(0, currentTotal - onlineDiscount);

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
              <div style={{ marginBottom: '0.5rem' }}>
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

                {/* 2. Book Now (Direct Multi-step Checkout) */}
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
          MULTI-STEP "BOOK NOW" MODAL (Matches user reference Images 1, 2, 3)
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
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative'
            }}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setShowBookingModal(false)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: 'var(--text-muted)',
                padding: '4px',
                zIndex: 10
              }}
            >
              <CloseIcon size={22} />
            </button>

            {/* -------------------------------------------------------------------
                STEP 1: CONFIRM DELIVERY LOCATION / ADD ADDRESS (Image 1 & 2)
                ------------------------------------------------------------------- */}
            {checkoutStep === 1 && (
              <div style={{ padding: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)', marginBottom: '1.25rem' }}>
                  Confirm Delivery Location
                </h2>

                {/* Receiver's Details Card */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-espresso)', marginBottom: '8px' }}>
                    Receiver's Details
                  </div>
                  <div
                    style={{
                      backgroundColor: 'var(--color-cream)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <input
                        type="text"
                        placeholder="Receiver Full Name (e.g. Sara Khan) *"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          color: 'var(--color-espresso)',
                          outline: 'none',
                          borderBottom: '1px solid var(--border-subtle)',
                          paddingBottom: '4px'
                        }}
                      />
                      {addressErrors.name && <div className="form-error">{addressErrors.name}</div>}
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="10-digit Phone Number (e.g. 6300254473) *"
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '0.9rem',
                          color: 'var(--text-muted)',
                          outline: 'none'
                        }}
                      />
                      {addressErrors.phone && <div className="form-error">{addressErrors.phone}</div>}
                    </div>
                  </div>
                </div>

                {/* Delivery Mode: Doorstep vs Showroom Trial */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('doorstep')}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: deliveryMode === 'doorstep' ? '700' : '500',
                        border: deliveryMode === 'doorstep' ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                        backgroundColor: deliveryMode === 'doorstep' ? 'var(--color-latte-soft)' : 'var(--color-white)',
                        color: 'var(--color-espresso)',
                        textAlign: 'left'
                      }}
                    >
                      <div>🏠 Doorstep Delivery</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Warangal / Hanamkonda</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMode('store_pickup')}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: deliveryMode === 'store_pickup' ? '700' : '500',
                        border: deliveryMode === 'store_pickup' ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                        backgroundColor: deliveryMode === 'store_pickup' ? 'var(--color-latte-soft)' : 'var(--color-white)',
                        color: 'var(--color-espresso)',
                        textAlign: 'left'
                      }}
                    >
                      <div>🏬 Store Trial & Pickup</div>
                      <div style={{ fontSize: '0.75rem', color: '#2E6F40', fontWeight: '700' }}>FREE</div>
                    </button>
                  </div>
                </div>

                {/* Address Form (Doorstep Mode) */}
                {deliveryMode === 'doorstep' ? (
                  <form onSubmit={handleProceedToPayment}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-espresso)', marginBottom: '8px' }}>
                      Add Address
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        HOUSE NUMBER , FLAT , BUILDING *
                      </label>
                      <input
                        type="text"
                        maxLength={80}
                        className="form-input"
                        placeholder="House no., Apartment name, Building"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <span>Needed for doorstep delivery.</span>
                        <span>{houseNumber.length}/80</span>
                      </div>
                      {addressErrors.houseNumber && <div className="form-error">{addressErrors.houseNumber}</div>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        ADDRESS (LOCALITY, STREET, LANDMARK) *
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Street, Near Landmark, Colony"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                      />
                      {addressErrors.streetAddress && <div className="form-error">{addressErrors.streetAddress}</div>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        PINCODE *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        className="form-input"
                        placeholder="e.g. 506001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                      {addressErrors.pincode && <div className="form-error">{addressErrors.pincode}</div>}
                    </div>

                    {/* Type of Address Radio */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                        TYPE OF ADDRESS
                      </label>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        {['Home', 'Office', 'Others'].map((type) => (
                          <label key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="addrType"
                              checked={addressType === type}
                              onChange={() => setAddressType(type)}
                            />
                            <span>{type === 'Home' ? '🏠 Home' : type === 'Office' ? '🏢 Office' : '📍 Others'}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Set Default */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isDefaultAddress}
                          onChange={(e) => setIsDefaultAddress(e.target.checked)}
                        />
                        <span>Set this as default address</span>
                      </label>
                    </div>

                    {/* Save & Proceed Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isFullWidth
                      style={{ fontWeight: '700', letterSpacing: '0.06em' }}
                    >
                      SAVE & PROCEED
                    </Button>
                  </form>
                ) : (
                  /* Store Pickup Mode */
                  <div>
                    <div
                      style={{
                        backgroundColor: 'var(--color-latte-soft)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1rem',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                        <MapPinIcon size={18} style={{ color: 'var(--color-caramel)', flexShrink: 0 }} />
                        <strong style={{ color: 'var(--color-espresso)' }}>MR SM Showroom Pickup</strong>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.825rem' }}>
                        1st Floor, 24-7-302/1, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda, Warangal
                      </p>
                      <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#2E6F40', fontWeight: '700' }}>
                        ✓ Free custom size trial & alteration support included!
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      isFullWidth
                      onClick={handleProceedToPayment}
                      style={{ fontWeight: '700', letterSpacing: '0.06em' }}
                    >
                      SAVE & PROCEED
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* -------------------------------------------------------------------
                STEP 2: PAYMENT METHOD (Matches user reference Image 3)
                ------------------------------------------------------------------- */}
            {checkoutStep === 2 && (
              <div>
                {/* Step Header */}
                <div
                  style={{
                    padding: '1.25rem 1.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: 'var(--color-mocha)',
                      cursor: 'pointer'
                    }}
                  >
                    ‹ BACK
                  </button>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', letterSpacing: '0.04em', margin: 0, textTransform: 'uppercase' }}>
                    PAYMENT METHOD
                  </h3>
                  <span
                    style={{
                      border: '1px solid var(--color-caramel)',
                      color: 'var(--color-caramel)',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    STEP 2/2
                  </span>
                </div>

                {/* Offer Discount Banner (Image 3 green ribbon) */}
                <div
                  style={{
                    backgroundColor: '#E8F5E9',
                    color: '#2E6F40',
                    textAlign: 'center',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    borderBottom: '1px solid #C8E6C9'
                  }}
                >
                  ✨ ₹{onlineDiscount} OFF on this order when you Pay Online
                </div>

                <div style={{ padding: '1.5rem 1.75rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-espresso)', marginBottom: '1rem' }}>
                    Select payment method
                  </div>

                  {/* Option 1: Cash on Delivery / Store Pickup */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      border: paymentMethod === 'cod' ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      marginBottom: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: paymentMethod === 'cod' ? 'var(--color-latte-soft)' : 'var(--color-white)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-espresso)' }}>
                        {formatINR(currentTotal)}
                      </span>
                      <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '14px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                          {deliveryMode === 'store_pickup' ? 'Pay at Showroom on Pickup' : 'Cash on Delivery'} 💵
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Pay with cash or UPI on delivery
                        </div>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                  </div>

                  {/* Option 2: Pay Online (Featured box with sub-options) */}
                  <div
                    style={{
                      border: paymentMethod === 'online' ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <div
                      onClick={() => setPaymentMethod('online')}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: paymentMethod === 'online' ? 'var(--color-latte-soft)' : 'var(--color-white)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            {formatINR(currentTotal)}
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2E6F40' }}>
                            {formatINR(payOnlineTotal)}
                          </div>
                          <span style={{ fontSize: '0.65rem', backgroundColor: '#E8F5E9', color: '#2E6F40', fontWeight: '700', padding: '1px 5px', borderRadius: '3px' }}>
                            Save ₹{onlineDiscount}
                          </span>
                        </div>

                        <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '14px' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                            Pay Online 🔥
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#2E6F40' }}>
                            ⚡ Instant Confirmation + Extra Savings
                          </div>
                        </div>
                      </div>

                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                      />
                    </div>

                    {/* Sub-options for Online Pay */}
                    {paymentMethod === 'online' && (
                      <div style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--color-white)', padding: '12px 16px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-mocha)', marginBottom: '8px' }}>
                          Select UPI / Online Option:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {[
                            { id: 'phonepe', label: 'PhonePe UPI', extra: 'Assured ₹20–₹100 Cashback' },
                            { id: 'gpay', label: 'Google Pay UPI', extra: 'Instant UPI PIN Checkout' },
                            { id: 'paytm', label: 'Paytm / BHIM UPI', extra: 'All bank accounts supported' },
                            { id: 'cards', label: 'Debit / Credit Cards', extra: 'Visa, MasterCard, RuPay' },
                            { id: 'netbanking', label: 'Net Banking', extra: 'SBI, HDFC, ICICI, Axis & others' }
                          ].map((opt) => (
                            <label
                              key={opt.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 10px',
                                borderRadius: 'var(--radius-xs)',
                                border: selectedOnlineOption === opt.id ? '1px solid var(--color-caramel)' : '1px solid #ECECEC',
                                backgroundColor: selectedOnlineOption === opt.id ? 'var(--color-latte-soft)' : '#FAFAFA',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="radio"
                                  name="onlineSub"
                                  checked={selectedOnlineOption === opt.id}
                                  onChange={() => setSelectedOnlineOption(opt.id)}
                                />
                                <strong>{opt.label}</strong>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: '#2E6F40', fontWeight: '600' }}>
                                {opt.extra}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expandable Price Breakdown */}
                  <div style={{ marginBottom: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowPriceDetails((p) => !p)}
                      style={{ fontSize: '0.8rem', color: 'var(--color-mocha)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {showPriceDetails ? 'Hide Price Details ▲' : 'VIEW PRICE DETAILS ▼'}
                    </button>

                    {showPriceDetails && (
                      <div
                        style={{
                          backgroundColor: 'var(--color-cream)',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-xs)',
                          marginTop: '8px',
                          fontSize: '0.8rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Item Price ({quantity}x):</span>
                          <span>{formatINR(product.price * quantity)}</span>
                        </div>
                        {paymentMethod === 'online' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E6F40' }}>
                            <span>Online Discount:</span>
                            <span>− {formatINR(onlineDiscount)}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Delivery / Pickup:</span>
                          <span style={{ color: '#2E6F40', fontWeight: '700' }}>FREE</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: 'var(--color-espresso)' }}>
                          <span>Total Amount:</span>
                          <span>{formatINR(paymentMethod === 'online' ? payOnlineTotal : currentTotal)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: Total Price + PLACE ORDER (Matches user reference Image 3) */}
                <div
                  style={{
                    backgroundColor: 'var(--color-white)',
                    borderTop: '2px solid var(--border-subtle)',
                    padding: '1rem 1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-espresso)' }}>
                      {formatINR(paymentMethod === 'online' ? payOnlineTotal : currentTotal)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {paymentMethod === 'online' ? 'Online Demo Price' : 'Pay on Delivery / Pickup'}
                    </div>
                  </div>

                  <Button
                    variant="caramel"
                    size="lg"
                    isLoading={isSubmittingOrder}
                    onClick={handlePlaceOrder}
                    style={{ minWidth: '180px', fontWeight: '800', fontSize: '0.95rem' }}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                STEP 3: ORDER PLACED SUCCESSFUL CARD & BACK TO HOME
                ------------------------------------------------------------------- */}
            {checkoutStep === 3 && placedOrderData && (
              <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
                {/* Celebratory Check Icon */}
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--status-success-bg)',
                    color: 'var(--status-success)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    border: '2px solid #C3E6CB'
                  }}
                >
                  <CheckIcon size={40} />
                </div>

                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#E8F5E9',
                    color: '#2E6F40',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-xs)',
                    letterSpacing: '0.08em',
                    marginBottom: '8px'
                  }}
                >
                  Order Confirmed
                </span>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-espresso)', marginBottom: '6px' }}>
                  Order Placed Successfully!
                </h2>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Thank you! Your clothing reservation has been registered with <strong>MR SM Multi Brand Store</strong>.
                </p>

                {/* Order ID Badge */}
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--color-latte-soft)',
                    border: '1px dashed var(--color-caramel)',
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    color: 'var(--color-espresso)',
                    letterSpacing: '0.06em',
                    marginBottom: '1.75rem'
                  }}
                >
                  Order ID: {placedOrderData.orderId}
                </div>

                {/* Order Details Card */}
                <div
                  style={{
                    backgroundColor: 'var(--color-cream)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginBottom: '1.75rem'
                  }}
                >
                  <div>
                    <strong>Garment:</strong> {placedOrderData.productName}
                  </div>
                  <div>
                    <strong>Size & Colour:</strong> Size {placedOrderData.size} • Colour: {placedOrderData.colour}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {placedOrderData.quantity} unit(s)
                  </div>
                  <div>
                    <strong>Amount Payable:</strong> <strong style={{ color: 'var(--color-espresso)', fontSize: '1rem' }}>{formatINR(placedOrderData.finalAmount)}</strong>
                  </div>
                  <div>
                    <strong>Payment Method:</strong> {placedOrderData.paymentLabel}
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '4px' }}>
                    <strong>Delivery Location:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                      {placedOrderData.receiverName} ({placedOrderData.receiverPhone})<br />
                      {placedOrderData.fullAddress}
                    </div>
                  </div>
                </div>

                {/* WhatsApp & Back to Home Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href={`https://wa.me/918332867454?text=${encodeURIComponent(`Hi Mr. Shiva Yadav, I have placed an order for "${placedOrderData.productName}" (Size: ${placedOrderData.size}, Colour: ${placedOrderData.colour}, Qty: ${placedOrderData.quantity}). Order ID: ${placedOrderData.orderId}. Total: ${formatINR(placedOrderData.finalAmount)}. Delivery to: ${placedOrderData.receiverName} (${placedOrderData.receiverPhone}), ${placedOrderData.fullAddress}. Please confirm my order.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-caramel btn-lg"
                    style={{ width: '100%', fontWeight: '700', gap: '8px' }}
                  >
                    <WhatsAppIcon size={20} /> Send Order to WhatsApp (Mr. Shiva Yadav)
                  </a>

                  {/* Back to Home Button (As explicitly requested by user) */}
                  <Button
                    variant="primary"
                    size="lg"
                    isFullWidth
                    onClick={() => {
                      setShowBookingModal(false);
                      navigate('/');
                    }}
                    style={{ fontWeight: '700' }}
                  >
                    🏠 Back to Home
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
