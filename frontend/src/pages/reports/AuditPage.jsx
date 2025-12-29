/**
 * Audit Trail Page
 * Display system audit logs and activity history
 */

import { useState, useMemo } from "react";
import { Download, Filter, Search } from "lucide-react";
import { PageHeader, DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";

const AuditPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
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
        accessorKey: "timestamp",
        header: "Date & Time",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {formatDate(row.getValue("timestamp"))}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.original.time}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue("user")}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.userRole}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
          const action = row.getValue("action");
          const variant =
            action === "CREATE"
              ? "success"
              : action === "UPDATE"
              ? "default"
              : action === "DELETE"
              ? "destructive"
              : "secondary";
          return <Badge variant={variant}>{action}</Badge>;
        },
      },
      {
        accessorKey: "module",
        header: "Module",
        meta: { className: "hidden md:table-cell" },
      },
      {
        accessorKey: "description",
        header: "Description",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => (
          <span className="line-clamp-2">{row.getValue("description")}</span>
        ),
      },
      {
        accessorKey: "ipAddress",
        header: "IP Address",
        meta: { className: "hidden xl:table-cell" },
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Trail"
        description="System activity logs and user actions"
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, action, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="CREATE">Create</SelectItem>
            <SelectItem value="UPDATE">Update</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
            <SelectItem value="VIEW">View</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
            <SelectItem value="LOGOUT">Logout</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              Audit Trail Information
            </h3>
            <p className="text-sm text-muted-foreground">
              All user actions are logged for security and compliance purposes.
              Logs include user identity, timestamp, action performed, and IP
              address. Data is retained for 90 days.
            </p>
          </div>
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
        emptyMessage="No audit logs found."
      />
    </div>
  );
};

export default AuditPage;
