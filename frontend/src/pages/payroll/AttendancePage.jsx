/**
 * Attendance Page
 * Track employee attendance records
 */

import { useState, useMemo, useCallback } from "react";
import { Download, Calendar } from "lucide-react";
import { PageHeader, DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";
import AttendanceFormDialog from "./AttendanceFormDialog";
import { toast } from "sonner";

const AttendancePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const mockData = {
    content: [],
    total: 0,
    pageCount: 0,
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "employeeName",
        header: "Employee",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue("employeeName")}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.employeeCode}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => formatDate(row.getValue("date")),
      },
      {
        accessorKey: "checkIn",
        header: "Check In",
        meta: { className: "hidden md:table-cell" },
        cell: ({ row }) => row.getValue("checkIn") || "-",
      },
      {
        accessorKey: "checkOut",
        header: "Check Out",
        meta: { className: "hidden md:table-cell" },
        cell: ({ row }) => row.getValue("checkOut") || "-",
      },
      {
        accessorKey: "workHours",
        header: "Work Hours",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => {
          const hours = row.getValue("workHours");
          return hours ? `${hours}h` : "-";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          const variant =
            status === "PRESENT"
              ? "success"
              : status === "ABSENT"
              ? "destructive"
              : status === "LATE"
              ? "warning"
              : "default";
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
    ],
    []
  );

  const stats = {
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
  };

  const handleMarkAttendance = useCallback(async (data) => {
    try {
      console.log("Marking attendance:", data);

      toast.success("Attendance Marked", {
        description: "Employee attendance has been recorded successfully.",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to mark attendance. Please try again.",
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Attendance"
        description="Track daily attendance records"
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsFormOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      <AttendanceFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleMarkAttendance}
      />

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.presentToday}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.absentToday}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.lateToday}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by employee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockData.content}
        isLoading={false}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: mockData.total,
          pageCount: mockData.pageCount,
        }}
        onPaginationChange={setPagination}
        emptyMessage="No attendance records found."
      />
    </div>
  );
};

export default AttendancePage;
