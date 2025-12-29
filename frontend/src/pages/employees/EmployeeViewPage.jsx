/**
 * Employee View Page
 * Display detailed employee information
 */

import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/common";
import { useUser } from "@/features/users";
import { ROUTES } from "@/config";
import { formatDate } from "@/utils/formatters";
import { ROLE_LABELS } from "@/constants/roles";

const EmployeeViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: employee, isLoading } = useUser(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-muted-foreground">Employee not found</p>
      </div>
    );
  }

  const statusConfig = {
    ACTIVE: { label: "Active", variant: "success" },
    INACTIVE: { label: "Inactive", variant: "secondary" },
    SUSPENDED: { label: "Suspended", variant: "destructive" },
  };

  const status = employee.status || "ACTIVE";
  const statusInfo = statusConfig[status] || statusConfig.ACTIVE;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={`${employee.firstName} ${employee.lastName}`}
        description="Employee details and information"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.EMPLOYEES.LIST)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => navigate(ROUTES.EMPLOYEES.EDIT(id))}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {employee.firstName} {employee.lastName}
                </CardTitle>
                <CardDescription>
                  {ROLE_LABELS[employee.role] || employee.role}
                </CardDescription>
              </div>
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{employee.address}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Work Information */}
            <div>
              <h3 className="font-semibold mb-3">Work Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground w-32">Role:</span>
                  <span className="font-medium">
                    {ROLE_LABELS[employee.role] || employee.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground w-32">Branch:</span>
                  <span className="font-medium">
                    {employee.branchName || "All Branches"}
                  </span>
                </div>
                {employee.createdAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-32">Joined:</span>
                    <span className="font-medium">
                      {formatDate(employee.createdAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            {employee.emergencyContact && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Emergency Contact</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.emergencyContact}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={statusInfo.variant} className="mt-1">
                    {statusInfo.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="text-sm font-medium">#{employee.id}</p>
                </div>
                {employee.salary && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Salary
                    </p>
                    <p className="text-sm font-medium">
                      Rs. {parseFloat(employee.salary).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(ROUTES.PAYROLL.SALARIES)}
              >
                View Salary Records
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(ROUTES.PAYROLL.ATTENDANCE)}
              >
                View Attendance
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewPage;
