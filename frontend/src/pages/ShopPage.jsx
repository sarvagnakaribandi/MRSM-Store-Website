import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import SearchBar from '../components/product/SearchBar';
import ErrorMessage from '../components/common/ErrorMessage';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Read filter values from URL query parameters
  const selectedCategory = searchParams.get('category') || 'all';
  const searchTerm = searchParams.get('search') || '';
  const selectedSort = searchParams.get('sort') || 'newest';

  // Load Categories once
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((cats) => {
        if (isMounted) setCategories(cats);
      })
      .catch((err) => console.error('Failed to load categories', err));
    return () => { isMounted = false; };
  }, []);

  // Fetch Products whenever filters change
  useEffect(() => {
    let isMounted = true;

    async function loadFilteredProducts() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getProducts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchTerm || undefined,
          sort: selectedSort
        });

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || 'Unable to load products.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFilteredProducts();
    return () => { isMounted = false; };
  }, [selectedCategory, searchTerm, selectedSort]);

  // Handlers to update URL search params
  const handleCategoryChange = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug === 'all') {
      next.delete('category');
    } else {
      next.set('category', slug);
    }
    setSearchParams(next);
  };

  const handleSearchChange = (val) => {
    const next = new URLSearchParams(searchParams);
    if (!val) {
      next.delete('search');
    } else {
      next.set('search', val);
    }
    setSearchParams(next);
  };

  const handleSortChange = (sortOption) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', sortOption);
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = selectedCategory !== 'all' || Boolean(searchTerm) || selectedSort !== 'newest';

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="section-eyebrow">Explore Collections</span>
          <h1 style={{ marginBottom: '0.5rem' }}>Men's Wear Catalogue</h1>
          <p style={{ maxWidth: '650px', color: 'var(--text-muted)' }}>
            Browse through our multi-brand selection of executive formal shirts, casual polos, stretch chinos, selvedge denim, and festive occasion wear.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '1.5rem', maxWidth: '600px' }}>
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by product name, fabric, or style..."
          />
        </div>

        {/* Category & Sort Filters */}
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          selectedSort={selectedSort}
          onSelectSort={handleSortChange}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          totalResults={products.length}
        />

        {/* Results Area */}
        {errorMessage ? (
          <ErrorMessage
            title="Catalogue Error"
            message={errorMessage}
            onRetry={() => {
              const current = new URLSearchParams(searchParams);
              setSearchParams(current);
            }}
          />
        ) : (
          <ProductGrid
            products={products}
            isLoading={isLoading}
            emptyTitle={searchTerm ? `No results for "${searchTerm}"` : 'No products found'}
            emptyMessage="Try clearing your filters or exploring another men's clothing category."
            onResetFilters={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default ShopPage;
