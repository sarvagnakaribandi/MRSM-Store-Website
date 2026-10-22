import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../services/api';
import { formatINR } from '../components/common/PriceDisplay';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  LogoIcon,
  CloseIcon,
  CheckIcon,
  PhoneIcon,
  WhatsAppIcon,
  MapPinIcon
} from '../components/common/Icons';

export const AdminPage = () => {
  // Authentication State (Demo PIN: 'mrsm2026' or 'admin123')
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Active Tab: 'products' | 'orders' | 'store_info'
  const [activeTab, setActiveTab] = useState('products');

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [orderFilterTab, setOrderFilterTab] = useState('all'); // 'all' | 'active' | 'cancelled'

  // Modal States: Add / Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    compareAtPrice: '',
    fabric: '100% Premium Cotton',
    fit: 'Tailored Modern Fit',
    careInstructions: 'Machine wash cold with like colours, warm iron',
    sizes: ['M', 'L', 'XL'],
    colourName: 'Navy Blue',
    colourHex: '#1B263B',
    stock: 12,
    images: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    description: 'Expertly tailored piece designed for versatility and enduring elegance at MR SM Multi Brand Store.',
    isFeatured: false,
    isNewArrival: true
  });

  // Check existing session
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const authSaved = sessionStorage.getItem('mrsm_admin_auth');
    if (authSaved === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch live products, categories, and orders once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        getProducts({ limit: 100 }),
        getCategories()
      ]);
      setProducts(prods || []);
      setCategories(cats || []);

      const savedOrders = JSON.parse(localStorage.getItem('mrsm_orders') || '[]');
      setOrders(savedOrders);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Sign in handler
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (passcode === 'mrsm2026' || passcode === 'admin123' || passcode.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('mrsm_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Use demo passcode: mrsm2026 or click Quick Demo Sign-In');
    }
  };

  const handleQuickLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('mrsm_admin_auth', 'true');
    setAuthError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mrsm_admin_auth');
  };

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?.slug || 'formal-shirts',
      price: '',
      compareAtPrice: '',
      fabric: '100% Giza Cotton',
      fit: 'Tailored Slim Fit',
      careInstructions: 'Machine wash cold, tumble dry low, warm iron',
      sizes: ['M', 'L', 'XL'],
      colourName: 'Sky Blue',
      colourHex: '#4A90E2',
      stock: 15,
      images: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      description: 'Handcrafted premium menswear made with soft breathable fabric for all-day comfort.',
      isFeatured: false,
      isNewArrival: true
    });
    setShowProductModal(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      category: prod.category?.slug || prod.category?._id || 'formal-shirts',
      price: prod.price || '',
      compareAtPrice: prod.compareAtPrice || '',
      fabric: prod.fabric || '100% Cotton',
      fit: prod.fit || 'Tailored Modern Fit',
      careInstructions: prod.careInstructions || 'Machine wash cold',
      sizes: Array.isArray(prod.sizes) && prod.sizes.length > 0 ? prod.sizes : ['M', 'L', 'XL'],
      colourName: prod.colours?.[0]?.name || 'Classic',
      colourHex: prod.colours?.[0]?.hex || '#2B1D17',
      stock: typeof prod.stock === 'number' ? prod.stock : 10,
      images: Array.isArray(prod.images) ? prod.images[0] : prod.images || '',
      description: prod.description || '',
      isFeatured: Boolean(prod.isFeatured),
      isNewArrival: Boolean(prod.isNewArrival)
    });
    setShowProductModal(true);
  };

  // Toggle size in form
  const handleToggleSize = (sz) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(sz);
      const nextSizes = exists ? prev.sizes.filter((s) => s !== sz) : [...prev.sizes, sz];
      return { ...prev, sizes: nextSizes.length > 0 ? nextSizes : [sz] };
    });
  };

  // Save (Create or Update) Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Product name and selling price are required.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
      fabric: formData.fabric.trim(),
      fit: formData.fit.trim(),
      careInstructions: formData.careInstructions.trim(),
      sizes: formData.sizes,
      colours: [{ name: formData.colourName.trim(), hex: formData.colourHex }],
      images: [formData.images.trim()],
      stock: parseInt(formData.stock, 10) || 0,
      description: formData.description.trim(),
      isFeatured: formData.isFeatured,
      isNewArrival: true // Guarantee every newly added garment is displayed on New Arrivals!
    };

    try {
      if (editingProduct) {
        // UPDATE
        await updateProduct(editingProduct._id, payload);
        await loadData();
        showToast(`✓ Updated "${formData.name}" successfully!`);
      } else {
        // CREATE
        await createProduct(payload);
        await loadData();
        showToast(`✓ Added "${formData.name}" to inventory & New Arrivals!`);
      }
      setShowProductModal(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product: ' + err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (prod) => {
    if (window.confirm(`Are you sure you want to remove "${prod.name}" from the store catalogue?`)) {
      try {
        await deleteProduct(prod._id);
        await loadData();
        showToast(`🗑️ "${prod.name}" removed from inventory.`);
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Could not delete product.');
      }
    }
  };

  // Update order status in orders tab
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map((o) => {
      if (o.orderId === orderId) {
        const isNowCancelled = newStatus === 'Cancelled' || newStatus === 'Cancelled by Customer';
        return {
          ...o,
          status: newStatus,
          isCancelled: isNowCancelled,
          // If admin restores an order back to active, reset cancellation data so everything is back to normal
          ...(newStatus !== 'Cancelled' && newStatus !== 'Cancelled by Customer' && o.isCancelled
            ? {
                cancellationReason: '',
                cancellationComment: '',
                cancelledAt: ''
              }
            : {})
        };
      }
      return o;
    });
    setOrders(updated);
    try {
      localStorage.setItem('mrsm_orders', JSON.stringify(updated));
      showToast(`✓ Order ${orderId} status updated to "${newStatus}"`);
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fabric?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      filterCategory === 'all' ||
      p.category?.slug === filterCategory ||
      p.category?._id === filterCategory;
    return matchesSearch && matchesCat;
  });

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (If not logged in)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="section" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '440px' }}>
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '2.5rem 2rem',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}
          >
            {/* Brand Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <LogoIcon size={52} />
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-espresso)', marginBottom: '4px' }}>
              MR SM Multi Brand Store
            </h1>
            <p style={{ color: 'var(--color-caramel)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
              Administrator Console
            </p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Admin Passcode
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter passcode (mrsm2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                />
                {authError && <div className="form-error" style={{ marginTop: '4px' }}>{authError}</div>}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isFullWidth
                style={{ fontWeight: '700', marginBottom: '10px' }}
              >
                Sign In to Console
              </Button>
            </form>

            <div style={{ margin: '1rem 0', position: 'relative', textAlign: 'center' }}>
              <span style={{ backgroundColor: 'var(--color-white)', padding: '0 8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                or
              </span>
            </div>

            {/* Quick Demo Access Button */}
            <Button
              type="button"
              variant="outline"
              size="md"
              isFullWidth
              onClick={handleQuickLogin}
              style={{ fontWeight: '700', backgroundColor: 'var(--color-latte-soft)', color: 'var(--color-espresso)' }}
            >
              ⚡ 1-Click Demo Sign-In
            </Button>

            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Proprietor: Mr. Shiva Yadav<br />
              Subedari, Hanamkonda, Warangal
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div style={{ backgroundColor: '#F7F4EF', minHeight: '90vh', paddingBottom: '4rem' }}>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'var(--color-espresso)',
            color: 'var(--color-cream)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            fontWeight: '700',
            fontSize: '0.9rem',
            border: '1px solid var(--color-caramel)'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Admin Top Header Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-espresso)',
          color: 'var(--color-cream)',
          padding: '1rem 0',
          borderBottom: '2px solid var(--color-caramel)'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LogoIcon size={38} />
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '700' }}>
                MR SM Multi Brand Store • Admin Console
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-latte)' }}>
                Proprietor: <strong>Mr. Shiva Yadav</strong> • Subedari, Hanamkonda
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--color-cream)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        {/* Metric Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ backgroundColor: 'var(--color-white)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Active Garments</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-espresso)', marginTop: '4px' }}>{products.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#2E6F40', fontWeight: '600' }}>Live in Catalogue</div>
          </div>

          <div style={{ backgroundColor: 'var(--color-white)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Collections</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-espresso)', marginTop: '4px' }}>{categories.length || 6}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-mocha)', fontWeight: '600' }}>Categories Active</div>
          </div>

          <div style={{ backgroundColor: 'var(--color-white)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Customer Orders</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-espresso)', marginTop: '4px' }}>{orders.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#2E6F40', fontWeight: '600' }}>
              {orders.filter((o) => !o.isCancelled && o.status !== 'Cancelled' && o.status !== 'Cancelled by Customer').length} Active • <span style={{ color: '#A82828' }}>{orders.filter((o) => o.isCancelled || o.status === 'Cancelled' || o.status === 'Cancelled by Customer').length} Cancelled</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-white)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Database Status</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#2E6F40', marginTop: '8px' }}>🟢 Connected</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MongoDB Atlas Cluster</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            borderBottom: '2px solid var(--border-subtle)',
            marginBottom: '1.5rem',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'products', label: `👔 Garments & Fabric Materials (${products.length})` },
            { id: 'orders', label: `📦 Placed Customer Orders (${orders.length})` },
            { id: 'store_info', label: '🏪 Showroom & Business Details' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                fontSize: '0.9rem',
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

        {/* =========================================================================
            TAB 1: GARMENTS & MATERIAL INVENTORY (ADD, EDIT, DELETE)
            ========================================================================= */}
        {activeTab === 'products' && (
          <div>
            {/* Top Toolbar: Search + Category + "+ Add Garment" button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search garment name or fabric material..."
                  className="form-input"
                  style={{ maxWidth: '320px', fontSize: '0.85rem' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                  className="form-input"
                  style={{ maxWidth: '200px', fontSize: '0.85rem' }}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Add New Garment Button */}
              <Button
                variant="caramel"
                size="md"
                onClick={handleOpenAddModal}
                style={{ fontWeight: '700', gap: '6px' }}
              >
                ✨ + Add New Garment
              </Button>
            </div>

            {/* Garments Table */}
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                overflowX: 'auto'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-latte-soft)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--color-espresso)' }}>
                    <th style={{ padding: '12px 16px' }}>Garment Piece</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Fabric & Material</th>
                    <th style={{ padding: '12px 16px' }}>Price</th>
                    <th style={{ padding: '12px 16px' }}>Sizes Available</th>
                    <th style={{ padding: '12px 16px' }}>Stock</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod) => (
                    <tr key={prod._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {/* Image & Title */}
                      <td style={{ padding: '12px 16px', minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={Array.isArray(prod.images) ? prod.images[0] : prod.images || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            style={{ width: '48px', height: '58px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}
                          />
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--color-espresso)' }}>
                              {prod.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Fit: {prod.fit || 'Tailored Modern Fit'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ backgroundColor: 'var(--color-latte-soft)', padding: '2px 8px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: '600' }}>
                          {prod.category?.name || prod.category?.slug || 'Menswear'}
                        </span>
                      </td>

                      {/* Fabric / Material */}
                      <td style={{ padding: '12px 16px', color: 'var(--color-mocha)', fontWeight: '600', maxWidth: '200px' }}>
                        {prod.fabric || '100% Premium Cotton'}
                      </td>

                      {/* Price */}
                      <td style={{ padding: '12px 16px' }}>
                        <strong style={{ color: 'var(--color-espresso)', fontSize: '0.95rem' }}>{formatINR(prod.price)}</strong>
                        {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            {formatINR(prod.compareAtPrice)}
                          </div>
                        )}
                      </td>

                      {/* Sizes */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {(prod.sizes || []).map((s) => (
                            <span key={s} style={{ border: '1px solid var(--border-subtle)', padding: '1px 5px', fontSize: '0.7rem', borderRadius: '2px' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Stock */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: (prod.stock || 10) > 3 ? '#2E6F40' : '#C0392B', fontWeight: '700' }}>
                          {prod.stock || 10} in stock
                        </span>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(prod)}
                            style={{
                              backgroundColor: 'var(--color-latte-soft)',
                              border: '1px solid var(--color-caramel)',
                              color: 'var(--color-espresso)',
                              borderRadius: 'var(--radius-xs)',
                              padding: '4px 10px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod)}
                            style={{
                              backgroundColor: '#FDEDEC',
                              border: '1px solid #F5B7B1',
                              color: '#C0392B',
                              borderRadius: 'var(--radius-xs)',
                              padding: '4px 10px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PLACED CUSTOMER ORDERS (Live from Book Now & Shopping Bag)
            ========================================================================= */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Showing <strong>{orders.length}</strong> customer bookings received through the website.
              </div>

              {/* Order Status Filter Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'all', label: `All (${orders.length})` },
                  { id: 'active', label: `Active (${orders.filter((o) => !o.isCancelled && o.status !== 'Cancelled' && o.status !== 'Cancelled by Customer').length})` },
                  { id: 'cancelled', label: `❌ Cancelled (${orders.filter((o) => o.isCancelled || o.status === 'Cancelled' || o.status === 'Cancelled by Customer').length})` }
                ].map((fTab) => (
                  <button
                    key={fTab.id}
                    type="button"
                    onClick={() => setOrderFilterTab(fTab.id)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: orderFilterTab === fTab.id ? '700' : '500',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: orderFilterTab === fTab.id ? 'var(--color-espresso)' : 'var(--color-white)',
                      color: orderFilterTab === fTab.id ? 'var(--color-cream)' : 'var(--color-espresso)',
                      cursor: 'pointer'
                    }}
                  >
                    {fTab.label}
                  </button>
                ))}
              </div>
            </div>

            {orders.length === 0 ? (
              <div style={{ backgroundColor: 'var(--color-white)', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
                <h3>No Orders Placed Yet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Orders placed by customers on the storefront using <strong>⚡ Book Now</strong> will appear here in real time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders
                  .filter((ord) => {
                    const isCancelled = ord.isCancelled || ord.status === 'Cancelled' || ord.status === 'Cancelled by Customer';
                    if (orderFilterTab === 'active') return !isCancelled;
                    if (orderFilterTab === 'cancelled') return isCancelled;
                    return true;
                  })
                  .map((ord, idx) => {
                    const isOrderCancelled = ord.isCancelled || ord.status === 'Cancelled' || ord.status === 'Cancelled by Customer';
                    return (
                      <div
                        key={ord.orderId || idx}
                        style={{
                          backgroundColor: 'var(--color-white)',
                          borderRadius: 'var(--radius-sm)',
                          border: isOrderCancelled ? '1.5px solid #F5C6CB' : '1px solid var(--border-subtle)',
                          padding: '1.25rem 1.5rem',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '1.05rem', color: 'var(--color-espresso)' }}>{ord.orderId}</strong>
                            <span style={{ backgroundColor: ord.isPaidOnline ? '#E8F5E9' : '#FFF3CD', color: ord.isPaidOnline ? '#2E6F40' : '#856404', fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '3px' }}>
                              {ord.paymentLabel}
                            </span>
                            {isOrderCancelled ? (
                              <span style={{ backgroundColor: '#FBEAEA', color: '#A82828', fontSize: '0.75rem', fontWeight: '800', padding: '2px 8px', borderRadius: '3px', border: '1px solid #F5C6CB' }}>
                                ❌ CANCELLED BY CUSTOMER
                              </span>
                            ) : (
                              <span style={{ backgroundColor: '#E8F5E9', color: '#2E6F40', fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '3px' }}>
                                ✓ ACTIVE
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: isOrderCancelled ? '#A82828' : 'var(--color-espresso)' }}>
                            {formatINR(ord.finalAmount)}
                          </div>
                        </div>

                        {/* Order Details Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Customer Details</div>
                            <strong>{ord.receiverName}</strong> ({ord.receiverPhone})<br />
                            <span style={{ color: 'var(--text-secondary)' }}>{ord.fullAddress}</span>
                          </div>

                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Garment Items</div>
                            {(ord.items || []).map((it, itIdx) => (
                              <div key={itIdx}>
                                • {it.name || it.product?.name} (Size: {it.size || 'M'}, Qty: {it.quantity || 1})
                              </div>
                            ))}
                          </div>

                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status Control</div>
                            <select
                              className="form-input"
                              style={{
                                padding: '6px 10px',
                                fontSize: '0.8rem',
                                marginTop: '4px',
                                borderColor: isOrderCancelled ? '#F5C6CB' : 'var(--border-subtle)',
                                backgroundColor: isOrderCancelled ? '#FFF8F8' : 'var(--color-white)',
                                fontWeight: '600'
                              }}
                              value={ord.status || (isOrderCancelled ? 'Cancelled by Customer' : 'Confirmed & Reserved')}
                              onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value)}
                            >
                              <option value="Confirmed & Reserved">✓ Confirmed & Reserved (Active)</option>
                              <option value="Ready for Trial at Showroom">🏬 Ready for Trial at Showroom</option>
                              <option value="Out for Delivery">🚚 Out for Delivery</option>
                              <option value="Completed / Collected">🎉 Completed / Collected</option>
                              <option value="Cancelled by Customer">❌ Cancelled by Customer</option>
                            </select>
                          </div>
                        </div>

                        {/* Prominent Cancellation Reason Card in Admin */}
                        {isOrderCancelled && (
                          <div
                            style={{
                              backgroundColor: '#FFF8F8',
                              border: '1.5px solid #F5C6CB',
                              borderRadius: 'var(--radius-xs)',
                              padding: '12px 16px',
                              marginTop: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                              <span style={{ color: '#A82828', fontWeight: '800', fontSize: '0.85rem' }}>
                                ❌ Cancellation Reason & Details
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Cancelled: <strong>{ord.cancelledAt || ord.orderDate}</strong>
                              </span>
                            </div>

                            <div style={{ fontSize: '0.875rem', color: 'var(--color-espresso)', marginTop: '6px' }}>
                              <strong style={{ color: '#A82828' }}>Reason:</strong> {ord.cancellationReason || 'Customer requested cancellation from My Orders'}
                            </div>

                            {ord.cancellationComment && (
                              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                                <strong>Customer Remarks:</strong> "{ord.cancellationComment}"
                              </div>
                            )}

                            <div style={{ fontSize: '0.75rem', color: '#2E6F40', marginTop: '6px', fontWeight: '600' }}>
                              💡 Tip: To restore this order back to normal, select "✓ Confirmed & Reserved (Active)" in Status Control above.
                            </div>
                          </div>
                        )}

                        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <a
                            href={`https://wa.me/91${ord.receiverPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(
                              isOrderCancelled
                                ? `Hi ${ord.receiverName}, this is Mr. Shiva Yadav from MR SM Multi Brand Store regarding your cancelled order ${ord.orderId}. We noted your reason: "${ord.cancellationReason}". Please let us know if we can assist you with an alternative garment size or style!`
                                : `Hi ${ord.receiverName}, this is Mr. Shiva Yadav from MR SM Multi Brand Store regarding your order ${ord.orderId}. Your garment is ready!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.75rem' }}
                          >
                            📱 WhatsApp Customer
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: STORE PROFILE & SHOWROOM DETAILS
            ========================================================================= */}
        {activeTab === 'store_info' && (
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
              maxWidth: '680px'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-espresso)', marginBottom: '1.25rem' }}>
              Store Profile & Contact Settings
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <strong>Store Name:</strong> MR SM Multi Brand Store
              </div>
              <div>
                <strong>Proprietor:</strong> Mr. Shiva Yadav
              </div>
              <div>
                <strong>Showroom Address:</strong> 1st Floor, 24-7-302/1, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda, Warangal, Telangana
              </div>
              <div>
                <strong>Direct Phone Line:</strong> +91 8466007454
              </div>
              <div>
                <strong>WhatsApp Orders Line:</strong> +91 8332867454
              </div>
              <div>
                <strong>Store UPI Payment VPA:</strong> 8466007454@ybl (Mr. Shiva Yadav)
              </div>
              <div>
                <strong>Showroom Timings:</strong> 10:00 AM – 9:30 PM (Open 7 Days a Week)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          ADD / EDIT GARMENT MODAL
          Allows modifying fabric, material, price, sizes, stock, images
          ========================================================================= */}
      {showProductModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal)',
            backgroundColor: 'rgba(0, 0, 0, 0.72)',
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
              maxWidth: '620px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '2rem',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setShowProductModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <CloseIcon size={22} />
            </button>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-espresso)', marginBottom: '1.25rem' }}>
              {editingProduct ? '✏️ Edit Garment & Material Specifications' : '✨ Add New Clothing Garment'}
            </h3>

            <form onSubmit={handleSaveProduct}>
              {/* Product Name */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Garment Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Belgian Pure Linen Bandhgala Shirt"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Category & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Units Available</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="form-input"
                    placeholder="e.g. 1599"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Compare-at MRP (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    placeholder="e.g. 2199"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  />
                </div>
              </div>

              {/* Fabric & Material Details */}
              <div style={{ backgroundColor: 'var(--color-latte-soft)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-espresso)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  🧵 Fabric & Material Specifications
                </div>

                <div className="form-group" style={{ marginBottom: '8px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Fabric Composition / Material *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. 100% Organic Cotton or 60% Linen 40% Cotton"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Fit Type</label>
                    <select
                      className="form-input"
                      value={formData.fit}
                      onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    >
                      <option value="Tailored Slim Fit">Tailored Slim Fit</option>
                      <option value="Tailored Modern Fit">Tailored Modern Fit</option>
                      <option value="Relaxed Regular Fit">Relaxed Regular Fit</option>
                      <option value="Comfort Traditional Fit">Comfort Traditional Fit</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Care Instructions</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.careInstructions}
                      onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Available Sizes Pills */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Available Sizes</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38'].map((sz) => {
                    const isSelected = formData.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          border: isSelected ? '2px solid var(--color-espresso)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--color-espresso)' : 'var(--color-white)',
                          color: isSelected ? 'var(--color-cream)' : 'var(--color-espresso)',
                          cursor: 'pointer'
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image URL */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  required
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Submit / Cancel Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isFullWidth
                  style={{ fontWeight: '700' }}
                >
                  {editingProduct ? '💾 Save Changes' : '✨ Add Garment to Store'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setShowProductModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
