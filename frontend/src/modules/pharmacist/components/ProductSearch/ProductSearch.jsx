// Product Search Component
import { forwardRef, useCallback, useState } from 'react';
import styles from './ProductSearch.module.css';

const ProductSearch = forwardRef(({
  searchQuery,
  onSearchChange,
  products,
  isLoading,
  onProductSelect,
  onBarcodeScanned,
}, ref) => {
  const [inputMode, setInputMode] = useState('search'); // 'search' or 'barcode'

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    
    // Auto-detect barcode (usually numeric and specific length)
    if (/^\d{8,13}$/.test(value)) {
      onBarcodeScanned?.(value);
      e.target.value = '';
      return;
    }
    
    onSearchChange(value);
  }, [onSearchChange, onBarcodeScanned]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && products.length > 0) {
      onProductSelect(products[0]);
      onSearchChange('');
    }
  }, [products, onProductSelect, onSearchChange]);

  return (
    <div className={styles.productSearch}>
      {/* Search Input */}
      <div className={styles.searchContainer}>
        <div className={styles.inputWrapper}>
          <svg 
            className={styles.searchIcon} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={ref}
            type="text"
            className={styles.searchInput}
            placeholder="Search products or scan barcode..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <button 
              className={styles.clearBtn}
              onClick={() => onSearchChange('')}
            >
              ×
            </button>
          )}
        </div>
        
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${inputMode === 'search' ? styles.active : ''}`}
            onClick={() => setInputMode('search')}
          >
            Search
          </button>
          <button
            className={`${styles.modeBtn} ${inputMode === 'barcode' ? styles.active : ''}`}
            onClick={() => setInputMode('barcode')}
          >
            Barcode
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className={styles.productList}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Searching...</span>
          </div>
        ) : products.length === 0 && searchQuery.length >= 2 ? (
          <div className={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p>No products found for "{searchQuery}"</p>
          </div>
        ) : searchQuery.length < 2 && products.length === 0 ? (
          <div className={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
              <path d="M3 9h18M9 21V9" strokeWidth="2" />
            </svg>
            <p>Type at least 2 characters to search</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className={`${styles.productItem} ${product.stock <= 0 ? styles.outOfStock : ''}`}
              onClick={() => product.stock > 0 && onProductSelect(product)}
            >
              <div className={styles.productInfo}>
                <div className={styles.productName}>{product.name}</div>
                <div className={styles.productMeta}>
                  <span className={styles.productCode}>{product.code}</span>
                  <span className={styles.productCategory}>{product.category}</span>
                </div>
              </div>
              <div className={styles.productDetails}>
                <div className={styles.productPrice}>
                  Rs. {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className={`${styles.productStock} ${product.stock <= 10 ? styles.lowStock : ''}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

ProductSearch.displayName = 'ProductSearch';

export default ProductSearch;
