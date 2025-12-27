// Customer Select Component
import { useState, useCallback, useRef, useEffect } from 'react';
import { useCustomerSearch } from '../../hooks';
import styles from './CustomerSelect.module.css';

const CustomerSelect = ({ selectedCustomer, onCustomerSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
  const wrapperRef = useRef(null);

  const { 
    searchQuery, 
    setSearchQuery, 
    customers, 
    isLoading,
    createQuickCustomer,
    isCreating: isCreatingCustomer 
  } = useCustomerSearch();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((customer) => {
    onCustomerSelect(customer);
    setIsOpen(false);
    setSearchQuery('');
  }, [onCustomerSelect, setSearchQuery]);

  const handleClear = useCallback(() => {
    onCustomerSelect(null);
    setSearchQuery('');
  }, [onCustomerSelect, setSearchQuery]);

  const handleCreateCustomer = useCallback(async (e) => {
    e.preventDefault();
    
    if (!newCustomer.name || !newCustomer.phone) return;

    try {
      const customer = await createQuickCustomer(newCustomer);
      handleSelect(customer);
      setNewCustomer({ name: '', phone: '' });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  }, [newCustomer, createQuickCustomer, handleSelect]);

  return (
    <div className={styles.customerSelect} ref={wrapperRef}>
      {selectedCustomer ? (
        <div className={styles.selectedCustomer}>
          <div className={styles.customerAvatar}>
            {selectedCustomer.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.customerInfo}>
            <span className={styles.customerName}>{selectedCustomer.name}</span>
            <span className={styles.customerPhone}>{selectedCustomer.phone}</span>
          </div>
          <button className={styles.clearBtn} onClick={handleClear}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : (
        <div className={styles.selectTrigger} onClick={() => setIsOpen(!isOpen)}>
          <svg className={styles.userIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" strokeWidth="2" />
            <circle cx="12" cy="7" r="4" strokeWidth="2" />
          </svg>
          <span className={styles.placeholder}>Select Customer (Optional)</span>
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {isOpen && (
        <div className={styles.dropdown}>
          {!isCreating ? (
            <>
              <div className={styles.searchBox}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or phone..."
                  autoFocus
                />
              </div>

              <div className={styles.customerList}>
                {isLoading ? (
                  <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <span>Searching...</span>
                  </div>
                ) : customers.length > 0 ? (
                  customers.map((customer) => (
                    <div
                      key={customer.id}
                      className={styles.customerItem}
                      onClick={() => handleSelect(customer)}
                    >
                      <div className={styles.customerAvatar}>
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.customerDetails}>
                        <span className={styles.itemName}>{customer.name}</span>
                        <span className={styles.itemPhone}>{customer.phone}</span>
                      </div>
                    </div>
                  ))
                ) : searchQuery.length >= 2 ? (
                  <div className={styles.emptyState}>
                    <p>No customers found</p>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <p>Type to search customers</p>
                  </div>
                )}
              </div>

              <button 
                className={styles.addNewBtn}
                onClick={() => setIsCreating(true)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Add New Customer
              </button>
            </>
          ) : (
            <form className={styles.createForm} onSubmit={handleCreateCustomer}>
              <h4 className={styles.formTitle}>New Customer</h4>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  className={styles.formInput}
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer Name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="tel"
                  className={styles.formInput}
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelFormBtn}
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitFormBtn}
                  disabled={isCreatingCustomer}
                >
                  {isCreatingCustomer ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerSelect;
