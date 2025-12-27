// Inventory Page for Pharmacist
import InventoryView from '../../components/InventoryView';
import styles from './InventoryPage.module.css';

const InventoryPage = () => {
  return (
    <div className={styles.inventoryPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Inventory</h1>
        <p className={styles.pageDescription}>
          View stock levels, low stock alerts, and expiring items
        </p>
      </div>

      <div className={styles.content}>
        <InventoryView />
      </div>
    </div>
  );
};

export default InventoryPage;
