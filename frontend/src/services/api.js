import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES } from './sampleData';

const API_BASE_URL = '/api';
const CUSTOM_PRODUCTS_KEY = 'mrsm_custom_products';
const DELETED_PRODUCTS_KEY = 'mrsm_deleted_product_ids';

/**
 * Storage helpers for admin persistent products
 */
export function getCustomProductsFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function saveCustomProductsToStorage(prods) {
  try {
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(prods));
  } catch (e) {
    console.error('Error writing custom products to localStorage:', e);
  }
}

export function getDeletedProductIds() {
  try {
    return JSON.parse(localStorage.getItem(DELETED_PRODUCTS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function addDeletedProductId(id) {
  try {
    const list = getDeletedProductIds();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(list));
    }
  } catch (e) {}
}

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
    console.warn(`[MR SM API] Falling back to local data for "${endpoint}": ${err.message}`);
    return null;
  }
}

/**
 * Fetch products with optional filtering, search, and sorting
 * Seamlessly merges live API, local custom products, and sample catalogue
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
  let baseList = [];

  const result = await fetchApi(`/products${queryString}`);
  if (result && result.success && Array.isArray(result.data)) {
    baseList = result.data;
  } else {
    baseList = [...SAMPLE_PRODUCTS];
  }

  // Load custom products added via Admin Portal
  const customProducts = getCustomProductsFromStorage();
  const deletedIds = getDeletedProductIds();

  // Combine custom products (at top) with base catalogue, excluding deleted items
  const combined = [...customProducts, ...baseList].filter(
    (p) => !deletedIds.includes(p._id) && !deletedIds.includes(p.slug)
  );

  // Deduplicate by ID
  const seen = new Set();
  let uniqueList = [];
  for (const item of combined) {
    const key = item._id || item.slug;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(item);
    }
  }

  // Filter by category
  if (params.category && params.category !== 'all') {
    uniqueList = uniqueList.filter(
      (p) =>
        p.category?.slug === params.category ||
        p.category?._id === params.category ||
        p.categorySlug === params.category
    );
  }

  // Filter by search
  if (params.search && params.search.trim()) {
    const term = params.search.toLowerCase().trim();
    uniqueList = uniqueList.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.name?.toLowerCase().includes(term) ||
        p.fabric?.toLowerCase().includes(term) ||
        p.tags?.some((t) => t.toLowerCase().includes(term))
    );
  }

  // Filter by featured
  if (params.featured) {
    uniqueList = uniqueList.filter((p) => p.isFeatured);
  }

  // Filter by newArrival (Ensure newly added admin products are ALWAYS included!)
  if (params.newArrival) {
    uniqueList = uniqueList.filter((p) => p.isNewArrival === true);
  }

  // Filter by onSale
  if (params.onSale) {
    uniqueList = uniqueList.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
  }

  // Sorting
  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        uniqueList.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        uniqueList.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        uniqueList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'newest':
      default:
        // Maintains newly added custom items at the top
        break;
    }
  }

  return uniqueList;
}

/**
 * Fetch a single product by ID or Slug
 */
export async function getProductById(idOrSlug) {
  // 1. Check custom admin products in localStorage first
  const customProducts = getCustomProductsFromStorage();
  const foundCustom = customProducts.find((p) => p._id === idOrSlug || p.slug === idOrSlug);
  if (foundCustom) {
    return foundCustom;
  }

  // 2. Fetch from backend API
  const result = await fetchApi(`/products/${idOrSlug}`);
  if (result && result.success && result.data) {
    return result.data;
  }

  // 3. Fallback to sample static products
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

  const customProducts = getCustomProductsFromStorage();
  const allProds = [...customProducts, ...SAMPLE_PRODUCTS];
  return allProds.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
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
 * Guarantees isNewArrival: true, resolves category object, and saves to localStorage
 */
export async function createProduct(productData) {
  // Always mark new products as New Arrivals as requested
  const productToSave = {
    ...productData,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  };

  // Resolve category name and slug
  const cats = await getCategories();
  const matchedCat = cats.find(
    (c) => c.slug === productData.category || c._id === productData.category
  );

  if (matchedCat) {
    productToSave.category = {
      _id: matchedCat._id,
      name: matchedCat.name,
      slug: matchedCat.slug,
      image: matchedCat.image
    };
  } else {
    const slugName = (productData.category || 'formal-shirts').toLowerCase().replace(/\s+/g, '-');
    productToSave.category = {
      name: productData.category || 'Formal Shirts',
      slug: slugName
    };
  }

  // 1. Try sending to backend API
  let backendResult = null;
  try {
    backendResult = await fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify(productToSave)
    });
  } catch (err) {
    console.warn('Backend product creation notice:', err);
  }

  const finalProduct =
    backendResult && backendResult.success && backendResult.data
      ? backendResult.data
      : {
          _id: `prod_custom_${Date.now()}`,
          slug:
            productToSave.slug ||
            productToSave.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
          ...productToSave
        };

  // Guarantee isNewArrival on final product object
  finalProduct.isNewArrival = true;

  // 2. Persist to localStorage so it is 100% accessible in the User Portal across refreshes
  const customList = getCustomProductsFromStorage();
  const updatedList = [finalProduct, ...customList.filter((p) => p._id !== finalProduct._id)];
  saveCustomProductsToStorage(updatedList);

  return finalProduct;
}

/**
 * Admin: Update an existing product
 */
export async function updateProduct(id, productData) {
  // 1. Call backend API
  try {
    await fetchApi(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  } catch (e) {}

  // 2. Persist to localStorage
  const customList = getCustomProductsFromStorage();
  const idx = customList.findIndex((p) => p._id === id || p.slug === id);

  if (idx !== -1) {
    customList[idx] = { ...customList[idx], ...productData, updatedAt: new Date().toISOString() };
    saveCustomProductsToStorage(customList);
    return customList[idx];
  } else {
    // If updating a stock product, save customized version
    const updated = { ...productData, _id: id, updatedAt: new Date().toISOString() };
    saveCustomProductsToStorage([updated, ...customList]);
    return updated;
  }
}

/**
 * Admin: Delete a product
 */
export async function deleteProduct(id) {
  // 1. Call backend API
  try {
    await fetchApi(`/products/${id}`, { method: 'DELETE' });
  } catch (e) {}

  // 2. Remove from localStorage custom products
  const customList = getCustomProductsFromStorage();
  const filtered = customList.filter((p) => p._id !== id && p.slug !== id);
  saveCustomProductsToStorage(filtered);

  // 3. Mark in deleted IDs so stock products also disappear from user portal
  addDeletedProductId(id);
  return true;
}
