/**
 * Auth Layout Component
 * Minimal layout for authentication pages (login, register, forgot password)
 */

import { Outlet, Navigate } from 'react-router-dom';
import { Pill } from 'lucide-react';
import { useAuth } from '@/hooks';
import { ROUTES } from '@/config';

/**
 * Authentication layout
 */
const AuthLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-8">
        <div className="max-w-md text-center text-primary-foreground">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur">
              <Pill className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">MedLan Pharmacy</h1>
          <p className="text-lg opacity-90">
            Complete pharmacy management solution for modern healthcare businesses.
            Manage inventory, sales, prescriptions, and more.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-primary-foreground/10 backdrop-blur">
              <div className="text-2xl font-bold">24/7</div>
              <div className="opacity-75">Support</div>
            </div>
            <div className="p-4 rounded-lg bg-primary-foreground/10 backdrop-blur">
              <div className="text-2xl font-bold">100%</div>
              <div className="opacity-75">Secure</div>
            </div>
            <div className="p-4 rounded-lg bg-primary-foreground/10 backdrop-blur">
              <div className="text-2xl font-bold">Fast</div>
              <div className="opacity-75">& Reliable</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Pill className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">MedLan</span>
            </div>
          </div>

          {/* Auth Content */}
          {children || <Outlet />}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MedLan Pharmacy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
