/**
 * Reports Page
 * Main reports hub with links to different report types
 */

import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Truck,
  Shield,
} from "lucide-react";

import { ROUTES } from "@/config/routes.config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/common";

const reportTypes = [
  {
    title: "Sales Report",
    description: "Sales performance, trends, customers, and returns analysis",
    icon: TrendingUp,
    route: ROUTES.REPORTS.SALES,
    color: "text-blue-600",
  },
  {
    title: "Inventory Report",
    description: "Stock levels, movements, turnover, and valuation",
    icon: Package,
    route: ROUTES.REPORTS.INVENTORY,
    color: "text-green-600",
  },
  {
    title: "Financial Report",
    description: "Revenue, expenses, and cash flow analysis",
    icon: DollarSign,
    route: ROUTES.REPORTS.FINANCIAL,
    color: "text-purple-600",
  },
  {
    title: "Product Report",
    description: "Product performance, margins, and category analysis",
    icon: ShoppingCart,
    route: ROUTES.REPORTS.PRODUCTS,
    color: "text-orange-600",
  },
  {
    title: "Employee Report",
    description: "Attendance, payroll, performance, and HR overview",
    icon: Users,
    route: ROUTES.REPORTS.EMPLOYEES,
    color: "text-cyan-600",
  },
  {
    title: "Supplier Report",
    description: "Supplier purchases, payments, and delivery performance",
    icon: Truck,
    route: ROUTES.REPORTS.SUPPLIERS,
    color: "text-red-600",
  },
  {
    title: "Audit Log",
    description: "System activity and audit trail",
    icon: Shield,
    route: ROUTES.REPORTS.AUDIT,
    color: "text-teal-600",
  },
];

const ReportsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and view business reports"
        icon={BarChart3}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.title}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(report.route)}
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className={`p-2 rounded-lg bg-muted ${report.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsPage;
