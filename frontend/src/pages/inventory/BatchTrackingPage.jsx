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

/**
 * BatchTrackingPage component
 */
const BatchTrackingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Replace with actual API call
  const isLoading = false;
  const batches = [];

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
          <Button variant="outline" size="sm">
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
                ) : batches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Package2 className="h-8 w-8" />
                        <p>No batches found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  batches.map((batch) => {
                    const status = getExpiryStatus(batch.expiryDate);
                    return (
                      <TableRow key={batch.id}>
                        <TableCell className="font-mono">
                          {batch.batchNumber}
                        </TableCell>
                        <TableCell>{batch.productName}</TableCell>
                        <TableCell>{batch.quantity}</TableCell>
                        <TableCell>{batch.manufacturingDate}</TableCell>
                        <TableCell>{batch.expiryDate}</TableCell>
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
