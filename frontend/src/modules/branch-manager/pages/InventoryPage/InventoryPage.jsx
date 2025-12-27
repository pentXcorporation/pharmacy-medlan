import { InventoryControl } from '../../components';
import styles from './InventoryPage.module.css';

const InventoryPage = () => {
  return (
    <div className={styles.inventoryPage}>
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Branch Inventory</h1>
          <p className={styles.subtitle}>Monitor stock levels, transfers, and expiring items</p>
        </div>
      </div>
      <InventoryControl />
    </div>
  );
};

export default InventoryPage;
