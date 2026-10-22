import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import Button from '../common/Button';
import { formatINR } from '../common/PriceDisplay';
import { CloseIcon, CheckIcon, MapPinIcon, WhatsAppIcon } from '../common/Icons';

/**
 * CheckoutModal
 * Multi-step checkout experience:
 * Step 1: Delivery Address (Doorstep vs Showroom Trial)
 * Step 2: Payment Method (COD vs Pay Online)
 * Step 3: Dedicated UPI & QR Code Payment Gateway
 * Step 4: Payment Success Confirmation
 * Step 5: Order Placed Successfully Card with WhatsApp notification and "Back to Home"
 */
export const CheckoutModal = ({
  isOpen,
  onClose,
  items = [],
  onOrderSuccess
}) => {
  const navigate = useNavigate();

  // Navigation Steps:
  // 'address' -> 'payment_method' -> 'online_upi' -> 'payment_success' -> 'order_success'
  const [currentStep, setCurrentStep] = useState('address');

  // Step 1: Address States
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('doorstep'); // 'doorstep' | 'store_pickup'
  const [houseNumber, setHouseNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [pincode, setPincode] = useState('506001');
  const [addressType, setAddressType] = useState('Home');
  const [isDefaultAddress, setIsDefaultAddress] = useState(true);
  const [addressErrors, setAddressErrors] = useState({});

  // Step 2: Payment Method States
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'cod' | 'online'
  const [selectedOnlineOption, setSelectedOnlineOption] = useState('qr'); // 'qr' | 'phonepe' | 'gpay' | 'paytm' | 'cards' | 'netbanking'
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  // Step 3: Online UPI / QR States
  const [upiTab, setUpiTab] = useState('qr'); // 'qr' | 'apps'
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [customUpiId, setCustomUpiId] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState(299); // 4m 59s
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Step 5: Final Placed Order Data
  const [orderData, setOrderData] = useState(null);

  // Store UPI constant configuration (Mr. Shiva Yadav - MR SM Store)
  const STORE_UPI_VPA = '8466007454@ybl';
  const STORE_PHONE = '+91 8466007454';
  const STORE_WHATSAPP = '+91 8332867454';

  // Calculations
  const rawSubtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const onlineDiscount = paymentMethod === 'online' ? 50 : 0;
  const grandTotal = Math.max(0, rawSubtotal - onlineDiscount);

  // Reset or initialize on modal open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('address');
      setCountdownSeconds(299);
      setIsVerifyingPayment(false);
      setCopiedUpi(false);
    }
  }, [isOpen]);

  // Generate real QR code when reaching 'online_upi' step or amount changes
  useEffect(() => {
    if (currentStep === 'online_upi' && grandTotal > 0) {
      const upiUrl = `upi://pay?pa=${STORE_UPI_VPA}&pn=MR%20SM%20Multi%20Brand%20Store&am=${grandTotal}&cu=INR&tn=Order%20MRSM`;
      QRCode.toDataURL(upiUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#2B1D17', // Signature Espresso color
          light: '#FFFFFF'
        }
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => {
          console.warn('[QRCode] Generation warning, using fallback image:', err);
          setQrCodeDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`);
        });
    }
  }, [currentStep, grandTotal]);

  // Live countdown timer for UPI session
  useEffect(() => {
    let timer;
    if (currentStep === 'online_upi' && countdownSeconds > 0) {
      timer = setInterval(() => {
        setCountdownSeconds((sec) => (sec > 0 ? sec - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, countdownSeconds]);

  if (!isOpen) return null;

  // Formatting helper for countdown mm:ss
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Copy UPI ID to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(STORE_UPI_VPA);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Handle Address Validation & Step 1 Submission
  const handleSaveAddress = (e) => {
    if (e) e.preventDefault();
    const errs = {};
    if (!receiverName.trim()) {
      errs.name = 'Please provide receiver full name';
    }
    if (!receiverPhone.trim() || receiverPhone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Valid 10-digit mobile number is required';
    }
    if (deliveryMode === 'doorstep') {
      if (!houseNumber.trim()) {
        errs.houseNumber = 'House / Flat / Building number is required';
      }
      if (!streetAddress.trim()) {
        errs.streetAddress = 'Locality / Street / Landmark is required';
      }
      if (!pincode.trim() || pincode.trim().length !== 6) {
        errs.pincode = 'Valid 6-digit Pincode is required';
      }
    }

    if (Object.keys(errs).length > 0) {
      setAddressErrors(errs);
      return;
    }

    setAddressErrors({});
    setCurrentStep('payment_method');
  };

  // Generate an order record helper
  const buildOrderRecord = (isPaidOnline = false, txnRef = '') => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `MRSM-ORD-${randomNum}`;

    const formattedAddress = deliveryMode === 'store_pickup'
      ? 'Showroom Trial & Pickup: 1st Floor, Opp. Royal Enfield Showroom, Subedari, Hanamkonda, Warangal'
      : `${houseNumber}, ${streetAddress}, Pincode: ${pincode} (${addressType})`;

    let paymentLabel = 'Cash on Delivery (COD)';
    if (deliveryMode === 'store_pickup' && !isPaidOnline) {
      paymentLabel = 'Pay at Showroom on Trial';
    } else if (isPaidOnline) {
      const upiNameMap = {
        qr: 'UPI QR Code Scan',
        phonepe: 'PhonePe UPI',
        gpay: 'Google Pay UPI',
        paytm: 'Paytm UPI',
        cards: 'Debit / Credit Card',
        netbanking: 'Net Banking'
      };
      paymentLabel = `Online Paid (${upiNameMap[selectedOnlineOption] || 'UPI'})`;
    }

    return {
      orderId: newOrderId,
      items,
      rawSubtotal,
      onlineDiscount,
      finalAmount: grandTotal,
      receiverName,
      receiverPhone,
      deliveryMode,
      fullAddress: formattedAddress,
      paymentMethod,
      isPaidOnline,
      transactionId: txnRef,
      paymentLabel,
      status: 'Confirmed & Reserved',
      isCancelled: false,
      cancellationReason: '',
      cancellationComment: '',
      cancelledAt: '',
      orderDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  // Helper to persist placed orders to localStorage for "My Orders" template
  const saveOrderToHistory = (order) => {
    try {
      const existing = JSON.parse(localStorage.getItem('mrsm_orders') || '[]');
      const updated = [order, ...existing];
      localStorage.setItem('mrsm_orders', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save order to localStorage:', err);
    }
  };

  // Handle Payment Method Step submission
  const handleProceedFromPaymentMethod = () => {
    if (paymentMethod === 'online') {
      // Directs to specific UPI / QR code payment gateway
      setCurrentStep('online_upi');
    } else {
      // COD / Store Pickup: directly places order
      const finalOrder = buildOrderRecord(false);
      saveOrderToHistory(finalOrder);
      setOrderData(finalOrder);
      if (onOrderSuccess) onOrderSuccess(finalOrder);
      setCurrentStep('order_success');
    }
  };

  // Handle "Confirm Payment" on Step 3 (Online UPI screen)
  const handleConfirmUpiPayment = () => {
    setIsVerifyingPayment(true);

    const generatedTxn = `TXN-UPI-${Date.now().toString().slice(-8)}`;
    setTransactionId(generatedTxn);

    // Simulate verification delay (800ms)
    setTimeout(() => {
      setIsVerifyingPayment(false);
      const finalOrder = buildOrderRecord(true, generatedTxn);
      saveOrderToHistory(finalOrder);
      setOrderData(finalOrder);
      if (onOrderSuccess) onOrderSuccess(finalOrder);

      // Show Payment Success Screen first!
      setCurrentStep('payment_success');

      // Seamlessly transition to Order Placed Success Card after 2.2 seconds
      setTimeout(() => {
        setCurrentStep('order_success');
      }, 2200);
    }, 900);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal)',
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
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
        {/* Close Button (Hidden on Payment Verifying) */}
        {!isVerifyingPayment && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: 'var(--text-muted)',
              padding: '6px',
              zIndex: 10,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <CloseIcon size={22} />
          </button>
        )}

        {/* =========================================================================
            STEP 1: DELIVERY LOCATION / RECEIVER ADDRESS
            ========================================================================= */}
        {currentStep === 'address' && (
          <div className="checkout-modal-body">
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                color: 'var(--color-espresso)',
                marginBottom: '1.25rem'
              }}
            >
              Confirm Delivery Location
            </h2>

            {/* Receiver's Details Box */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  color: 'var(--color-espresso)',
                  marginBottom: '8px'
                }}
              >
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
                    placeholder="10-digit Phone Number (e.g. 8466007454) *"
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

            {/* Delivery Mode Toggle */}
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
                    textAlign: 'left',
                    cursor: 'pointer'
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
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div>🏬 Store Trial & Pickup</div>
                  <div style={{ fontSize: '0.75rem', color: '#2E6F40', fontWeight: '700' }}>FREE</div>
                </button>
              </div>
            </div>

            {/* Doorstep Address Form */}
            {deliveryMode === 'doorstep' ? (
              <form onSubmit={handleSaveAddress}>
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

                {/* Address Type */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                    TYPE OF ADDRESS
                  </label>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {['Home', 'Office', 'Others'].map((type) => (
                      <label key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="addrTypeModal"
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
              /* Store Pickup View */
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
                  onClick={handleSaveAddress}
                  style={{ fontWeight: '700', letterSpacing: '0.06em' }}
                >
                  SAVE & PROCEED
                </Button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            STEP 2: PAYMENT METHOD SELECTION
            ========================================================================= */}
        {currentStep === 'payment_method' && (
          <div>
            {/* Header */}
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
                onClick={() => setCurrentStep('address')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: 'var(--color-mocha)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none'
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

            {/* Special Offer Ribbon */}
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
              ✨ ₹50 OFF on this order when you Pay Online via UPI / QR
            </div>

            <div style={{ padding: '1.5rem 1.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-espresso)', marginBottom: '1rem' }}>
                Select payment method
              </div>

              {/* Option 1: Cash on Delivery / Pay at Showroom */}
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
                    {formatINR(rawSubtotal)}
                  </span>
                  <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '14px' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                      {deliveryMode === 'store_pickup' ? 'Pay at Showroom on Pickup' : 'Cash on Delivery'} 💵
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Pay with cash or UPI on delivery / trial
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payMethodChoice"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
              </div>

              {/* Option 2: Pay Online (Direct to QR / UPI) */}
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
                        {formatINR(rawSubtotal)}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2E6F40' }}>
                        {formatINR(Math.max(0, rawSubtotal - 50))}
                      </div>
                      <span style={{ fontSize: '0.65rem', backgroundColor: '#E8F5E9', color: '#2E6F40', fontWeight: '700', padding: '1px 5px', borderRadius: '3px' }}>
                        Save ₹50
                      </span>
                    </div>

                    <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '14px' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                        Pay Online (UPI / QR) 🔥
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#2E6F40' }}>
                        ⚡ Instant Confirmation + ₹50 Extra Discount
                      </div>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="payMethodChoice"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                  />
                </div>

                {/* Sub-options for Online Pay */}
                {paymentMethod === 'online' && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--color-white)', padding: '12px 16px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-mocha)', marginBottom: '8px' }}>
                      Choose Online UPI Method:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { id: 'qr', label: '📱 Scan UPI QR Code', extra: 'Works with Any UPI App' },
                        { id: 'phonepe', label: '🟣 PhonePe UPI', extra: 'Instant Cashback' },
                        { id: 'gpay', label: '🔵 Google Pay UPI', extra: 'Fast & Secure' },
                        { id: 'paytm', label: '🔷 Paytm / BHIM UPI', extra: 'All Banks Supported' },
                        { id: 'cards', label: '💳 Debit / Credit Card', extra: 'Visa, RuPay, MasterCard' }
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
                              name="onlineSubChoice"
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
                  style={{ fontSize: '0.8rem', color: 'var(--color-mocha)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', background: 'none', border: 'none' }}
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
                      <span>Items Subtotal ({items.length} items):</span>
                      <span>{formatINR(rawSubtotal)}</span>
                    </div>
                    {paymentMethod === 'online' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E6F40' }}>
                        <span>Online UPI Discount:</span>
                        <span>− {formatINR(50)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Delivery / Pickup:</span>
                      <span style={{ color: '#2E6F40', fontWeight: '700' }}>FREE</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: 'var(--color-espresso)' }}>
                      <span>Total Amount:</span>
                      <span>{formatINR(grandTotal)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Bar: Action Button */}
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
                  {formatINR(grandTotal)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {paymentMethod === 'online' ? 'Includes ₹50 Online Discount' : 'Pay on Delivery / Pickup'}
                </div>
              </div>

              <Button
                variant="caramel"
                size="lg"
                onClick={handleProceedFromPaymentMethod}
                style={{ minWidth: '200px', fontWeight: '800', fontSize: '0.95rem' }}
              >
                {paymentMethod === 'online' ? `Proceed to Pay ${formatINR(grandTotal)} ❯` : 'Place Order ❯'}
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: DEDICATED UPI & QR PAYMENT GATEWAY
            (Directs here when Pay Online is selected)
            ========================================================================= */}
        {currentStep === 'online_upi' && (
          <div>
            {/* Gateway Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--color-latte-soft)'
              }}
            >
              <button
                type="button"
                onClick={() => setCurrentStep('payment_method')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: 'var(--color-mocha)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ‹ CHANGE METHOD
              </button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-espresso)', letterSpacing: '0.04em' }}>
                  MR SM UPI GATEWAY
                </div>
                <div style={{ fontSize: '0.7rem', color: '#2E6F40', fontWeight: '600' }}>
                  🔒 256-Bit SSL Demo Secured
                </div>
              </div>
              <div
                style={{
                  backgroundColor: '#FFF3CD',
                  color: '#856404',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                ⏱ {formatTimer(countdownSeconds)}
              </div>
            </div>

            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              {/* Store UPI & Amount Card */}
              <div
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Paying To Merchant
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-espresso)' }}>
                    MR SM Multi Brand Store
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-mocha)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span>{STORE_UPI_VPA}</span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: copiedUpi ? '#E8F5E9' : 'var(--color-latte)',
                        color: copiedUpi ? '#2E6F40' : 'var(--color-espresso)',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '1px 6px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedUpi ? '✓ Copied' : 'Copy UPI'}
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#2E6F40', fontWeight: '700' }}>
                    ₹50 Off Applied
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--color-espresso)' }}>
                    {formatINR(grandTotal)}
                  </div>
                </div>
              </div>

              {/* UPI Tab Switcher: QR Code vs Direct UPI Apps */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--color-latte-soft)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px',
                  marginBottom: '1.25rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setUpiTab('qr')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    backgroundColor: upiTab === 'qr' ? 'var(--color-white)' : 'transparent',
                    color: upiTab === 'qr' ? 'var(--color-espresso)' : 'var(--text-muted)',
                    boxShadow: upiTab === 'qr' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  📱 Scan UPI QR Code
                </button>
                <button
                  type="button"
                  onClick={() => setUpiTab('apps')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    backgroundColor: upiTab === 'apps' ? 'var(--color-white)' : 'transparent',
                    color: upiTab === 'apps' ? 'var(--color-espresso)' : 'var(--text-muted)',
                    boxShadow: upiTab === 'apps' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Pay via UPI ID / Apps
                </button>
              </div>

              {/* Tab 1: QR Code Scanner View */}
              {upiTab === 'qr' && (
                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '12px',
                      backgroundColor: 'var(--color-white)',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-subtle)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      marginBottom: '1rem',
                      position: 'relative'
                    }}
                  >
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="MR SM UPI Payment QR"
                        style={{ width: '210px', height: '210px', display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: '210px', height: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Loading QR Code...
                      </div>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'var(--color-espresso)',
                        color: 'var(--color-white)',
                        fontWeight: '800',
                        fontSize: '0.65rem',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        letterSpacing: '0.05em',
                        border: '2px solid #FFFFFF'
                      }}
                    >
                      MR SM
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--color-espresso)', fontWeight: '600', margin: '0 0 6px 0' }}>
                    Scan with any UPI app on your phone
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                    Google Pay • PhonePe • Paytm • BHIM • Cred • Amazon Pay
                  </p>

                  {/* Direct Mobile UPI Intent link */}
                  <a
                    href={`upi://pay?pa=${STORE_UPI_VPA}&pn=MR%20SM%20Multi%20Brand%20Store&am=${grandTotal}&cu=INR&tn=Order%20MRSM`}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginBottom: '1.25rem' }}
                  >
                    📲 Open Installed UPI App on this Device
                  </a>
                </div>
              )}

              {/* Tab 2: Direct UPI Apps & Manual UPI ID */}
              {upiTab === 'apps' && (
                <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-mocha)', marginBottom: '8px' }}>
                    Popular UPI Apps
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.25rem' }}>
                    {[
                      { name: 'Google Pay', icon: '🔵', scheme: 'gpay' },
                      { name: 'PhonePe', icon: '🟣', scheme: 'phonepe' },
                      { name: 'Paytm UPI', icon: '🔷', scheme: 'paytmmp' }
                    ].map((app) => (
                      <a
                        key={app.name}
                        href={`upi://pay?pa=${STORE_UPI_VPA}&pn=MR%20SM%20Multi%20Brand%20Store&am=${grandTotal}&cu=INR`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '12px 8px',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#FAFAFA',
                          textAlign: 'center',
                          textDecoration: 'none',
                          color: 'var(--color-espresso)'
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{app.icon}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{app.name}</span>
                        <span style={{ fontSize: '0.65rem', color: '#2E6F40' }}>Instant</span>
                      </a>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-mocha)', marginBottom: '6px' }}>
                    Or Enter Customer VPA / UPI ID
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. yourname@okhdfcbank"
                      value={customUpiId}
                      onChange={(e) => setCustomUpiId(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => alert(`Payment request sent to ${customUpiId || 'your UPI ID'}. Please approve the request in your UPI App and click "I Have Paid" below.`)}
                    >
                      Request
                    </Button>
                  </div>
                </div>
              )}

              {/* Confirmation Action */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <Button
                  variant="primary"
                  size="lg"
                  isFullWidth
                  isLoading={isVerifyingPayment}
                  onClick={handleConfirmUpiPayment}
                  style={{ fontWeight: '800', fontSize: '1rem', letterSpacing: '0.04em' }}
                >
                  {isVerifyingPayment ? 'Verifying Payment...' : `✅ I Have Paid / Confirm Payment (${formatINR(grandTotal)})`}
                </Button>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Click after paying via QR or UPI to confirm your garment reservation
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: PAYMENT SUCCESSFUL CARD
            (Directs here right after payment is confirmed)
            ========================================================================= */}
        {currentStep === 'payment_success' && (
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: '#E8F5E9',
                color: '#2E6F40',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '3px solid #A5D6A7'
              }}
            >
              <CheckIcon size={44} />
            </div>

            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#E8F5E9',
                color: '#2E6F40',
                fontSize: '0.75rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                letterSpacing: '0.08em',
                marginBottom: '8px'
              }}
            >
              Payment Confirmed
            </span>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
              Payment Successful!
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              We have received your payment of <strong style={{ color: '#2E6F40' }}>{formatINR(grandTotal)}</strong> via UPI.
            </p>

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
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
                <strong style={{ color: 'var(--color-espresso)' }}>{transactionId || 'TXN-UPI-OK'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Paid To:</span>
                <strong style={{ color: 'var(--color-espresso)' }}>MR SM Multi Brand Store</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Proprietor:</span>
                <span>Mr. Shiva Yadav</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: '#2E6F40', fontWeight: '800' }}>SUCCESS (200 OK)</span>
              </div>
            </div>

            <Button
              variant="caramel"
              size="lg"
              isFullWidth
              onClick={() => setCurrentStep('order_success')}
              style={{ fontWeight: '700' }}
            >
              View Order Confirmation ❯
            </Button>
          </div>
        )}

        {/* =========================================================================
            STEP 5: ORDER PLACED SUCCESSFUL CARD & BACK TO HOME
            ========================================================================= */}
        {currentStep === 'order_success' && orderData && (
          <div className="checkout-modal-body" style={{ textAlign: 'center' }}>
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
              {orderData.isPaidOnline ? 'Order Confirmed & Paid via UPI' : 'Order Confirmed (Cash on Delivery)'}
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
                marginBottom: '1.5rem'
              }}
            >
              Order ID: {orderData.orderId}
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
                <strong>Garments:</strong>{' '}
                {orderData.items.map((it, idx) => (
                  <span key={idx}>
                    {it.product?.name || it.name || 'Garment'} (Size: {it.size}, Qty: {it.quantity || 1})
                    {idx < orderData.items.length - 1 ? '; ' : ''}
                  </span>
                ))}
              </div>
              <div>
                <strong>Amount:</strong> <strong style={{ color: 'var(--color-espresso)', fontSize: '1rem' }}>{formatINR(orderData.finalAmount)}</strong>
                {orderData.isPaidOnline && <span style={{ color: '#2E6F40', marginLeft: '6px', fontWeight: '700' }}>(Paid via UPI)</span>}
              </div>
              <div>
                <strong>Payment Method:</strong> {orderData.paymentLabel}
              </div>
              {orderData.transactionId && (
                <div>
                  <strong>UPI Ref:</strong> {orderData.transactionId}
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '4px' }}>
                <strong>Delivery / Pickup Destination:</strong>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                  {orderData.receiverName} ({orderData.receiverPhone})<br />
                  {orderData.fullAddress}
                </div>
              </div>
            </div>

            {/* WhatsApp & View Orders & Back to Home Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`https://wa.me/918332867454?text=${encodeURIComponent(
                  `Hi Mr. Shiva Yadav, I have placed an order at MR SM Multi Brand Store.\nOrder ID: ${orderData.orderId}\nTotal: ${formatINR(orderData.finalAmount)} (${orderData.paymentLabel})\nItems: ${orderData.items.map((i) => `${i.product?.name || i.name} (Size: ${i.size})`).join(', ')}\nDelivery to: ${orderData.receiverName} (${orderData.receiverPhone}), ${orderData.fullAddress}.\nPlease confirm my booking.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-caramel btn-lg"
                style={{ width: '100%', fontWeight: '700', gap: '8px' }}
              >
                <WhatsAppIcon size={20} /> Send Order to WhatsApp (Mr. Shiva Yadav)
              </a>

              {/* View in My Orders Button */}
              <Button
                variant="outline"
                size="lg"
                isFullWidth
                onClick={() => {
                  onClose();
                  navigate('/my-orders');
                }}
                style={{ fontWeight: '700', backgroundColor: 'var(--color-latte-soft)', color: 'var(--color-espresso)' }}
              >
                📦 View in My Orders
              </Button>

              {/* Prominent Back to Home Button (As requested by user) */}
              <Button
                variant="primary"
                size="lg"
                isFullWidth
                onClick={() => {
                  onClose();
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
  );
};

export default CheckoutModal;
