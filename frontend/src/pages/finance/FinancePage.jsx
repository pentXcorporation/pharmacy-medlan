/**
 * Finance Overview Page
 * Hub for finance-related features
 */

import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  FileText,
  CreditCard,
  Wallet,
  Building2,
  BookOpen,
  TrendingUp,
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

const financeFeatures = [
  {
    title: "Transactions",
    description: "View and manage financial transactions",
    icon: DollarSign,
    href: ROUTES.FINANCE.TRANSACTIONS,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    title: "Invoices",
    description: "Manage customer and supplier invoices",
    icon: FileText,
    href: ROUTES.FINANCE.INVOICES,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Cheques",
    description: "Track cheque payments and collections",
    icon: CreditCard,
    href: ROUTES.FINANCE.CHEQUES,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "Cash Register",
    description: "Manage cash register operations",
    icon: Wallet,
    href: ROUTES.FINANCE.CASH_REGISTER,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    title: "Banks",
    description: "Bank accounts and reconciliation",
    icon: Building2,
    href: ROUTES.FINANCE.BANKS,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    title: "Cash Book",
    description: "Daily cash book entries",
    icon: BookOpen,
    href: ROUTES.FINANCE.CASH_BOOK,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    title: "Financial Summary",
    description: "Overall financial health summary",
    icon: TrendingUp,
    href: ROUTES.FINANCE.SUMMARY,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
];

const FinancePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Finance"
        description="Manage all financial aspects of your pharmacy"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {financeFeatures.map((feature) => {
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
            <p className="text-sm text-muted-foreground">Today's Revenue</p>
            <p className="text-2xl font-bold">Rs. 0.00</p>
            <p className="text-xs text-muted-foreground mt-1">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending Receivables</p>
            <p className="text-2xl font-bold">Rs. 0.00</p>
            <p className="text-xs text-muted-foreground mt-1">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending Payables</p>
            <p className="text-2xl font-bold">Rs. 0.00</p>
            <p className="text-xs text-muted-foreground mt-1">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Cash in Hand</p>
            <p className="text-2xl font-bold">Rs. 0.00</p>
            <p className="text-xs text-muted-foreground mt-1">Loading...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancePage;
