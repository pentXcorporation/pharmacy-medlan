// Prescriptions Page
import { useState } from 'react';
import PrescriptionList from '../../components/PrescriptionList';
import styles from './PrescriptionsPage.module.css';

const PrescriptionsPage = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const handleSelectPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    // Could open a detail modal or navigate to detail view
    console.log('Selected prescription:', prescription);
  };

  return (
    <div className={styles.prescriptionsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Prescriptions</h1>
        <p className={styles.pageDescription}>
          Manage and process prescriptions
        </p>
      </div>

      <div className={styles.content}>
        <PrescriptionList onSelectPrescription={handleSelectPrescription} />
      </div>
    </div>
  );
};

export default PrescriptionsPage;
