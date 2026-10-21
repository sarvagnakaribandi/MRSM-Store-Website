import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, checkHealth } from '../services/api';
import { formatINR } from '../components/common/PriceDisplay';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  CheckIcon,
  PhoneIcon,
  WhatsAppIcon,
  MapPinIcon,
  CloseIcon,
  BagIcon
} from '../components/common/Icons';

export const AdminPortalPage = () => {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'add' | 'orders' | 'store'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  // New Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'formal-shirts',
    price: '',
    compareAtPrice: '',
    fabric: '100% Giza Cotton (80s Two-Ply)',
    fit: 'Tailored Modern Fit',
    careInstructions: 'Machine wash cold with like colours, warm iron',
    sizes: ['M', 'L', 'XL'],
    colours: [{ name: 'Navy Blue', hex: '#1B263B' }],
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'],
    stock: 15,
    isFeatured: false,
    isNewArrival: true,
    description: ''
  });

  // Quick preset image selector for new products
  const PRESET_IMAGES = [
    { label: 'Formal Shirt', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
    { label: 'Casual Linen', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Chinos / Trousers', url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Selvedge Denim', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80' },
    { label: 'Ethnic Kurta', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Nehru Jacket', url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80' }
  ];

  // Load initial data
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
      console.error('Error loading admin portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadData();
  }, []);

  const showNotification = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000);
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category?.slug === selectedCategory ||
      p.category?._id === selectedCategory;

    const term = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.name?.toLowerCase().includes(term) ||
      p.fabric?.toLowerCase().includes(term) ||
      p.category?.name?.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  // Handle Create Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showNotification('Please provide at least a garment name and price', 'error');
      return;
    }

    try {
      const res = await createProduct({
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        stock: Number(formData.stock)
      });

      showNotification(`✓ "${formData.name}" added to storefront successfully!`, 'success');
      // Reset form
      setFormData({
        name: '',
        category: 'formal-shirts',
        price: '',
        compareAtPrice: '',
        fabric: '100% Giza Cotton',
        fit: 'Tailored Modern Fit',
        careInstructions: 'Machine wash cold with like colours',
        sizes: ['M', 'L', 'XL'],
        colours: [{ name: 'Navy Blue', hex: '#1B263B' }],
        images: [PRESET_IMAGES[0].url],
        stock: 15,
        isFeatured: false,
        isNewArrival: true,
        description: ''
      });

      // Reload products and switch to inventory tab
      await loadData();
      setActiveTab('inventory');
    } catch (err) {
      showNotification('Failed to create product: ' + err.message, 'error');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the store catalogue?`)) {
      return;
    }

    try {
      await deleteProduct(id);
      showNotification(`✓ "${name}" removed from catalogue`, 'success');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      showNotification('Failed to remove product: ' + err.message, 'error');
    }
  };

  // Handle Save Edited Product
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct._id, {
        name: editingProduct.name,
        price: Number(editingProduct.price),
        compareAtPrice: editingProduct.compareAtPrice ? Number(editingProduct.compareAtPrice) : null,
        fabric: editingProduct.fabric,
        fit: editingProduct.fit,
        careInstructions: editingProduct.careInstructions,
        stock: Number(editingProduct.stock),
        isFeatured: Boolean(editingProduct.isFeatured),
        isNewArrival: Boolean(editingProduct.isNewArrival)
      });

      showNotification(`✓ Specifications for "${editingProduct.name}" updated!`, 'success');
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      showNotification('Failed to update product: ' + err.message, 'error');
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '85vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Top Breadcrumb & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'var(--color-mocha)' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--color-espresso)', fontWeight: '700' }}>Admin Portal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2E6F40', display: 'inline-block' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2E6F40', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Manager Session Active: Mr. Shiva Yadav
            </span>
          </div>
        </div>

        {/* Portal Header */}
        <div
          style={{
            backgroundColor: 'var(--color-espresso)',
            color: 'var(--color-cream)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem 2.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-caramel)', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Store Management Console
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', margin: '4px 0 6px 0', color: 'var(--color-cream)' }}>
              MR SM Admin Portal
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-latte)' }}>
              Add new garments, update fabric & material specifications, adjust prices, and control store reservations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/shop" target="_blank" className="btn btn-outline btn-sm" style={{ color: 'var(--color-cream)', borderColor: 'rgba(231,214,193,0.3)' }}>
              ↗ View Live Storefront
            </Link>
          </div>
        </div>

        {/* Status Notification Toast */}
        {statusMessage.text && (
          <div
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              fontWeight: '600',
              fontSize: '0.9rem',
              backgroundColor: statusMessage.type === 'error' ? 'var(--status-error-bg)' : '#E8F5E9',
              color: statusMessage.type === 'error' ? 'var(--status-error)' : '#2E6F40',
              border: `1px solid ${statusMessage.type === 'error' ? '#F5C6CB' : '#C8E6C9'}`
            }}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Metrics Overview Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ backgroundColor: 'var(--color-white)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Catalogue Items</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-espresso)', marginTop: '4px' }}>{products.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#2E6F40', marginTop: '2px' }}>Active in Storefront</div>
          </div>

          <div style={{ backgroundColor: 'var(--color-white)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clothing Categories</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-espresso)', marginTop: '4px' }}>{categories.length || 6}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-mocha)', marginTop: '2px' }}>Curated Men's Wear</div>
          </div>

          <div style={{ backgroundColor: 'var(--color-white)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bookings & Orders</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-espresso)', marginTop: '4px' }}>{orders.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#2E6F40', marginTop: '2px' }}>Inquiries & Trials</div>
          </div>

          <div style={{ backgroundColor: 'var(--color-white)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Showroom Location</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-espresso)', marginTop: '4px' }}>Subedari, Hanamkonda</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Opp. Royal Enfield</div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
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
            { id: 'inventory', label: `📦 Manage Inventory (${products.length})` },
            { id: 'add', label: '➕ Add New Garment' },
            { id: 'orders', label: `📋 Customer Orders (${orders.length})` },
            { id: 'store', label: '🏪 Store Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? '800' : '600',
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
            TAB 1: MANAGE INVENTORY & MATERIAL SPECIFICATIONS
            ========================================================================= */}
        {activeTab === 'inventory' && (
          <div>
            {/* Filters Bar */}
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '260px' }}>
                <input
                  type="text"
                  placeholder="Search by garment title, fabric material..."
                  className="form-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select"
                  style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c._id || c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('add')}
                >
                  + Add Product
                </Button>
              </div>
            </div>

            {/* Products Data Table */}
            {isLoading ? (
              <LoadingSpinner message="Loading store inventory..." />
            ) : filteredProducts.length === 0 ? (
              <div style={{ backgroundColor: 'var(--color-white)', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <h3>No garments match your search filter</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search term or category dropdown.</p>
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-cream)', borderBottom: '2px solid var(--border-subtle)', color: 'var(--color-espresso)' }}>
                        <th style={{ padding: '12px 16px' }}>Garment Details</th>
                        <th style={{ padding: '12px 16px' }}>Category</th>
                        <th style={{ padding: '12px 16px' }}>Fabric & Material</th>
                        <th style={{ padding: '12px 16px' }}>Price / MRP</th>
                        <th style={{ padding: '12px 16px' }}>Stock</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          {/* Garment Image + Name */}
                          <td style={{ padding: '12px 16px', minWidth: '220px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={Array.isArray(p.images) && p.images[0] ? p.images[0] : PRESET_IMAGES[0].url}
                                alt=""
                                style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}
                              />
                              <div>
                                <strong style={{ color: 'var(--color-espresso)', display: 'block' }}>{p.name}</strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Sizes: {(p.sizes || []).join(', ')}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td style={{ padding: '12px 16px', color: 'var(--color-mocha)', fontWeight: '600' }}>
                            {p.category?.name || 'General'}
                          </td>

                          {/* Fabric / Material */}
                          <td style={{ padding: '12px 16px', maxWidth: '240px' }}>
                            <div style={{ fontWeight: '600', color: 'var(--color-espresso)' }}>
                              {p.fabric || '100% Cotton'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Fit: {p.fit || 'Modern Fit'}
                            </div>
                          </td>

                          {/* Price */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: '800', color: 'var(--color-espresso)' }}>
                              {formatINR(p.price)}
                            </div>
                            {p.compareAtPrice && p.compareAtPrice > p.price && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                {formatINR(p.compareAtPrice)}
                              </div>
                            )}
                          </td>

                          {/* Stock */}
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontWeight: '700', color: (p.stock || 10) > 3 ? '#2E6F40' : 'var(--status-error)' }}>
                              {p.stock !== undefined ? p.stock : 12} units
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              type="button"
                              onClick={() => setEditingProduct({ ...p })}
                              style={{
                                padding: '4px 10px',
                                marginRight: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                backgroundColor: 'var(--color-latte-soft)',
                                color: 'var(--color-espresso)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '3px',
                                cursor: 'pointer'
                              }}
                            >
                              ✏️ Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p._id, p.name)}
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                backgroundColor: '#FFEBEE',
                                color: '#C62828',
                                border: '1px solid #FFCDD2',
                                borderRadius: '3px',
                                cursor: 'pointer'
                              }}
                            >
                              🗑️ Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: ADD NEW GARMENT & MATERIAL SPECIFICATIONS FORM
            ========================================================================= */}
        {activeTab === 'add' && (
          <div style={{ backgroundColor: 'var(--color-white)', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)', margin: '0 0 4px 0' }}>
                Add New Garment to Storefront
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                Enter the product title, material composition, selling price, and size variants for MR SM Multi Brand Store.
              </p>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Garment Name */}
                <div className="form-group">
                  <label className="form-label">Garment Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Royal Giza Cotton Mandarin Collar Shirt"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="formal-shirts">Formal Shirts</option>
                    <option value="casual-shirts">Casual Shirts</option>
                    <option value="trousers-chinos">Trousers & Chinos</option>
                    <option value="denim-jeans">Denim & Jeans</option>
                    <option value="ethnic-wear">Ethnic Wear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                {/* Selling Price */}
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    placeholder="e.g. 1599"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                {/* Compare At Price (MRP) */}
                <div className="form-group">
                  <label className="form-label">Original MRP / Compare Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    placeholder="e.g. 2199"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  />
                </div>

                {/* Fabric & Material Details */}
                <div className="form-group">
                  <label className="form-label">Fabric & Material Composition *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. 100% Giza Cotton (80s Two-Ply)"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Shown directly on the product details page & size chart.
                  </div>
                </div>

                {/* Fit Type */}
                <div className="form-group">
                  <label className="form-label">Fit Specification</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tailored Slim Fit"
                    value={formData.fit}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                  />
                </div>

                {/* Care Guide */}
                <div className="form-group">
                  <label className="form-label">Care Instructions</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Machine wash cold with like colours, warm iron"
                    value={formData.careInstructions}
                    onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  />
                </div>

                {/* Stock Count */}
                <div className="form-group">
                  <label className="form-label">Initial Showroom Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    placeholder="e.g. 15"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              {/* Photo Preset Selector */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Select Garment Photo (Or paste custom URL below)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, images: [img.url] })}
                      style={{
                        padding: '6px',
                        borderRadius: '4px',
                        border: formData.images[0] === img.url ? '2px solid var(--color-caramel)' : '1px solid var(--border-subtle)',
                        backgroundColor: '#FAFAFA',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <img src={img.url} alt="" style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '2px' }} />
                      <div style={{ fontSize: '0.7rem', fontWeight: '700', marginTop: '4px' }}>{img.label}</div>
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              {/* Checkboxes: Flags */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  />
                  <span>Mark as New Arrival (Shows on Homepage banner)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Feature in Highlights</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button type="submit" variant="primary" size="lg" style={{ fontWeight: '700' }}>
                  💾 Save Garment to Storefront
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => setActiveTab('inventory')}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 3: CUSTOMER PLACED ORDERS & RESERVATIONS
            ========================================================================= */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-espresso)', margin: 0 }}>
                Live Customer Orders & Showroom Bookings
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {orders.length} order(s) registered
              </span>
            </div>

            {orders.length === 0 ? (
              <div style={{ backgroundColor: 'var(--color-white)', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <h3>No Customer Orders Placed Yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>When customers use "Book Now" or bag checkout, reservations will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {orders.map((ord, idx) => (
                  <div
                    key={ord.orderId || idx}
                    style={{
                      backgroundColor: 'var(--color-white)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--color-espresso)' }}>{ord.orderId}</strong>
                          <span style={{ backgroundColor: '#E8F5E9', color: '#2E6F40', fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '3px' }}>
                            {ord.isPaidOnline ? 'PAID VIA UPI' : 'CASH ON DELIVERY'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Placed on {ord.orderDate}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-espresso)' }}>
                          {formatINR(ord.finalAmount)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#2E6F40', fontWeight: '600' }}>
                          {ord.paymentLabel}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', fontSize: '0.85rem' }}>
                      <div>
                        <strong>Customer:</strong> {ord.receiverName} ({ord.receiverPhone})<br />
                        <strong>Destination:</strong> {ord.fullAddress}
                      </div>

                      <div>
                        <strong>Garments:</strong>
                        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                          {(ord.items || []).map((it, iIdx) => (
                            <li key={iIdx}>
                              {it.name || it.product?.name} (Size: {it.size}, Qty: {it.quantity || 1})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem', paddingTop: '10px', borderTop: '1px dashed var(--border-subtle)', display: 'flex', gap: '10px' }}>
                      <a
                        href={`https://wa.me/${ord.receiverPhone}?text=${encodeURIComponent(`Hi ${ord.receiverName}, this is Shiva Yadav from MR SM Multi Brand Store regarding your order ${ord.orderId}. Your clothing reservation is confirmed!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-caramel btn-sm"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <WhatsAppIcon size={14} /> Message Customer on WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: STORE SETTINGS & CONTACT INFORMATION
            ========================================================================= */}
        {activeTab === 'store' && (
          <div style={{ backgroundColor: 'var(--color-white)', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso)', marginBottom: '1rem' }}>
              Store Identity & Contact Details
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Store Name:</strong> MR SM Multi Brand Store<br />
                <strong>Proprietor:</strong> Mr. Shiva Yadav<br />
                <strong>Direct Call:</strong> +91 8466007454<br />
                <strong>WhatsApp:</strong> +91 8332867454<br />
                <strong>UPI VPA:</strong> 8466007454@ybl
              </div>

              <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Showroom Address:</strong><br />
                1st Floor, 24-7-302/1,<br />
                Opp. Royal Enfield Showroom, Beside A to Z Medicals,<br />
                Subedari, Hanamkonda, Warangal, Telangana — 506001
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            INLINE EDIT PRODUCT MODAL
            ========================================================================= */}
        {editingProduct && (
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
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                position: 'relative',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <CloseIcon size={22} />
              </button>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-espresso)' }}>
                Edit Garment & Material Specifications
              </h3>

              <form onSubmit={handleSaveEdit}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Garment Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">MRP (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editingProduct.compareAtPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, compareAtPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Fabric / Material Composition</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingProduct.fabric || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Fit Specification</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingProduct.fit || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fit: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Showroom Stock</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editingProduct.stock !== undefined ? editingProduct.stock : 12}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Care Instructions</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingProduct.careInstructions || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, careInstructions: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button type="submit" variant="primary" isFullWidth>
                    💾 Save Changes
                  </Button>
                  <Button type="button" variant="outline" isFullWidth onClick={() => setEditingProduct(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortalPage;
