/**
 * Available Stock Page
 * Display all available stocks in inventory with filtering and search
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ROUTES } from "@/config";
import { useInventory } from "@/features/inventory";
import { useCategories } from "@/features/categories";
import { useBranchStore } from "@/store/branchStore";
import { useDebounce } from "@/hooks";
import {
  PageHeader,
  SearchInput,
  LoadingSpinner,
  EmptyState,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { downloadCSV } from "@/utils/exportImport";

/**
 * AvailableStockPage component
 */
const AvailableStockPage = () => {
  const navigate = useNavigate();
  const selectedBranch = useBranchStore((state) => state.selectedBranch);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all"); // all, in-stock, low-stock, out-of-stock
  const [sortBy, setSortBy] = useState("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch categories for filter
  const { data: categoriesData } = useCategories({ size: 100 });
  const categories = categoriesData?.content || [];

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, categoryFilter, stockFilter, sortBy]);

  // Build sort parameter
  const getSortParam = () => {
    switch (sortBy) {
      case "name-asc":
        return "product.productName,asc";
      case "name-desc":
        return "product.productName,desc";
      case "quantity-asc":
        return "quantityAvailable,asc";
      case "quantity-desc":
        return "quantityAvailable,desc";
      case "value-asc":
        return "quantityAvailable,asc"; // Sort by quantity as proxy for value
      case "value-desc":
        return "quantityAvailable,desc";
      default:
        return "product.productName,asc";
    }
  };

  // Fetch inventory data
  const { data, isLoading, error, refetch } = useInventory(
    selectedBranch?.id,
    {
      page,
      size,
      sort: getSortParam(),
    }
  );

  // Debug logging
  console.log('AvailableStockPage - selectedBranch:', selectedBranch);
  console.log('AvailableStockPage - branchId:', selectedBranch?.id);
  console.log('AvailableStockPage - API data:', data);
  console.log('AvailableStockPage - isLoading:', isLoading);
  console.log('AvailableStockPage - error:', error);

  const inventory = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  console.log('AvailableStockPage - inventory array:', inventory);
  console.log('AvailableStockPage - inventory length:', inventory.length);
  console.log('AvailableStockPage - first item:', inventory[0]);
  console.log('AvailableStockPage - first item keys:', inventory[0] ? Object.keys(inventory[0]) : 'no items');
  console.log('AvailableStockPage - first item productCode:', inventory[0]?.productCode);
  console.log('AvailableStockPage - first item productName:', inventory[0]?.productName);
  console.log('AvailableStockPage - first item product:', inventory[0]?.product);
  console.log('AvailableStockPage - first item product.productCode:', inventory[0]?.product?.productCode);
  console.log('AvailableStockPage - first item product.productName:', inventory[0]?.product?.productName);

  // Filter inventory based on search and filters
  const filteredInventory = useMemo(() => {
    if (!inventory) return [];

    let filtered = [...inventory];

    // Apply search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.productName?.toLowerCase().includes(query) ||
          item.productCode?.toLowerCase().includes(query) ||
          item.branchName?.toLowerCase().includes(query)
      );
    }

    // Apply stock filter
    if (stockFilter === "in-stock") {
      filtered = filtered.filter((item) => item.quantityAvailable > 0);
    } else if (stockFilter === "low-stock") {
      filtered = filtered.filter(
        (item) =>
          item.quantityAvailable > 0 &&
          item.quantityAvailable <= (item.reorderLevel || 10)
      );
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter((item) => item.quantityAvailable === 0);
    }

    return filtered;
  }, [inventory, debouncedSearch, stockFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStockFilter("all");
    setSortBy("name-asc");
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || categoryFilter !== "all" || stockFilter !== "all" || sortBy !== "name-asc";

  // Get stock status
  const getStockStatus = (item) => {
    if (item.quantityAvailable === 0) {
      return { label: "Out of Stock", variant: "destructive", icon: AlertCircle };
    } else if (
      item.quantityAvailable <= (item.reorderLevel || 10)
    ) {
      return { label: "Low Stock", variant: "warning", icon: TrendingDown };
    } else {
      return { label: "In Stock", variant: "success", icon: CheckCircle };
    }
  };

  // Export to CSV
  const handleExport = () => {
    if (filteredInventory.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = filteredInventory.map((item) => ({
      "Product Code": item.productCode || "",
      "Product Name": item.productName || "",
      Branch: item.branchName || "",
      "Available Quantity": item.quantityAvailable || 0,
      "On Hand": item.quantityOnHand || 0,
      "Allocated": item.quantityAllocated || 0,
      "Reorder Level": item.reorderLevel || 0,
      "Selling Price": item.sellingPrice || 0,
      "Avg Cost Price": item.averageCostPrice || 0,
      "Total Value": (item.quantityAvailable || 0) * (item.averageCostPrice || 0),
      Status: item.stockStatus || getStockStatus(item).label,
    }));

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `available-stock-${timestamp}.csv`;
    downloadCSV(exportData, filename);
    toast.success(`Exported ${exportData.length} items successfully`);
  };

  // View product details
  const handleViewProduct = (productId) => {
    navigate(ROUTES.PRODUCTS.VIEW(productId));
  };

  // View inventory details
  const handleViewInventory = (item) => {
    // You can navigate to inventory details page if needed
    console.log('View inventory:', item);
  };

  // Calculate summary stats
  const stats = useMemo(() => {
    return {
      totalItems: inventory.length,
      inStock: inventory.filter((item) => item.quantityAvailable > 0).length,
      lowStock: inventory.filter(
        (item) =>
          item.quantityAvailable > 0 &&
          item.quantityAvailable <= (item.reorderLevel || 10)
      ).length,
      outOfStock: inventory.filter((item) => item.quantityAvailable === 0).length,
      totalValue: inventory.reduce(
        (sum, item) =>
          sum + (item.quantityAvailable || 0) * (item.averageCostPrice || 0),
        0
      ),
    };
  }, [inventory]);

  if (!selectedBranch) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Available Stock"
          description="View all available stock in inventory"
          icon={Package}
        />
        <EmptyState
          icon={AlertCircle}
          title="No Branch Selected"
          description="Please select a branch to view available stock"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Available Stock"
          description="View all available stock in inventory"
          icon={Package}
        />
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Stock"
          description={error.message || "Failed to load inventory data"}
          action={
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Available Stock"
        description={`View all available stock in ${selectedBranch.branchName}`}
        icon={Package}
        actions={
          <Button onClick={handleExport} disabled={filteredInventory.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
            <p className="text-xs text-muted-foreground mt-1">Items in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Stock Inventory</CardTitle>
              <CardDescription>
                View available quantities for all products in stock
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by product name, code, generic name, or barcode..."
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="quantity-asc">Quantity (Low-High)</SelectItem>
                  <SelectItem value="quantity-desc">Quantity (High-Low)</SelectItem>
                  <SelectItem value="value-asc">Value (Low-High)</SelectItem>
                  <SelectItem value="value-desc">Value (High-Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid gap-4 p-4 border rounded-lg bg-muted/50 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock-filter">Stock Status</Label>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger id="stock-filter">
                    <SelectValue placeholder="All Items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Active Filters</Label>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary">
                      Search: {searchQuery}
                    </Badge>
                  )}
                  {categoryFilter !== "all" && (
                    <Badge variant="secondary">
                      Category:{" "}
                      {categories.find((c) => c.id === parseInt(categoryFilter))
                        ?.categoryName || "Unknown"}
                    </Badge>
                  )}
                  {stockFilter !== "all" && (
                    <Badge variant="secondary">
                      Status: {stockFilter.replace("-", " ")}
                    </Badge>
                  )}
                  {!hasActiveFilters && (
                    <span className="text-sm text-muted-foreground">
                      No filters applied
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Code</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Reserved</TableHead>
                    <TableHead className="text-right">Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <LoadingSkeleton />
                </TableBody>
              </Table>
            </div>
          ) : filteredInventory.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No Stock Items Found"
              description={
                searchQuery || stockFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No inventory items available"
              }
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Code</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Reserved</TableHead>
                    <TableHead className="text-right">Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const status = getStockStatus(item);
                    const StatusIcon = status.icon;
                    const stockValue =
                      (item.quantityAvailable || 0) *
                      (item.averageCostPrice || 0);

                    return (
                      <TableRow key={item.productId || item.id}>
                        <TableCell className="font-medium">
                          {item.productCode || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {item.productName || "Unknown"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            N/A
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-primary">
                              {item.quantityAvailable || 0}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              units
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantityAllocated || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.reorderLevel || 0}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(stockValue)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleViewProduct(item.product?.id)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {page * size + 1} to{" "}
                {Math.min((page + 1) * size, totalElements)} of {totalElements}{" "}
                items
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Loading skeleton
const LoadingSkeleton = () => (
  <>
    {[...Array(10)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-40" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-8" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export default AvailableStockPage;
