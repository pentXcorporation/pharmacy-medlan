/**
 * Report Filter Component
 * Common date range and filter controls for reports
 */

import { useState } from "react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
} from "date-fns";
import {
  CalendarDays,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

// Preset date ranges
const presets = [
  { label: "Today", getValue: () => ({ start: new Date(), end: new Date() }) },
  {
    label: "Yesterday",
    getValue: () => ({
      start: subDays(new Date(), 1),
      end: subDays(new Date(), 1),
    }),
  },
  {
    label: "Last 7 days",
    getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }),
  },
  {
    label: "This Month",
    getValue: () => ({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    }),
  },
  {
    label: "This Year",
    getValue: () => ({ start: startOfYear(new Date()), end: new Date() }),
  },
];

/**
 * ReportFilters component
 */
const ReportFilters = ({
  startDate,
  endDate,
  onDateChange,
  branchId,
  onBranchChange,
  branches = [],
  showBranchFilter = true,
  onExport,
  isLoading = false,
  children,
}) => {
  const [preset, setPreset] = useState("");

  const handlePresetChange = (value) => {
    setPreset(value);
    const presetConfig = presets.find((p) => p.label === value);
    if (presetConfig) {
      const { start, end } = presetConfig.getValue();
      onDateChange({
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
      });
    }
  };

  const handleStartDateChange = (e) => {
    setPreset("");
    onDateChange({ startDate: e.target.value, endDate });
  };

  const handleEndDateChange = (e) => {
    setPreset("");
    onDateChange({ startDate, endDate: e.target.value });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Date Preset */}
          <div className="space-y-2">
            <Label>Quick Select</Label>
            <Select value={preset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
              <SelectContent>
                {presets.map((p) => (
                  <SelectItem key={p.label} value={p.label}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="pl-10 w-[160px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="pl-10 w-[160px]"
              />
            </div>
          </div>

          {/* Branch Filter */}
          {showBranchFilter && branches.length > 0 && (
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={branchId || "all"} onValueChange={onBranchChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id?.toString()}>
                      {branch.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Additional Filters */}
          {children}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Export Button */}
          {onExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isLoading}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onExport("csv")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("excel")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Print Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
