import { Outlet } from 'react-router-dom';
import { Pill, Package, CreditCard, BarChart3, Users, Building2 } from 'lucide-react';

/**
 * AuthLayout Component
 * Layout for authentication pages (login, register, etc.)
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12 max-w-lg">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">MedLan Pharmacy</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Professional Pharmacy Management System
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <Outlet />
        </div>
      </div>

      {/* Right side - Background */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary/80 text-white p-12 items-center justify-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4">Welcome to MedLan</h2>
          <p className="text-primary-foreground/80 mb-8">
            Streamline your pharmacy operations with our comprehensive management solution.
          </p>
          <ul className="space-y-4">
            {[
              { icon: Package, text: 'Inventory Management' },
              { icon: CreditCard, text: 'Point of Sale' },
              { icon: BarChart3, text: 'Reports & Analytics' },
              { icon: Users, text: 'Customer Management' },
              { icon: Building2, text: 'Multi-Branch Support' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
