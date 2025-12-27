import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../../components/ForgotPasswordForm';
import { Card, CardContent } from '@/shared/components/ui/Card';

/**
 * ForgotPasswordPage Component
 */
export function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <ForgotPasswordForm 
            onBack={() => navigate('/login')}
            onSuccess={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
