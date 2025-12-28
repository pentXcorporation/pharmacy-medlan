/**
 * LoginPage Component
 * Authentication page with login form
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/features/auth';

/**
 * LoginPage component
 */
const LoginPage = () => {
  return (
    <div className="w-full">
      <Card className="border-0 shadow-none lg:border lg:shadow-sm">
        <CardHeader className="space-y-1 text-center lg:text-left">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>

      {/* Demo Credentials (remove in production) */}
      {import.meta.env.DEV && (
        <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm">
          <p className="font-medium text-muted-foreground mb-2">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Super Admin:</span>
              <br />
              superadmin / admin123
            </div>
            <div>
              <span className="font-medium">Pharmacist:</span>
              <br />
              pharmacist / pharm123
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
