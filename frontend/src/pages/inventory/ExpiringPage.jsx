/**
 * Expiring Products Page
 * Displays products approaching expiry or already expired
 */

import { useState, useMemo } from "react";
import { Download, AlertTriangle } from "lucide-react";
import {
  useExpiringProducts,
  useExpiredProducts,
  getExpiringColumns,
} from "@/features/inventory";
import { DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * ExpiringPage component
 */
const ExpiringPage = () => {
  const [activeTab, setActiveTab] = useState("expiring");

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  // Sorting state
  const [sorting, setSorting] = useState([]);

  // Build query params
  const queryParams = useMemo(
    () => ({
      page: pagination.pageIndex,
      size: pagination.pageSize,
      sort:
        sorting.length > 0
          ? `${sorting[0].id},${sorting[0].desc ? "desc" : "asc"}`
          : "expiryDate,asc",
    }),
    [pagination, sorting]
  );

  // Fetch data
  const expiringQuery = useExpiringProducts({ ...queryParams, days: 90 });
  const expiredQuery = useExpiredProducts(queryParams);

  // Select data based on active tab
  const data =
    activeTab === "expiring" ? expiringQuery.data : expiredQuery.data;
  const isLoading =
    activeTab === "expiring" ? expiringQuery.isLoading : expiredQuery.isLoading;
  const isFetching =
    activeTab === "expiring"
      ? expiringQuery.isFetching
      : expiredQuery.isFetching;

  // Get columns
  const columns = useMemo(() => getExpiringColumns(), []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6">
          <div>
            <CardTitle className="text-lg sm:text-xl">
              Expiry Management
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Track products approaching expiry and manage expired stock
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 p-2 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="expiring" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Expiring Soon</span>
                <span className="sm:hidden">Expiring</span>
                {(expiringQuery.data?.totalElements || 0) > 0 && (
                  <span className="ml-1 sm:ml-2 bg-orange-500 text-white rounded-full px-1.5 sm:px-2 py-0.5 text-xs">
                    {expiringQuery.data?.totalElements}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="expired" className="text-xs sm:text-sm">
                Expired
                {(expiredQuery.data?.totalElements || 0) > 0 && (
                  <span className="ml-1 sm:ml-2 bg-destructive text-destructive-foreground rounded-full px-1.5 sm:px-2 py-0.5 text-xs">
                    {expiredQuery.data?.totalElements}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expiring" className="mt-4">
              <DataTable
                columns={columns}
                data={data?.content || []}
                isLoading={isLoading}
                isFetching={isFetching}
                pagination={{
                  pageIndex: pagination.pageIndex,
                  pageSize: pagination.pageSize,
                  pageCount: data?.totalPages || 0,
                  total: data?.totalElements || 0,
                }}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
              />
            </TabsContent>

            <TabsContent value="expired" className="mt-4">
              {(expiredQuery.data?.totalElements || 0) > 0 && (
                <div className="mb-4 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start sm:items-center gap-2 sm:gap-3">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <p className="font-medium text-destructive text-sm sm:text-base">
                      {expiredQuery.data?.totalElements} expired products
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Remove and dispose properly.
                    </p>
                  </div>
                </div>
              )}
              <DataTable
                columns={columns}
                data={data?.content || []}
                isLoading={isLoading}
                isFetching={isFetching}
                pagination={{
                  pageIndex: pagination.pageIndex,
                  pageSize: pagination.pageSize,
                  pageCount: data?.totalPages || 0,
                  total: data?.totalElements || 0,
                }}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpiringPage;
