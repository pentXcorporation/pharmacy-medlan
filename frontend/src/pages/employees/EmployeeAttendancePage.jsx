/**
 * Employee Attendance Page
 * Track and manage employee attendance records
 */

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { ROUTES } from "@/config";

const EmployeeAttendancePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Employee Attendance"
        description="Track and manage employee attendance records"
      >
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.EMPLOYEES.LIST)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-6xl">🚧</div>
            <h2 className="text-2xl font-bold">
              Attendance Feature Coming Soon
            </h2>
            <p className="text-muted-foreground max-w-md">
              The attendance tracking feature is currently under development.
              This feature will allow you to track employee attendance,
              check-in/check-out times, and generate attendance reports.
            </p>
            <Button
              onClick={() => navigate(ROUTES.EMPLOYEES.LIST)}
              className="mt-4"
            >
              Return to Employees
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendancePage;
