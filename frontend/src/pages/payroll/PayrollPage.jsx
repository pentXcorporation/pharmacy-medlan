/**
 * Payroll Overview Page
 * Hub for payroll management features
 */

import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Users,
  Calendar,
  CreditCard,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { ROUTES } from "@/config";

const payrollFeatures = [
  {
    title: "Salaries",
    description: "Manage employee salaries and payments",
    icon: DollarSign,
    href: ROUTES.PAYROLL.SALARIES,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    title: "Attendance",
    description: "Track employee attendance records",
    icon: Calendar,
    href: ROUTES.PAYROLL.ATTENDANCE,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Advances",
    description: "Manage salary advances and loans",
    icon: CreditCard,
    href: ROUTES.PAYROLL.ADVANCES,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
];

const PayrollPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Payroll Management"
        description="Manage employee salaries, attendance, and advances"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {payrollFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(feature.href)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mt-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Employees</p>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-1">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">This Month Salary</p>
            <p className="text-2xl font-bold">Rs. 0.00</p>
            <p className="text-xs text-muted-foreground mt-1">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending Advances</p>
            <p className="text-2xl font-bold">Rs. 0.00</p>
            <p className="text-xs text-muted-foreground mt-1">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Present Today</p>
            <p className="text-2xl font-bold">0 / 0</p>
            <p className="text-xs text-muted-foreground mt-1">Loading...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayrollPage;
