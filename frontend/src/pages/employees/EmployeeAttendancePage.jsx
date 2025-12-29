/**
 * Employee Attendance Page
 * Track and manage employee attendance records
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common";
import { DataTable } from "@/components/common/DataTable";
import { ROUTES } from "@/config";

const EmployeeAttendancePage = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data - replace with actual API call
  const attendanceData = [
    {
      id: 1,
      date: "2024-01-15",
      employeeName: "John Doe",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
      status: "PRESENT",
      hours: 8,
    },
    {
      id: 2,
      date: "2024-01-15",
      employeeName: "Jane Smith",
      checkIn: "09:15 AM",
      checkOut: "05:30 PM",
      status: "LATE",
      hours: 8,
    },
    {
      id: 3,
      date: "2024-01-15",
      employeeName: "Bob Johnson",
      checkIn: "-",
      checkOut: "-",
      status: "ABSENT",
      hours: 0,
    },
  ];

  // Statistics
  const stats = [
    {
      title: "Total Employees",
      value: "25",
      description: "Active employees",
    },
    {
      title: "Present Today",
      value: "22",
      description: "88% attendance",
    },
    {
      title: "Late Arrivals",
      value: "3",
      description: "Today",
    },
    {
      title: "Absent",
      value: "3",
      description: "Today",
    },
  ];

  // Status badge configuration
  const statusConfig = {
    PRESENT: { label: "Present", variant: "success" },
    LATE: { label: "Late", variant: "warning" },
    ABSENT: { label: "Absent", variant: "destructive" },
    LEAVE: { label: "On Leave", variant: "secondary" },
  };

  // Table columns
  const columns = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
    },
    {
      accessorKey: "employeeName",
      header: "Employee",
    },
    {
      accessorKey: "checkIn",
      header: "Check In",
    },
    {
      accessorKey: "checkOut",
      header: "Check Out",
    },
    {
      accessorKey: "hours",
      header: "Hours",
      cell: ({ row }) => `${row.getValue("hours")}h`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const config = statusConfig[status] || statusConfig.PRESENT;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Employee Attendance"
        description="Track and manage employee attendance records"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.EMPLOYEES.LIST)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance Records</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Today
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={attendanceData}
            searchable
            searchPlaceholder="Search employees..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendancePage;
