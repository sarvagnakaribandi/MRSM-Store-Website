import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES } from './sampleData';

const API_BASE_URL = '/api';

/**
 * Helper to execute fetch requests with fallback support
 */
async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    // Return null to signal fallback to local sample data
    console.warn(`[MR SM API] Falling back to demo data for "${endpoint}": ${err.message}`);
    return null;
  }
}

/**
 * Fetch products with optional filtering, search, and sorting
 */
export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.sort) query.set('sort', params.sort);
  if (params.featured) query.set('featured', 'true');
  if (params.newArrival) query.set('newArrival', 'true');
  if (params.onSale) query.set('onSale', 'true');

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const result = await fetchApi(`/products${queryString}`);

  if (result && result.success && Array.isArray(result.data)) {
    return result.data;
  }

  // Client-side fallback filter
  let filtered = [...SAMPLE_PRODUCTS];

  if (params.category && params.category !== 'all') {
    filtered = filtered.filter(
      (p) => p.category?.slug === params.category || p.category?._id === params.category
    );
  }

  if (params.search) {
    const term = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category?.name.toLowerCase().includes(term) ||
        p.tags?.some((t) => t.toLowerCase().includes(term))
    );
  }

  if (params.featured) {
    filtered = filtered.filter((p) => p.isFeatured);
  }

  if (params.newArrival) {
    filtered = filtered.filter((p) => p.isNewArrival);
  }

  if (params.onSale) {
    filtered = filtered.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
  }

  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        // maintain order or sort
        break;
    }
  }

  return filtered;
}

/**
 * Fetch a single product by ID or Slug
 */
export async function getProductById(idOrSlug) {
  const result = await fetchApi(`/products/${idOrSlug}`);
  if (result && result.success && result.data) {
    return result.data;
  }

  return SAMPLE_PRODUCTS.find((p) => p._id === idOrSlug || p.slug === idOrSlug) || null;
}

/**
 * Fetch all categories
 */
export async function getCategories() {
  const result = await fetchApi('/categories');
  if (result && result.success && Array.isArray(result.data)) {
    return result.data;
  }

  return SAMPLE_CATEGORIES;
}

/**
 * Fetch promotional offers
 */
export async function getOffers() {
  const result = await fetchApi('/offers');
  if (result && result.success && Array.isArray(result.data)) {
    return result.data;
  }

  return SAMPLE_PRODUCTS.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
}

/**
 * Submit contact inquiry
 */
export async function submitContactInquiry(formData) {
  const result = await fetchApi('/contact', {
    method: 'POST',
    body: JSON.stringify(formData)
  });

  if (result && result.success) {
    return result;
  }

  // Simulated successful submission for demo when backend is offline
  return {
    success: true,
    message: 'Thank you! Your message has been received by MR SM Store. We will call you shortly.'
  };
}

/**
 * Check backend health
 */
export async function checkHealth() {
  const result = await fetchApi('/health');
  return result || { success: false, status: 'offline' };
}

/**
 * Admin: Create a new product
 */
export async function createProduct(productData) {
  const result = await fetchApi('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });

  if (result && result.success) {
    return result.data;
  }

  // Client-side fallback: add to memory / local store
  const newProduct = {
    _id: `prod_local_${Date.now()}`,
    ...productData,
    createdAt: new Date().toISOString()
  };
  SAMPLE_PRODUCTS.unshift(newProduct);
  return newProduct;
}

/**
 * Admin: Update an existing product
 */
export async function updateProduct(id, productData) {
  const result = await fetchApi(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });

  if (result && result.success) {
    return result.data;
  }

  // Client fallback
  const idx = SAMPLE_PRODUCTS.findIndex((p) => p._id === id || p.slug === id);
  if (idx !== -1) {
    SAMPLE_PRODUCTS[idx] = { ...SAMPLE_PRODUCTS[idx], ...productData };
    return SAMPLE_PRODUCTS[idx];
  }
  return productData;
}

/**
 * Admin: Delete a product
 */
export async function deleteProduct(id) {
  const result = await fetchApi(`/products/${id}`, {
    method: 'DELETE'
  });

  if (result && result.success) {
    return true;
  }

  // Client fallback
  const idx = SAMPLE_PRODUCTS.findIndex((p) => p._id === id || p.slug === id);
  if (idx !== -1) {
    SAMPLE_PRODUCTS.splice(idx, 1);
  }
  return true;
}

