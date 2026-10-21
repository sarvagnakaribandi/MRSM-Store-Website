import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'mrsm_bag_v1';

const BagContext = createContext(null);

export const BagProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.warn('Unable to read shopping bag from localStorage', err);
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Unable to persist shopping bag to localStorage', err);
    }
  }, [items]);

  // Show auto-dismissing toast feedback
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  /**
   * Add a product variant to the bag
   */
  const addToBag = (product, size, colour, quantity = 1) => {
    if (!product || !product._id) {
      return { success: false, error: 'Invalid product' };
    }
    if (!size) {
      return { success: false, error: 'Please select a size' };
    }
    if (!colour) {
      return { success: false, error: 'Please select a colour' };
    }

    const colourName = typeof colour === 'string' ? colour : colour.name;
    const colourHex = typeof colour === 'object' && colour.hex ? colour.hex : '#2B1D17';
    const variantId = `${product._id}_${size}_${colourName}`;
    const availableStock = typeof product.stock === 'number' ? product.stock : 10;

    let updated = false;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === variantId);

      if (existingIndex > -1) {
        // Variant already in bag: increment quantity
        const existingItem = prevItems[existingIndex];
        const newQty = Math.min(existingItem.quantity + quantity, availableStock);
        const newItems = [...prevItems];
        newItems[existingIndex] = {
          ...existingItem,
          quantity: newQty
        };
        updated = true;
        return newItems;
      } else {
        // Add new line item
        const newItem = {
          id: variantId,
          productId: product._id,
          name: product.name,
          slug: product.slug,
          image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
          price: product.price,
          compareAtPrice: product.compareAtPrice || null,
          size,
          colour: {
            name: colourName,
            hex: colourHex
          },
          quantity: Math.min(Math.max(1, quantity), availableStock),
          stock: availableStock
        };
        updated = true;
        return [...prevItems, newItem];
      }
    });

    showToast(`Added "${product.name}" (${size}, ${colourName}) to bag.`);
    return { success: true };
  };

  /**
   * Update quantity of a line item
   */
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromBag(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const clamped = Math.min(newQuantity, item.stock || 10);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  /**
   * Remove a line item from bag
   */
  const removeFromBag = (itemId) => {
    setItems((prevItems) => {
      const target = prevItems.find((i) => i.id === itemId);
      if (target) {
        showToast(`Removed "${target.name}" from your bag.`, 'info');
      }
      return prevItems.filter((i) => i.id !== itemId);
    });
  };

  /**
   * Clear the entire bag
   */
  const clearBag = () => {
    setItems([]);
  };

  // Derived financial calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalMRP = items.reduce((sum, item) => {
    const base = item.compareAtPrice && item.compareAtPrice > item.price ? item.compareAtPrice : item.price;
    return sum + base * item.quantity;
  }, 0);

  const totalSavings = Math.max(0, totalMRP - subtotal);

  return (
    <BagContext.Provider
      value={{
        items,
        addToBag,
        updateQuantity,
        removeFromBag,
        clearBag,
        totalItems,
        subtotal,
        totalMRP,
        totalSavings,
        notification,
        dismissNotification: () => setNotification(null)
      }}
    >
      {children}

      {/* Floating Global Toast Notification */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 'var(--z-toast)',
            backgroundColor: notification.type === 'info' ? 'var(--color-mocha)' : 'var(--color-espresso)',
            color: 'var(--color-cream)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-caramel)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.9rem',
            animation: 'fadeInUp 0.25s ease-out'
          }}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            style={{ color: 'var(--color-caramel)', fontWeight: '700', padding: '0 4px' }}
          >
            ✕
          </button>
        </div>
      )}
    </BagContext.Provider>
  );
};

export const useBag = () => {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
};

export default BagContext;
