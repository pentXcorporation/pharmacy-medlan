/**
 * Batch Tracking Page
 * Displays and manages product batches
 */

import { useState, useMemo } from "react";
import { Download, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks";
import { API_ENDPOINTS } from "@/config";
import { useBranchStore } from "@/store";
import { formatDate } from "@/utils/formatters";

/**
 * BatchTrackingPage component
 */
const BatchTrackingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const selectedBranch = useBranchStore((state) => state.selectedBranch);

  // Fetch inventory data with batches
  const { data: response, isLoading } = useApiQuery(
    ["inventory-batches", selectedBranch?.id],
    selectedBranch?.id
      ? API_ENDPOINTS.INVENTORY.BY_BRANCH(selectedBranch.id)
      : null,
    {
      params: { size: 1000 }, // Get all for filtering
      enabled: !!selectedBranch?.id,
    }
  );

  // Extract data from ApiResponse wrapper
  const data = response?.data;

  const batches = useMemo(() => {
    if (!data?.content) return [];
    
    // Extract all batches from inventory items
    const allBatches = [];
    data.content.forEach((inventory) => {
      if (inventory.batches && inventory.batches.length > 0) {
        inventory.batches.forEach((batch) => {
          allBatches.push({
            ...batch,
            // Use batch's own product info if available, otherwise fall back to inventory product
            productName: batch.productName || inventory.productName || "Unknown Product",
            productCode: batch.productCode || inventory.productCode || "",
          });
        });
      }
    });
    
    return allBatches;
  }, [data]);

  // Filter batches based on search query
  const filteredBatches = useMemo(() => {
    if (!searchQuery) return batches;
    
    const query = searchQuery.toLowerCase();
    return batches.filter(
      (batch) =>
        batch.batchNumber?.toLowerCase().includes(query) ||
        batch.productName?.toLowerCase().includes(query) ||
        batch.productCode?.toLowerCase().includes(query)
    );
  }, [batches, searchQuery]);

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0)
      return { label: "Expired", variant: "destructive" };
    if (daysUntilExpiry <= 30)
      return { label: "Critical", variant: "destructive" };
    if (daysUntilExpiry <= 90) return { label: "Warning", variant: "warning" };
    return { label: "Good", variant: "default" };
  };

  // Export function
  const handleExport = () => {
    if (filteredBatches.length === 0) return;
    
    const csv = [
      ["Batch Number", "Product", "Quantity", "Manufacturing Date", "Expiry Date", "Status"],
      ...filteredBatches.map((batch) => {
        const status = getExpiryStatus(batch.expiryDate);
        return [
          batch.batchNumber,
          batch.productName,
          batch.quantityAvailable || 0,
          formatDate(batch.manufacturingDate),
          formatDate(batch.expiryDate),
          status.label,
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `batch-tracking-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Batch Tracking</CardTitle>
            <CardDescription>
              Track product batches, expiry dates, and stock levels
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isLoading || filteredBatches.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by product or batch number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Manufacturing Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredBatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Package2 className="h-8 w-8" />
                        <p>
                          {searchQuery
                            ? "No batches match your search"
                            : "No batches found"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBatches.map((batch) => {
                    const status = getExpiryStatus(batch.expiryDate);
                    return (
                      <TableRow key={batch.id}>
                        <TableCell className="font-mono">
                          {batch.batchNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{batch.productName}</div>
                            {batch.productCode && (
                              <div className="text-xs text-muted-foreground">
                                {batch.productCode}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{batch.quantityAvailable || 0}</TableCell>
                        <TableCell>
                          {batch.manufacturingDate
                            ? formatDate(batch.manufacturingDate)
                            : "N/A"}
                        </TableCell>
                        <TableCell>{formatDate(batch.expiryDate)}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchTrackingPage;
