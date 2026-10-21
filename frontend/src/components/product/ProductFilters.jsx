import React from 'react';
import Button from '../common/Button';

export const ProductFilters = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  selectedSort = 'newest',
  onSelectSort,
  onResetFilters,
  hasActiveFilters = false,
  totalResults = 0
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Top Row: Categories Navigation Pills */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            color: 'var(--color-mocha)',
            letterSpacing: '0.06em',
            marginBottom: '0.75rem'
          }}
        >
          Categories
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: selectedCategory === 'all' ? '700' : '500',
              backgroundColor: selectedCategory === 'all' ? 'var(--color-espresso)' : 'var(--color-latte-soft)',
              color: selectedCategory === 'all' ? 'var(--color-cream)' : 'var(--color-espresso)',
              border: selectedCategory === 'all' ? '1px solid var(--color-espresso)' : '1px solid var(--border-subtle)',
              transition: 'all var(--transition-fast)'
            }}
          >
            All Products
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug || cat._id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? '700' : '500',
                  backgroundColor: isSelected ? 'var(--color-espresso)' : 'var(--color-latte-soft)',
                  color: isSelected ? 'var(--color-cream)' : 'var(--color-espresso)',
                  border: isSelected ? '1px solid var(--color-espresso)' : '1px solid var(--border-subtle)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Sort Selector & Active Filters Status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'item' : 'items'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label
              htmlFor="product-sort-select"
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--color-espresso)',
                whiteSpace: 'nowrap'
              }}
            >
              Sort By:
            </label>
            <select
              id="product-sort-select"
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value)}
              className="form-select"
              style={{
                padding: '6px 12px',
                fontSize: '0.85rem',
                height: '38px',
                width: 'auto'
              }}
            >
              <option value="newest">Featured & Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline-caramel"
              size="sm"
              onClick={onResetFilters}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
