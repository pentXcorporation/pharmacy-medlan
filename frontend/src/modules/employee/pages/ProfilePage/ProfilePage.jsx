import { ProfileView } from '../../components';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Profile</h1>
        <p className={styles.subtitle}>View and update your personal information</p>
      </div>
      
      <div className={styles.content}>
        <ProfileView />
      </div>
    </div>
  );
};

export default ProfilePage;
