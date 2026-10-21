import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

export const ProductGrid = ({
  products = [],
  isLoading = false,
  emptyTitle = 'No products found',
  emptyMessage = 'No clothing items match the selected filter criteria.',
  onResetFilters = null
}) => {
  if (isLoading) {
    return <LoadingSpinner message="Curating men's wear collection..." />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyMessage}
        actionText="Reset All Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid-3" style={{ gap: '2rem' }}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
