/**
 * Employee Report Page
 * Comprehensive employee analytics: attendance, payroll, performance, HR
 */

import { useState } from "react";
import { format, subDays } from "date-fns";
import {
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  Award,
  Briefcase,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageHeader, LoadingSpinner } from "@/components/common";
import { ReportFilters, ReportSummaryCard } from "@/features/reports";
import {
  useHeadcountSummary,
  useAttendanceSummary,
  usePayrollSummary,
  usePayrollBreakdown,
  useTopPerformers,
} from "@/features/reports";
import { useActiveBranches } from "@/features/branches";
import { formatCurrency } from "@/utils/formatters";
import { useAuthStore } from "@/store";

const EmployeeReportPage = () => {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    branchId: user?.branchId || null,
  });

  const { data: branches } = useActiveBranches();

  // Derive effective branchId — auto-select first branch if user has none
  const effectiveBranchId = filters.branchId || branches?.[0]?.id?.toString() || null;

  const queryParams = {
    branchId: effectiveBranchId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  const { data: headcount, isLoading: loadingHeadcount } = useHeadcountSummary(
    { branchId: effectiveBranchId },
    { enabled: Boolean(effectiveBranchId) }
  );
  const { data: attendance, isLoading: loadingAttendance } = useAttendanceSummary(queryParams);
  const { data: payroll, isLoading: loadingPayroll } = usePayrollSummary(queryParams);
  const { data: payrollBreakdown, isLoading: loadingBreakdown } = usePayrollBreakdown(queryParams);
  const { data: performers, isLoading: loadingPerformers } = useTopPerformers(queryParams);

  const isLoading = loadingHeadcount || loadingAttendance || loadingPayroll || loadingPerformers;

  const handleDateChange = ({ startDate, endDate }) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const handleBranchChange = (branchId) => {
    setFilters((prev) => ({ ...prev, branchId: branchId === "all" ? null : branchId }));
  };

  const hc = headcount || {};
  const pl = payroll || {};
  const attendanceList = Array.isArray(attendance) ? attendance : [];
  const breakdownList = Array.isArray(payrollBreakdown) ? payrollBreakdown : [];
  const performerList = Array.isArray(performers) ? performers : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Report"
        description="Comprehensive employee analytics — attendance, payroll, and performance"
        icon={Users}
      />

      <ReportFilters
        startDate={filters.startDate}
        endDate={filters.endDate}
        onDateChange={handleDateChange}
        branchId={effectiveBranchId}
        onBranchChange={handleBranchChange}
        branches={branches || []}
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ReportSummaryCard
              title="Total Employees"
              value={hc.totalEmployees ?? hc.total ?? 0}
              description={`${hc.activeCount ?? 0} active`}
              icon={Users}
            />
            <ReportSummaryCard
              title="Avg Attendance Rate"
              value={`${
                attendanceList.length > 0
                  ? (
                      attendanceList.reduce((s, a) => s + (a.attendanceRate || a.rate || 0), 0) /
                      attendanceList.length
                    ).toFixed(1)
                  : 0
              }%`}
              description="For selected period"
              icon={UserCheck}
            />
            <ReportSummaryCard
              title="Total Payroll"
              value={formatCurrency(pl.totalGross || pl.totalNetSalary || 0)}
              description={`Net: ${formatCurrency(pl.totalNet || pl.totalNetSalary || 0)}`}
              icon={DollarSign}
            />
            <ReportSummaryCard
              title="Top Performers"
              value={performerList.length}
              description="By sales amount"
              icon={Award}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="attendance" className="space-y-4">
            <TabsList>
              <TabsTrigger value="attendance">
                <Clock className="mr-1 h-4 w-4" /> Attendance
              </TabsTrigger>
              <TabsTrigger value="payroll">
                <DollarSign className="mr-1 h-4 w-4" /> Payroll
              </TabsTrigger>
              <TabsTrigger value="performance">
                <TrendingUp className="mr-1 h-4 w-4" /> Performance
              </TabsTrigger>
              <TabsTrigger value="hr">
                <Briefcase className="mr-1 h-4 w-4" /> HR Overview
              </TabsTrigger>
            </TabsList>

            {/* Attendance Tab */}
            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {attendanceList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead className="text-right">Days Present</TableHead>
                          <TableHead className="text-right">Days Absent</TableHead>
                          <TableHead className="text-right">Late Arrivals</TableHead>
                          <TableHead className="text-right">Attendance Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceList.map((emp, idx) => (
                          <TableRow key={emp.employeeId || idx}>
                            <TableCell className="font-medium">
                              {emp.employeeName || emp.name || `Employee #${emp.employeeId}`}
                            </TableCell>
                            <TableCell className="text-right">{emp.daysPresent ?? emp.presentDays ?? 0}</TableCell>
                            <TableCell className="text-right">{emp.daysAbsent ?? emp.absentDays ?? 0}</TableCell>
                            <TableCell className="text-right">{emp.lateArrivals ?? emp.lateDays ?? 0}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={
                                (emp.attendanceRate || emp.rate || 0) >= 90
                                  ? "default"
                                  : (emp.attendanceRate || emp.rate || 0) >= 75
                                  ? "secondary"
                                  : "destructive"
                              }>
                                {(emp.attendanceRate || emp.rate || 0).toFixed(1)}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No attendance data for the selected period
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payroll Tab */}
            <TabsContent value="payroll">
              <div className="space-y-4">
                {/* Payroll Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <ReportSummaryCard
                    title="Gross Salary"
                    value={formatCurrency(pl.totalGross || pl.grossSalary || 0)}
                    icon={DollarSign}
                  />
                  <ReportSummaryCard
                    title="Total Deductions"
                    value={formatCurrency(pl.totalDeductions || pl.deductions || 0)}
                    icon={AlertTriangle}
                  />
                  <ReportSummaryCard
                    title="Net Salary"
                    value={formatCurrency(pl.totalNet || pl.totalNetSalary || pl.netSalary || 0)}
                    icon={DollarSign}
                  />
                </div>

                {/* Payroll Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payroll Breakdown by Employee</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {breakdownList.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead className="text-right">Basic Salary</TableHead>
                            <TableHead className="text-right">Allowances</TableHead>
                            <TableHead className="text-right">Deductions</TableHead>
                            <TableHead className="text-right">Net Pay</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {breakdownList.map((emp, idx) => (
                            <TableRow key={emp.employeeId || idx}>
                              <TableCell className="font-medium">
                                {emp.employeeName || emp.name || `Employee #${emp.employeeId}`}
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(emp.basicSalary || emp.basic || 0)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(emp.allowances || 0)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(emp.deductions || 0)}</TableCell>
                              <TableCell className="text-right font-medium">{formatCurrency(emp.netPay || emp.netSalary || 0)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No payroll data for the selected period
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Employees (by Sales)</CardTitle>
                </CardHeader>
                <CardContent>
                  {performerList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">#</TableHead>
                          <TableHead>Employee</TableHead>
                          <TableHead className="text-right">Total Sales</TableHead>
                          <TableHead className="text-right">Transactions</TableHead>
                          <TableHead className="text-right">Avg per Transaction</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {performerList.map((emp, idx) => {
                          const sales = emp.totalSales || emp.salesAmount || 0;
                          const txns = emp.transactionCount || emp.transactions || 0;
                          return (
                            <TableRow key={emp.employeeId || idx}>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell className="font-medium">
                                {emp.employeeName || emp.name || `Employee #${emp.employeeId}`}
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(sales)}</TableCell>
                              <TableCell className="text-right">{txns}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(txns > 0 ? sales / txns : 0)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No performance data for the selected period
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* HR Overview Tab */}
            <TabsContent value="hr">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Headcount Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(hc).map(([key, value]) => {
                        if (typeof value !== "number" && typeof value !== "string") return null;
                        const label = key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase());
                        return (
                          <div key={key} className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm text-muted-foreground">{label}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        );
                      })}
                      {Object.keys(hc).length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No headcount data available
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Total Employees</span>
                        <span className="font-medium">{hc.totalEmployees ?? hc.total ?? 0}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Active</span>
                        <Badge variant="default">{hc.activeCount ?? hc.active ?? 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">On Leave</span>
                        <Badge variant="secondary">{hc.onLeaveCount ?? hc.onLeave ?? 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Inactive</span>
                        <Badge variant="destructive">{hc.inactiveCount ?? hc.inactive ?? 0}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default EmployeeReportPage;
