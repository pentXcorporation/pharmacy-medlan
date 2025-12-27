import { LoginForm } from '../../components/LoginForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/Card';
import styles from './LoginPage.module.css';

/**
 * LoginPage Component
 * Main login page with branding and login form
 */
export function LoginPage() {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💊</span>
            <CardTitle className={styles.title}>MedLan Pharmacy</CardTitle>
          </div>
          <CardDescription className={styles.description}>
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} MedLan Pharmacy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
