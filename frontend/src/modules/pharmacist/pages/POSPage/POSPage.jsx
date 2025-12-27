// POS Page
import POSTerminal from '../../components/POSTerminal';
import styles from './POSPage.module.css';

const POSPage = () => {
  return (
    <div className={styles.posPage}>
      <POSTerminal />
    </div>
  );
};

export default POSPage;
