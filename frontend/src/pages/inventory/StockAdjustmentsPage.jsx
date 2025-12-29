/**
 * Stock Adjustments Page
 * Displays and manages stock adjustments
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Plus, Package } from "lucide-react";
import { ROUTES } from "@/config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
 * StockAdjustmentsPage component
 */
const StockAdjustmentsPage = () => {
  const navigate = useNavigate();
  const [adjustmentType, setAdjustmentType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Replace with actual API call
  const isLoading = false;
  const adjustments = [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Stock Adjustments</CardTitle>
            <CardDescription>
              Manage stock adjustments for damage, loss, or corrections
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate(ROUTES.INVENTORY.ADJUSTMENTS.NEW)}>
              <Plus className="mr-2 h-4 w-4" />
              New Adjustment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={adjustmentType} onValueChange={setAdjustmentType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Adjustment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="DAMAGE">Damage</SelectItem>
                <SelectItem value="LOSS">Loss</SelectItem>
                <SelectItem value="EXPIRY">Expiry</SelectItem>
                <SelectItem value="CORRECTION">Correction</SelectItem>
                <SelectItem value="COUNT">Physical Count</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Adjusted By</TableHead>
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
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : adjustments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Package className="h-8 w-8" />
                        <p>No stock adjustments found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  adjustments.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                      <TableCell>{adjustment.date}</TableCell>
                      <TableCell>{adjustment.productName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{adjustment.type}</Badge>
                      </TableCell>
                      <TableCell
                        className={
                          adjustment.quantity > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {adjustment.quantity > 0 ? "+" : ""}
                        {adjustment.quantity}
                      </TableCell>
                      <TableCell>{adjustment.reason}</TableCell>
                      <TableCell>{adjustment.adjustedBy}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            adjustment.status === "APPROVED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {adjustment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockAdjustmentsPage;
