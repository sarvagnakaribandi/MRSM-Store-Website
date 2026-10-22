import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatINR } from '../components/common/PriceDisplay';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  CheckIcon,
  PhoneIcon,
  WhatsAppIcon,
  MapPinIcon,
  CloseIcon,
  BagIcon
} from '../components/common/Icons';

export const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'online' | 'cod' | 'pickup' | 'cancelled'
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // Cancel Order Modal States
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelStep, setCancelStep] = useState('prompt'); // 'prompt' (Step 1) | 'reason' (Step 2)
  const [selectedReason, setSelectedReason] = useState('');
  const [cancellationComment, setCancellationComment] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Standard E-Commerce Cancellation Reasons (matching reference flow)
  const CANCELLATION_REASONS = [
    'Wrong contact number entered',
    'Ordered by mistake',
    'Incorrect product size/color/type ordered',
    'Expected delivery time is too long',
    'Wrong address selected',
    'Product price has reduced',
    'Purchased product from somewhere else',
    'Product not required anymore',
    'Incorrect payment method selected',
    'Other'
  ];

  // Helper for toast notifications
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Load orders from localStorage on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const savedOrders = JSON.parse(localStorage.getItem('mrsm_orders') || '[]');
      setOrders(savedOrders);
    } catch (err) {
      console.error('Error reading orders from localStorage:', err);
      setOrders([]);
    }
  }, []);

  // Filter orders based on active tab
  const filteredOrders = orders.filter((ord) => {
    const isOrderCancelled = ord.isCancelled || ord.status === 'Cancelled';
    if (activeTab === 'cancelled') return isOrderCancelled;
    if (activeTab === 'online') return ord.isPaidOnline && !isOrderCancelled;
    if (activeTab === 'cod') return !ord.isPaidOnline && !isOrderCancelled;
    if (activeTab === 'pickup') return ord.deliveryMode === 'store_pickup' && !isOrderCancelled;
    return true;
  });

  // Execute Order Cancellation
  const handleConfirmCancellation = () => {
    if (!selectedReason) {
      setCancelError('Please select a reason for cancellation');
      return;
    }

    const nowFormatted = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const updated = orders.map((ord) => {
      if (ord.orderId === cancellingOrder.orderId) {
        return {
          ...ord,
          status: 'Cancelled',
          isCancelled: true,
          cancellationReason: selectedReason,
          cancellationComment: cancellationComment.trim(),
          cancelledAt: nowFormatted
        };
      }
      return ord;
    });

    setOrders(updated);
    try {
      localStorage.setItem('mrsm_orders', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update orders in localStorage:', err);
    }

    showToast(`✓ Order ${cancellingOrder.orderId} cancelled successfully.`);
    setCancellingOrder(null);
    setCancelStep('prompt');
    setSelectedReason('');
    setCancellationComment('');
    setCancelError('');
  };

  // Helper to load a rich demo order if no orders exist yet
  const handleLoadSampleOrder = () => {
    const sample = {
      orderId: `MRSM-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      items: [
        {
          name: 'Classic Oxford Cotton Button-Down Shirt',
          size: 'XL',
          colour: 'Sky Blue',
          quantity: 1,
          price: 1599,
          image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Tailored Smart Stretch Chinos',
          size: '34',
          colour: 'Khaki Sand',
          quantity: 1,
          price: 1899,
          image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80'
        }
      ],
      rawSubtotal: 3498,
      onlineDiscount: 50,
      finalAmount: 3448,
      receiverName: 'Ramesh Kumar',
      receiverPhone: '9848022338',
      deliveryMode: 'doorstep',
      fullAddress: 'Flat 302, Sri Sai Nilayam, Beside Royal Enfield, Subedari, Hanamkonda (Home)',
      paymentMethod: 'online',
      isPaidOnline: true,
      transactionId: `TXN-UPI-${Date.now().toString().slice(-8)}`,
      paymentLabel: 'Online Paid (UPI QR Code Scan)',
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

    const updated = [sample, ...orders];
    setOrders(updated);
    try {
      localStorage.setItem('mrsm_orders', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to clear order history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local order history?')) {
      localStorage.removeItem('mrsm_orders');
      setOrders([]);
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem'
          }}
        >
          <Link to="/" style={{ color: 'var(--color-mocha)' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-espresso)', fontWeight: '600' }}>My Orders</span>
        </nav>

        {/* Page Title & Eyebrow */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-eyebrow">Customer Dashboard</span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: 'var(--color-espresso)', margin: '4px 0 8px 0' }}>
              My Orders & Garment Reservations
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '640px' }}>
              Track your placed orders, showroom bookings, payment receipts, and delivery updates with <strong>MR SM Multi Brand Store</strong>.
            </p>
          </div>

          {orders.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              style={{
                fontSize: '0.8rem',
                color: 'var(--status-error)',
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
                cursor: 'pointer',
                paddingTop: '8px'
              }}
            >
              Clear Order History
            </button>
          )}
        </div>

        {/* Orders Filter Tabs */}
        {orders.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '2px solid var(--border-subtle)',
              marginBottom: '2rem',
              overflowX: 'auto',
              paddingBottom: '2px'
            }}
          >
            {[
              { id: 'all', label: `All Orders (${orders.length})` },
              { id: 'online', label: `Paid via UPI (${orders.filter((o) => o.isPaidOnline && !o.isCancelled && o.status !== 'Cancelled').length})` },
              { id: 'cod', label: `Cash on Delivery (${orders.filter((o) => !o.isPaidOnline && !o.isCancelled && o.status !== 'Cancelled').length})` },
              { id: 'pickup', label: `Showroom Pickups (${orders.filter((o) => o.deliveryMode === 'store_pickup' && !o.isCancelled && o.status !== 'Cancelled').length})` },
              { id: 'cancelled', label: `✕ Cancelled (${orders.filter((o) => o.isCancelled || o.status === 'Cancelled').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 16px',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === tab.id ? '700' : '500',
                  color: activeTab === tab.id ? 'var(--color-espresso)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.id ? '3px solid var(--color-caramel)' : '3px solid transparent',
                  background: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Empty State when no orders placed */}
        {filteredOrders.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-latte-soft)',
                color: 'var(--color-caramel)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1.25rem'
              }}
            >
              📦
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
              {orders.length === 0 ? 'No Orders Placed Yet' : 'No Orders Match Selected Filter'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '480px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
              {orders.length === 0
                ? "When you book a garment using '⚡ Book Now' or complete bag checkout, your placed orders and payment confirmations will appear right here."
                : 'Try switching to the "All Orders" tab to see all your placed garments.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  🛍️ Explore Menswear Catalogue
                </Button>
              </Link>
              {orders.length === 0 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLoadSampleOrder}
                  style={{ fontWeight: '600' }}
                >
                  ⚡ Load Sample Demo Order
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Placed Orders List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {filteredOrders.map((order, idx) => (
              <div
                key={order.orderId || idx}
                style={{
                  backgroundColor: 'var(--color-white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    backgroundColor: 'var(--color-latte-soft)',
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '1.25rem 1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: '800',
                          color: 'var(--color-espresso)',
                          letterSpacing: '0.04em'
                        }}
                      >
                        {order.orderId}
                      </span>
                      {order.isCancelled || order.status === 'Cancelled' ? (
                        <span
                          style={{
                            backgroundColor: '#FBEAEA',
                            color: '#A82828',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-xs)',
                            textTransform: 'uppercase',
                            border: '1px solid #F5C6CB'
                          }}
                        >
                          ✕ Cancelled
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: '#E8F5E9',
                            color: '#2E6F40',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-xs)',
                            textTransform: 'uppercase'
                          }}
                        >
                          ✓ Confirmed
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Placed on {order.orderDate || 'Recent Order'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Total Amount
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-espresso)' }}>
                      {formatINR(order.finalAmount)}
                    </div>
                  </div>
                </div>

                {/* Cancelled Banner (Screenshot 5) OR Progress Stepper & Cancel Bar (Screenshot 1) */}
                {order.isCancelled || order.status === 'Cancelled' ? (
                  <div
                    style={{
                      padding: '1.25rem 1.75rem',
                      backgroundColor: '#FDF7F7',
                      borderBottom: '1px solid #F5C6CB',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px'
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        backgroundColor: '#FBEAEA',
                        border: '1.5px solid #F5C6CB',
                        color: '#A82828',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        flexShrink: 0
                      }}
                    >
                      ✕
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#A82828' }}>Cancelled</strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          As per your request on {order.cancelledAt || order.orderDate}
                        </span>
                      </div>
                      {order.cancellationReason && (
                        <div style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--color-espresso)' }}>
                          <strong>Reason:</strong> {order.cancellationReason}
                          {order.cancellationComment && (
                            <span style={{ color: 'var(--text-secondary)' }}> — "{order.cancellationComment}"</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Progress Stepper Bar */}
                    <div
                      style={{
                        padding: '1.25rem 1.75rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: '#FAF8F5'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        {[
                          { step: '1', title: 'Order Placed', done: true },
                          { step: '2', title: 'Reserved at Showroom', done: true },
                          { step: '3', title: order.deliveryMode === 'store_pickup' ? 'Ready for Trial' : 'Out for Delivery', done: false, active: true },
                          { step: '4', title: 'Delivered', done: false }
                        ].map((st) => (
                          <div key={st.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: st.done ? '#2E6F40' : st.active ? 'var(--color-caramel)' : '#E0E0E0',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                marginBottom: '6px'
                              }}
                            >
                              {st.done ? '✓' : st.step}
                            </div>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: st.done || st.active ? '700' : '500',
                                color: st.done ? '#2E6F40' : st.active ? 'var(--color-espresso)' : 'var(--text-muted)',
                                textAlign: 'center'
                              }}
                            >
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cancellation Available Till Shipping Row (Screenshot 1) */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1.75rem',
                        backgroundColor: '#FFFDF9',
                        borderBottom: '1px solid var(--border-subtle)',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Cancellation available till shipping!
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCancellingOrder(order);
                          setCancelStep('prompt');
                          setSelectedReason('');
                          setCancellationComment('');
                          setCancelError('');
                        }}
                        style={{
                          padding: '6px 18px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid #A82828',
                          color: '#A82828',
                          backgroundColor: 'transparent',
                          fontWeight: '700',
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Cancel Order
                      </button>
                    </div>
                  </>
                )}

                {/* Garments List */}
                <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-mocha)', marginBottom: '1rem' }}>
                    Garments in this Order:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(order.items || []).map((item, itIdx) => (
                      <div
                        key={itIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          paddingBottom: itIdx < order.items.length - 1 ? '1rem' : 0,
                          borderBottom: itIdx < order.items.length - 1 ? '1px dashed var(--border-subtle)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80'}
                            alt=""
                            style={{
                              width: '64px',
                              height: '76px',
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-xs)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          />
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-espresso)', marginBottom: '4px' }}>
                              {item.name || item.product?.name || 'Men’s Garment'}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                              <span style={{ backgroundColor: 'var(--color-latte-soft)', padding: '2px 8px', borderRadius: '3px', fontWeight: '600' }}>
                                Size: {item.size || 'Standard'}
                              </span>
                              {item.colour && (
                                <span style={{ backgroundColor: 'var(--color-latte-soft)', padding: '2px 8px', borderRadius: '3px', fontWeight: '600' }}>
                                  Colour: {item.colour}
                                </span>
                              )}
                              <span>Qty: {item.quantity || 1}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-espresso)' }}>
                            {formatINR(item.price * (item.quantity || 1))}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {formatINR(item.price)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Payment Summary Grid */}
                <div
                  style={{
                    padding: '1.5rem 1.75rem',
                    backgroundColor: 'var(--color-cream)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                    gap: '1.5rem',
                    fontSize: '0.85rem'
                  }}
                >
                  {/* Delivery Location */}
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--color-mocha)', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '6px' }}>
                      Delivery / Pickup Location
                    </div>
                    <div style={{ fontWeight: '700', color: 'var(--color-espresso)' }}>
                      {order.receiverName} ({order.receiverPhone})
                    </div>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {order.fullAddress}
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--color-mocha)', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '6px' }}>
                      Payment Information
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: order.isPaidOnline ? '#2E6F40' : 'var(--color-espresso)' }}>
                        {order.paymentLabel}
                      </span>
                    </div>
                    {order.transactionId && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        UPI Ref: <strong>{order.transactionId}</strong>
                      </div>
                    )}
                    {order.onlineDiscount > 0 && (
                      <div style={{ fontSize: '0.8rem', color: '#2E6F40', fontWeight: '600', marginTop: '2px' }}>
                        ✓ Extra ₹{order.onlineDiscount} Online Discount Saved
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Footer Actions */}
                <div
                  style={{
                    padding: '1rem 1.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    backgroundColor: 'var(--color-white)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a
                      href={`https://wa.me/918332867454?text=${encodeURIComponent(
                        `Hi Mr. Shiva Yadav, I am checking the status of my order ${order.orderId}.\nCustomer: ${order.receiverName} (${order.receiverPhone})\nItems: ${(order.items || []).map((i) => i.name).join(', ')}\nAmount: ${formatINR(order.finalAmount)} (${order.paymentLabel})`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-caramel btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <WhatsAppIcon size={16} /> WhatsApp Mr. Shiva Yadav
                    </a>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReceiptOrder(order)}
                    >
                      📄 View Order Receipt
                    </Button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {!order.isCancelled && order.status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={() => {
                          setCancellingOrder(order);
                          setCancelStep('prompt');
                          setSelectedReason('');
                          setCancellationComment('');
                          setCancelError('');
                        }}
                        style={{
                          padding: '0.45rem 0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid #D32F2F',
                          color: '#D32F2F',
                          backgroundColor: 'transparent',
                          fontWeight: '600',
                          fontSize: '0.825rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel Order
                      </button>
                    )}

                    <Link to="/shop">
                      <button
                        type="button"
                        style={
                          order.isCancelled || order.status === 'Cancelled'
                            ? {
                                padding: '0.65rem 1.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '2px solid #8E24AA',
                                backgroundColor: 'transparent',
                                color: '#8E24AA',
                                fontWeight: '800',
                                fontSize: '0.9rem',
                                letterSpacing: '0.04em',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)'
                              }
                            : {
                                padding: '0.55rem 1.25rem',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                backgroundColor: 'var(--color-espresso)',
                                color: 'var(--color-cream)',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                              }
                        }
                      >
                        {order.isCancelled || order.status === 'Cancelled' ? 'BUY AGAIN' : '🛍️ Buy Again'}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================================================
            PRINTABLE RECEIPT MODAL
            ========================================================================= */}
        {selectedReceiptOrder && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 'var(--z-modal)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(3px)',
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
                maxWidth: '560px',
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '2.5rem',
                position: 'relative',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedReceiptOrder(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  color: 'var(--text-muted)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer'
                }}
              >
                <CloseIcon size={22} />
              </button>

              {/* Receipt Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)', margin: '0 0 4px 0' }}>
                  MR SM MULTI BRAND STORE
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  1st Floor, Opp. Royal Enfield Showroom, Beside A to Z Medicals<br />
                  Subedari, Hanamkonda, Warangal, Telangana<br />
                  Phone: +91 8466007454 • WhatsApp: +91 8332867454
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--color-latte-soft)',
                    border: '1px solid var(--color-caramel)',
                    padding: '4px 14px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    color: 'var(--color-espresso)',
                    marginTop: '10px'
                  }}
                >
                  ORDER RECEIPT: {selectedReceiptOrder.orderId}
                </div>
              </div>

              {/* Customer & Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Customer:</span><br />
                  <strong>{selectedReceiptOrder.receiverName}</strong><br />
                  <span>{selectedReceiptOrder.receiverPhone}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span><br />
                  <strong>{selectedReceiptOrder.orderDate}</strong><br />
                  <span style={{ color: '#2E6F40', fontWeight: '700' }}>STATUS: CONFIRMED</span>
                </div>
              </div>

              {/* Garment Line Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-cream)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Garment Piece</th>
                    <th style={{ textAlign: 'center', padding: '8px' }}>Size</th>
                    <th style={{ textAlign: 'center', padding: '8px' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedReceiptOrder.items || []).map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '8px' }}>{it.name}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{it.size}</td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>{it.quantity || 1}</td>
                      <td style={{ textAlign: 'right', padding: '8px', fontWeight: '700' }}>
                        {formatINR(it.price * (it.quantity || 1))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Math Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>{formatINR(selectedReceiptOrder.rawSubtotal || selectedReceiptOrder.finalAmount)}</span>
                </div>
                {selectedReceiptOrder.onlineDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E6F40' }}>
                    <span>Online Discount:</span>
                    <span>− {formatINR(selectedReceiptOrder.onlineDiscount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery:</span>
                  <span style={{ color: '#2E6F40', fontWeight: '700' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border-subtle)', paddingTop: '8px', fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-espresso)' }}>
                  <span>Total Paid / Payable:</span>
                  <span>{formatINR(selectedReceiptOrder.finalAmount)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div style={{ backgroundColor: 'var(--color-latte-soft)', padding: '10px 14px', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                <div><strong>Payment:</strong> {selectedReceiptOrder.paymentLabel}</div>
                {selectedReceiptOrder.transactionId && <div><strong>UPI Reference:</strong> {selectedReceiptOrder.transactionId}</div>}
                <div><strong>Delivery Address:</strong> {selectedReceiptOrder.fullAddress}</div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="primary"
                  size="md"
                  isFullWidth
                  onClick={() => window.print()}
                >
                  🖨️ Print Receipt
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  isFullWidth
                  onClick={() => setSelectedReceiptOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CANCEL ORDER 2-STEP MODAL (Matching Reference Screenshots 2, 3, 4)
            ========================================================================= */}
        {cancellingOrder && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 'var(--z-modal)',
              backgroundColor: 'rgba(0, 0, 0, 0.68)',
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
                maxWidth: '480px',
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '1.75rem',
                position: 'relative',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  color: 'var(--text-muted)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <CloseIcon size={22} />
              </button>

              {/* Header Title with Back button if on Step 2 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '12px',
                  marginBottom: '1.25rem'
                }}
              >
                {cancelStep === 'reason' && (
                  <button
                    type="button"
                    onClick={() => setCancelStep('prompt')}
                    aria-label="Back to step 1"
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      color: 'var(--color-espresso)',
                      padding: '0 6px 0 0'
                    }}
                  >
                    ←
                  </button>
                )}
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                    fontWeight: '800',
                    color: 'var(--color-espresso)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    margin: 0
                  }}
                >
                  CANCEL ORDER
                </h3>
              </div>

              {/* STEP 1: Confirmation Prompt (Screenshot 2) */}
              {cancelStep === 'prompt' && (
                <div>
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div
                      style={{
                        width: '84px',
                        height: '84px',
                        margin: '0 auto 1.25rem auto',
                        borderRadius: '50%',
                        backgroundColor: '#FFF7EC',
                        border: '2px solid var(--color-caramel)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem'
                      }}
                    >
                      📦
                    </div>
                    <h4
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1.35rem',
                        fontWeight: '800',
                        color: 'var(--color-espresso)',
                        marginBottom: '6px'
                      }}
                    >
                      Packing your order
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Do you still want to cancel?
                    </p>
                  </div>

                  {/* Order Preview Box */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-cream)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 14px',
                      margin: '1.25rem 0 1.5rem 0',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--color-espresso)' }}>{cancellingOrder.orderId}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                        {(cancellingOrder.items || []).map((i) => i.name).join(', ')}
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--color-espresso)', fontSize: '1.05rem' }}>
                      {formatINR(cancellingOrder.finalAmount)}
                    </div>
                  </div>

                  {/* Buttons: Keep Order vs Cancel Order */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setCancellingOrder(null)}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-strong)',
                        backgroundColor: 'var(--color-white)',
                        color: 'var(--color-espresso)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      Keep Order
                    </button>

                    <button
                      type="button"
                      onClick={() => setCancelStep('reason')}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: '#8E24AA',
                        color: 'var(--color-white)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(142, 36, 170, 0.35)'
                      }}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Reason Selection (Screenshots 3 & 4) */}
              {cancelStep === 'reason' && (
                <div>
                  {/* Garment details mini-card */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-mocha)', marginBottom: '6px' }}>
                      Product Details
                    </div>
                    {(cancellingOrder.items || []).slice(0, 1).map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          backgroundColor: 'var(--color-cream)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80'}
                          alt=""
                          style={{ width: '48px', height: '58px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-espresso)' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Size: {item.size || 'Standard'} • {formatINR(item.price)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#2E6F40', fontWeight: '700', marginTop: '2px' }}>
                            ✓ All issue easy returns
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery reassurance banner */}
                  <div
                    style={{
                      backgroundColor: '#FFF9E6',
                      border: '1px solid #FFE082',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      color: '#855800',
                      fontWeight: '600',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>⚡</span>
                    <span>95% orders delivered early in Hanamkonda & Warangal showroom region</span>
                  </div>

                  {/* Reason Options Selection */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-espresso)', marginBottom: '8px' }}>
                      Could you tell us a reason for canceling?
                    </div>

                    <div
                      style={{
                        maxHeight: '210px',
                        overflowY: 'auto',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-white)'
                      }}
                    >
                      {CANCELLATION_REASONS.map((r, i) => {
                        const isSelected = selectedReason === r;
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              setSelectedReason(r);
                              setCancelError('');
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px 14px',
                              cursor: 'pointer',
                              borderBottom: i < CANCELLATION_REASONS.length - 1 ? '1px solid #F0EAE1' : 'none',
                              backgroundColor: isSelected ? 'rgba(142, 36, 170, 0.08)' : 'transparent',
                              transition: 'background 0.15s'
                            }}
                          >
                            <input
                              type="radio"
                              name="cancellationReasonRadio"
                              checked={isSelected}
                              onChange={() => {}}
                              style={{ accentColor: '#8E24AA', width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.85rem', color: isSelected ? '#8E24AA' : 'var(--text-primary)', fontWeight: isSelected ? '700' : '500' }}>
                              {r}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {cancelError && (
                      <div style={{ color: '#D32F2F', fontSize: '0.8rem', marginTop: '6px', fontWeight: '600' }}>
                        {cancelError}
                      </div>
                    )}
                  </div>

                  {/* Optional remarks input */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Tell us more (optional)
                    </label>
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: '60px', fontSize: '0.85rem', padding: '8px 10px' }}
                      value={cancellationComment}
                      onChange={(e) => setCancellationComment(e.target.value)}
                      placeholder="Optional feedback for store proprietor Mr. Shiva Yadav..."
                    />
                  </div>

                  {/* Final Cancel Order Button */}
                  <button
                    type="button"
                    onClick={handleConfirmCancellation}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: '#8E24AA',
                      color: 'var(--color-white)',
                      fontWeight: '800',
                      fontSize: '0.95rem',
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(142, 36, 170, 0.35)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toast Alert Feedback */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              backgroundColor: 'var(--color-espresso)',
              color: 'var(--color-cream)',
              padding: '12px 20px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 9999,
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
