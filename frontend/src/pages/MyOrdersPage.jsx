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
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'online' | 'cod' | 'pickup'
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

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
    if (activeTab === 'online') return ord.isPaidOnline;
    if (activeTab === 'cod') return !ord.isPaidOnline;
    if (activeTab === 'pickup') return ord.deliveryMode === 'store_pickup';
    return true;
  });

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
              { id: 'online', label: `Paid via UPI (${orders.filter((o) => o.isPaidOnline).length})` },
              { id: 'cod', label: `Cash on Delivery (${orders.filter((o) => !o.isPaidOnline).length})` },
              { id: 'pickup', label: `Showroom Pickups (${orders.filter((o) => o.deliveryMode === 'store_pickup').length})` }
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
                    ].map((st, sIdx, arr) => (
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

                  <Link to="/shop">
                    <Button variant="primary" size="sm">
                      🛍️ Buy Again
                    </Button>
                  </Link>
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
      </div>
    </div>
  );
};

export default MyOrdersPage;
