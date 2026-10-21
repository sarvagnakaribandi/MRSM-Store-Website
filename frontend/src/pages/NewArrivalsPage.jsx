import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getProducts({ newArrival: true })
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="section-eyebrow">Fresh In Store</span>
          <h1 style={{ marginBottom: '0.5rem' }}>New Seasonal Arrivals</h1>
          <p style={{ maxWidth: '650px', color: 'var(--text-muted)' }}>
            The latest garments just unpacked at MR SM Multi Brand Store in Hanamkonda. Featuring new weave formal shirts, breathable resort linen, and seasonal fits.
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading newest arrivals..." />
        ) : (
          <ProductGrid
            products={products}
            emptyTitle="No New Arrivals Currently"
            emptyMessage="Check back soon as new seasonal stock arrives every week at the showroom."
          />
        )}
      </div>
    </div>
  );
};

export default NewArrivalsPage;
