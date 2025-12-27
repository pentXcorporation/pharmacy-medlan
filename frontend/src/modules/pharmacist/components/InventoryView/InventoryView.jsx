// Inventory View Component for Pharmacist
import { useState, useMemo } from 'react';
import { useInventory, useLowStockItems, useExpiringItems, useInventoryStats } from '../../hooks';
import { INVENTORY_ALERTS, INVENTORY_ALERT_LABELS } from '../../constants';
import styles from './InventoryView.module.css';

const InventoryView = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data: inventoryData, isLoading } = useInventory({
    page: currentPage,
    limit: pageSize,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });

  const { data: lowStockData } = useLowStockItems(10);
  const { data: expiringData } = useExpiringItems(30);
  const { data: statsData } = useInventoryStats();

  const inventory = inventoryData?.data || [];
  const lowStockItems = lowStockData?.data || [];
  const expiringItems = expiringData?.data || [];
  const stats = statsData?.data || {};
  const totalPages = Math.ceil((inventoryData?.total || 0) / pageSize);

  const displayItems = useMemo(() => {
    let items = [];
    
    switch (activeTab) {
      case 'low-stock':
        items = lowStockItems;
        break;
      case 'expiring':
        items = expiringItems;
        break;
      default:
        items = inventory;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.code?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      );
    }

    return items;
  }, [activeTab, inventory, lowStockItems, expiringItems, searchQuery]);

  const getStockStatus = (item) => {
    if (item.stock <= 0) return { label: 'Out of Stock', class: styles.outOfStock };
    if (item.stock <= item.reorderLevel) return { label: 'Low Stock', class: styles.lowStock };
    return { label: 'In Stock', class: styles.inStock };
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { label: 'Expired', class: styles.expired };
    if (daysUntilExpiry <= 30) return { label: `${daysUntilExpiry} days`, class: styles.expiringSoon };
    if (daysUntilExpiry <= 90) return { label: `${daysUntilExpiry} days`, class: styles.expiringWarning };
    return { label: expiry.toLocaleDateString(), class: '' };
  };

  return (
    <div className={styles.inventoryView}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.totalProducts || 0}</span>
            <span className={styles.statLabel}>Total Products</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{lowStockItems.length}</span>
            <span className={styles.statLabel}>Low Stock</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.danger}`}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
              <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{expiringItems.length}</span>
            <span className={styles.statLabel}>Expiring Soon</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>Rs. {(stats.totalValue || 0).toLocaleString()}</span>
            <span className={styles.statLabel}>Stock Value</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Items
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'low-stock' ? styles.active : ''}`}
            onClick={() => setActiveTab('low-stock')}
          >
            Low Stock ({lowStockItems.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'expiring' ? styles.active : ''}`}
            onClick={() => setActiveTab('expiring')}
          >
            Expiring ({expiringItems.length})
          </button>
        </div>

        <div className={styles.searchBox}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, code, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Loading inventory...</span>
          </div>
        ) : displayItems.length === 0 ? (
          <div className={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>No items found</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Unit</th>
                <th>Expiry</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item) => {
                const stockStatus = getStockStatus(item);
                const expiryStatus = item.expiryDate ? getExpiryStatus(item.expiryDate) : null;

                return (
                  <tr key={item.id}>
                    <td className={styles.code}>{item.code}</td>
                    <td>
                      <div className={styles.productCell}>
                        <span className={styles.productName}>{item.name}</span>
                        {item.genericName && (
                          <span className={styles.genericName}>{item.genericName}</span>
                        )}
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td className={styles.stockCell}>
                      <span className={item.stock <= item.reorderLevel ? styles.lowStockText : ''}>
                        {item.stock}
                      </span>
                      {item.stock <= item.reorderLevel && (
                        <span className={styles.reorderBadge}>
                          Reorder: {item.reorderLevel}
                        </span>
                      )}
                    </td>
                    <td>{item.unit}</td>
                    <td>
                      {expiryStatus && (
                        <span className={`${styles.expiryBadge} ${expiryStatus.class}`}>
                          {expiryStatus.label}
                        </span>
                      )}
                    </td>
                    <td className={styles.price}>
                      Rs. {item.sellingPrice?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${stockStatus.class}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {activeTab === 'all' && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
