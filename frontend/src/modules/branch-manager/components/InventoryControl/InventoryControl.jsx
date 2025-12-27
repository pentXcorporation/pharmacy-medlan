import { useState } from 'react';
import { useBranchInventory, useLowStockItems, useExpiringItems, useTransferRequests, useRequestTransfer, useAvailableBranches } from '../../hooks';
import { TRANSFER_STATUS } from '../../constants';
import styles from './InventoryControl.module.css';

const InventoryControl = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferForm, setTransferForm] = useState({
    product_id: '',
    quantity: '',
    source_branch_id: '',
    notes: '',
  });

  const { data: inventoryData, isLoading } = useBranchInventory({ search: searchQuery });
  const { data: lowStockData } = useLowStockItems();
  const { data: expiringData } = useExpiringItems(30);
  const { data: transfersData } = useTransferRequests();
  const { data: branchesData } = useAvailableBranches();

  const requestTransfer = useRequestTransfer();

  const inventory = inventoryData?.data || [];
  const lowStock = lowStockData?.data || [];
  const expiringItems = expiringData?.data || [];
  const transfers = transfersData?.data || [];
  const branches = branchesData?.data || [];

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    requestTransfer.mutate(transferForm, {
      onSuccess: () => {
        setShowTransferModal(false);
        setTransferForm({
          product_id: '',
          quantity: '',
          source_branch_id: '',
          notes: '',
        });
      },
    });
  };

  const getTransferStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'approved':
        return styles.statusApproved;
      case 'in_transit':
        return styles.statusInTransit;
      case 'delivered':
        return styles.statusDelivered;
      case 'rejected':
        return styles.statusRejected;
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStockClass = (current, reorder) => {
    if (current <= 0) return styles.outOfStock;
    if (current <= reorder) return styles.lowStock;
    return '';
  };

  return (
    <div className={styles.inventoryControl}>
      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{inventory.length}</span>
          <span className={styles.summaryLabel}>Total Products</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.warning}`}>
          <span className={styles.summaryValue}>{lowStock.length}</span>
          <span className={styles.summaryLabel}>Low Stock</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.danger}`}>
          <span className={styles.summaryValue}>{expiringItems.length}</span>
          <span className={styles.summaryLabel}>Expiring Soon</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>
            {transfers.filter((t) => t.status === 'pending').length}
          </span>
          <span className={styles.summaryLabel}>Pending Transfers</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          All Products
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'lowstock' ? styles.active : ''}`}
          onClick={() => setActiveTab('lowstock')}
        >
          Low Stock
          {lowStock.length > 0 && <span className={styles.badge}>{lowStock.length}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'expiring' ? styles.active : ''}`}
          onClick={() => setActiveTab('expiring')}
        >
          Expiring Soon
          {expiringItems.length > 0 && <span className={styles.badge}>{expiringItems.length}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'transfers' ? styles.active : ''}`}
          onClick={() => setActiveTab('transfers')}
        >
          Transfers
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button onClick={() => setShowTransferModal(true)} className={styles.transferBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Request Transfer
              </button>
            </div>

            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <span>Loading inventory...</span>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Reorder Level</th>
                      <th>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id}>
                        <td className={styles.productName}>{item.product_name}</td>
                        <td>{item.sku}</td>
                        <td>{item.category}</td>
                        <td className={getStockClass(item.current_stock, item.reorder_level)}>
                          {item.current_stock}
                        </td>
                        <td>{item.reorder_level}</td>
                        <td>{formatDate(item.expiry_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Low Stock Tab */}
        {activeTab === 'lowstock' && (
          <div className={styles.alertList}>
            {lowStock.length === 0 ? (
              <div className={styles.empty}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No low stock items</span>
              </div>
            ) : (
              lowStock.map((item) => (
                <div key={item.id} className={`${styles.alertCard} ${styles.lowStockCard}`}>
                  <div className={styles.alertInfo}>
                    <span className={styles.alertProduct}>{item.product_name}</span>
                    <span className={styles.alertSku}>{item.sku}</span>
                  </div>
                  <div className={styles.alertStock}>
                    <span className={styles.stockCurrent}>{item.current_stock}</span>
                    <span className={styles.stockLabel}>
                      / {item.reorder_level} reorder level
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setTransferForm((prev) => ({ ...prev, product_id: item.id }));
                      setShowTransferModal(true);
                    }}
                    className={styles.requestBtn}
                  >
                    Request Stock
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Expiring Tab */}
        {activeTab === 'expiring' && (
          <div className={styles.alertList}>
            {expiringItems.length === 0 ? (
              <div className={styles.empty}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No items expiring soon</span>
              </div>
            ) : (
              expiringItems.map((item) => (
                <div key={item.id} className={`${styles.alertCard} ${styles.expiryCard}`}>
                  <div className={styles.alertInfo}>
                    <span className={styles.alertProduct}>{item.product_name}</span>
                    <span className={styles.alertSku}>Batch: {item.batch_number}</span>
                  </div>
                  <div className={styles.expiryInfo}>
                    <span className={styles.expiryDate}>
                      Expires: {formatDate(item.expiry_date)}
                    </span>
                    <span className={styles.expiryQty}>{item.quantity} units</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Transfers Tab */}
        {activeTab === 'transfers' && (
          <div className={styles.transferList}>
            {transfers.length === 0 ? (
              <div className={styles.empty}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>No transfer requests</span>
              </div>
            ) : (
              transfers.map((transfer) => (
                <div key={transfer.id} className={styles.transferCard}>
                  <div className={styles.transferHeader}>
                    <span className={styles.transferProduct}>{transfer.product_name}</span>
                    <span
                      className={`${styles.transferStatus} ${getTransferStatusClass(transfer.status)}`}
                    >
                      {TRANSFER_STATUS[transfer.status?.toUpperCase()]?.label || transfer.status}
                    </span>
                  </div>
                  <div className={styles.transferDetails}>
                    <span>Qty: {transfer.quantity}</span>
                    <span>From: {transfer.source_branch_name}</span>
                    <span>Date: {formatDate(transfer.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTransferModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Request Stock Transfer</h3>
            <form onSubmit={handleTransferSubmit}>
              <div className={styles.formGroup}>
                <label>Product</label>
                <select
                  value={transferForm.product_id}
                  onChange={(e) =>
                    setTransferForm((prev) => ({ ...prev, product_id: e.target.value }))
                  }
                  required
                >
                  <option value="">Select product</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.product_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Source Branch</label>
                <select
                  value={transferForm.source_branch_id}
                  onChange={(e) =>
                    setTransferForm((prev) => ({ ...prev, source_branch_id: e.target.value }))
                  }
                  required
                >
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={transferForm.quantity}
                  onChange={(e) =>
                    setTransferForm((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Notes (Optional)</label>
                <textarea
                  value={transferForm.notes}
                  onChange={(e) =>
                    setTransferForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={2}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={requestTransfer.isPending}
                >
                  {requestTransfer.isPending ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryControl;
