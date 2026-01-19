/**
 * Inventory Overview Page
 * Comprehensive inventory management with overview, available stock, and direct stock addition
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  AlertTriangle,
  Clock,
  ArrowLeftRight,
  TrendingDown,
  AlertCircle,
  Plus,
  Download,
  Eye,
  CheckCircle,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { ROUTES } from "@/config";
import {
  useLowStockProducts,
  useExpiringProducts,
  useInventory,
} from "@/features/inventory";
import { useCategories } from "@/features/categories";
import { useBranch } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { PageHeader, StatCard, SearchInput, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatters";

// Import sub-pages
import LowStockPage from "./LowStockPage";
import ExpiringPage from "./ExpiringPage";
import StockTransfersPage from "./StockTransfersPage";

// Import Direct Stock Form
import DirectStockForm from "./components/DirectStockForm";

/**
 * InventoryPage component
 */
const InventoryPage = () => {
  const navigate = useNavigate();
  const { selectedBranch } = useBranch();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDirectStockDialogOpen, setIsDirectStockDialogOpen] = useState(false);

  // Available Stock State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const size = 20;

  // Fetch summary data
  const { data: lowStockData } = useLowStockProducts({ size: 1 });
  const { data: expiringData } = useExpiringProducts({ size: 1, days: 90 });
  const { data: categories } = useCategories();

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch inventory data for available stock tab
  // Use larger page size when searching to ensure search results are found
  const effectiveSize = debouncedSearch ? 1000 : size;
  
  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
    error: inventoryError,
    refetch: refetchInventory,
  } = useInventory(
    selectedBranch?.id,
    {
      page: debouncedSearch ? 0 : page, // Always start from page 0 when searching
      size: effectiveSize,
      sort: sortBy.includes("name")
        ? `product.productName,${sortBy.split("-")[1]}`
        : sortBy.includes("quantity")
        ? `quantityAvailable,${sortBy.split("-")[1]}`
        : sortBy.includes("value")
        ? `product.costPrice,${sortBy.split("-")[1]}`
        : "product.productName,asc",
    },
    { enabled: !!selectedBranch && activeTab === "available-stock" }
  );

  const inventory = inventoryData?.content || [];
  const totalPages = inventoryData?.totalPages || 0;
  const totalElements = inventoryData?.totalElements || 0;

  const lowStockCount = lowStockData?.totalElements || 0;
  const expiringCount = expiringData?.totalElements || 0;

  // Filter inventory based on search and filters
  const filteredInventory = useMemo(() => {
    if (!inventory) return [];

    let filtered = [...inventory];

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.productName?.toLowerCase().includes(searchLower) ||
          item.productCode?.toLowerCase().includes(searchLower) ||
          item.branchName?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.product?.categoryId === parseInt(categoryFilter)
      );
    }

    // Stock status filter
    if (stockFilter !== "all") {
      filtered = filtered.filter((item) => {
        const available = item.quantityAvailable || 0;
        const reorderLevel = item.reorderLevel || 0;

        if (stockFilter === "in-stock") {
          return available > reorderLevel;
        } else if (stockFilter === "low-stock") {
          return available > 0 && available <= reorderLevel;
        } else if (stockFilter === "out-of-stock") {
          return available === 0;
        }
        return true;
      });
    }

    return filtered;
  }, [inventory, debouncedSearch, categoryFilter, stockFilter]);

  // Reset pagination when filters change
  useMemo(() => {
    setPage(0);
  }, [debouncedSearch, categoryFilter, stockFilter, sortBy]);

  // Calculate stats for available stock
  const stats = useMemo(() => {
    return {
      totalItems: inventory.length,
      inStock: inventory.filter((item) => item.quantityAvailable > 0).length,
      lowStock: inventory.filter(
        (item) =>
          item.quantityAvailable > 0 &&
          item.quantityAvailable <= (item.reorderLevel || 0)
      ).length,
      outOfStock: inventory.filter((item) => item.quantityAvailable === 0)
        .length,
      totalValue: inventory.reduce(
        (sum, item) =>
          sum + (item.quantityAvailable || 0) * (item.averageCostPrice || 0),
        0
      ),
    };
  }, [inventory]);

  const hasActiveFilters =
    searchQuery || categoryFilter !== "all" || stockFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStockFilter("all");
  };

  const getStockStatus = (item) => {
    const available = item.quantityAvailable || 0;
    const reorderLevel = item.reorderLevel || 0;

    if (available === 0) {
      return {
        label: "Out of Stock",
        variant: "destructive",
        icon: AlertCircle,
      };
    } else if (available <= reorderLevel) {
      return { label: "Low Stock", variant: "warning", icon: TrendingDown };
    } else {
      return { label: "In Stock", variant: "success", icon: CheckCircle };
    }
  };

  const handleViewProduct = (productId) => {
    if (productId) {
      navigate(ROUTES.PRODUCTS.VIEW(productId));
    }
  };

  const handleExport = () => {
    if (filteredInventory.length === 0) {
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
      Status: item.stockStatus || getStockStatus(item).label,
      "Avg Cost": item.averageCostPrice || 0,
      "Total Value":
        (item.quantityAvailable || 0) * (item.averageCostPrice || 0),
    }));

    const csv = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${selectedBranch?.branchName || "all"}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const overviewStats = [
    {
      title: "Low Stock Items",
      value: lowStockCount,
      icon: TrendingDown,
      trend: lowStockCount > 10 ? "Needs attention" : "Good",
      trendUp: lowStockCount <= 10,
      onClick: () => setActiveTab("low-stock"),
    },
    {
      title: "Expiring Soon",
      value: expiringCount,
      icon: Clock,
      description: "Within 90 days",
      onClick: () => setActiveTab("expiring"),
    },
    {
      title: "Out of Stock",
      value:
        lowStockData?.content?.filter((p) => p.currentStock === 0).length || 0,
      icon: AlertCircle,
      variant: "destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="Monitor stock levels, expiry dates, and manage stock transfers"
        actions={
          <div className="flex gap-2">
            <Dialog
              open={isDirectStockDialogOpen}
              onOpenChange={setIsDirectStockDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Direct Stock
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[95vh] p-0 gap-0">
                <DialogHeader className="px-4 sm:px-6 pt-6 pb-4 border-b">
                  <DialogTitle className="text-xl sm:text-2xl">Add Direct Stock to Inventory</DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Add stock directly to your inventory without a GRN process
                  </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto px-4 sm:px-6 py-4 max-h-[calc(95vh-140px)]">
                  <DirectStockForm
                    onSuccess={() => {
                      setIsDirectStockDialogOpen(false);
                      refetchInventory();
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button
              onClick={() => navigate(ROUTES.INVENTORY.TRANSFERS.NEW)}
              className="w-full sm:w-auto"
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New </span>Stock Transfer
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="flex-shrink-0">
            Overview
          </TabsTrigger>
          <TabsTrigger value="available-stock" className="flex-shrink-0">
            Available Stock
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="flex-shrink-0">
            Low Stock
            {lowStockCount > 0 && (
              <span className="ml-2 bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs">
                {lowStockCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="expiring" className="flex-shrink-0">
            Expiring
            {expiringCount > 0 && (
              <span className="ml-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs">
                {expiringCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {overviewStats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
                trend={stat.trend}
                trendUp={stat.trendUp}
                className={
                  stat.onClick
                    ? "cursor-pointer hover:shadow-md transition-shadow"
                    : ""
                }
                onClick={stat.onClick}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab("available-stock")}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">View All Stock</CardTitle>
                    <CardDescription>
                      Browse complete inventory
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab("low-stock")}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Low Stock Alert</CardTitle>
                    <CardDescription>
                      {lowStockCount} items need reordering
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab("expiring")}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Expiry Tracking</CardTitle>
                    <CardDescription>
                      {expiringCount} items expiring soon
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="available-stock" className="space-y-6">
          {!selectedBranch ? (
            <EmptyState
              icon={AlertCircle}
              title="No Branch Selected"
              description="Please select a branch to view available stock"
            />
          ) : inventoryError ? (
            <EmptyState
              icon={AlertCircle}
              title="Error Loading Stock"
              description={
                inventoryError.message || "Failed to load inventory data"
              }
              action={
                <Button onClick={() => refetchInventory()}>Try Again</Button>
              }
            />
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Items
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalItems}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Available Stock
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.inStock}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Items in stock</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Low Stock
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.lowStock}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Out of Stock
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {stats.outOfStock}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Value
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(stats.totalValue)}
                    </div>
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
                      <Button
                        onClick={handleExport}
                        disabled={filteredInventory.length === 0}
                        size="sm"
                        className="h-8"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export
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
                          <SelectItem value="quantity-asc">
                            Quantity (Low-High)
                          </SelectItem>
                          <SelectItem value="quantity-desc">
                            Quantity (High-Low)
                          </SelectItem>
                          <SelectItem value="value-asc">
                            Value (Low-High)
                          </SelectItem>
                          <SelectItem value="value-desc">
                            Value (High-Low)
                          </SelectItem>
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
                            {categories?.map((category) => (
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
                        <Select
                          value={stockFilter}
                          onValueChange={setStockFilter}
                        >
                          <SelectTrigger id="stock-filter">
                            <SelectValue placeholder="All Items" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Items</SelectItem>
                            <SelectItem value="in-stock">In Stock</SelectItem>
                            <SelectItem value="low-stock">Low Stock</SelectItem>
                            <SelectItem value="out-of-stock">
                              Out of Stock
                            </SelectItem>
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
                              {categories?.find(
                                (c) => c.id === parseInt(categoryFilter)
                              )?.categoryName || "Unknown"}
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
                  {/* Search Results Info */}
                  {debouncedSearch && !isLoadingInventory && (
                    <div className="mb-4 px-2">
                      <p className="text-sm text-muted-foreground">
                        Found {filteredInventory.length} result{filteredInventory.length !== 1 ? 's' : ''} for "{debouncedSearch}"
                      </p>
                    </div>
                  )}
                  
                  {isLoadingInventory ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product Code</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">
                              Available
                            </TableHead>
                            <TableHead className="text-right">
                              Reserved
                            </TableHead>
                            <TableHead className="text-right">
                              Reorder Level
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
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
                            <TableHead className="text-right">
                              Available
                            </TableHead>
                            <TableHead className="text-right">
                              Reserved
                            </TableHead>
                            <TableHead className="text-right">
                              Reorder Level
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
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
                                  {item.quantityReserved || 0}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.reorderLevel || 0}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={status.variant}
                                    className="gap-1"
                                  >
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
                  {!isLoadingInventory && !debouncedSearch && totalPages > 1 && (
                    <div className="flex items-center justify-between px-2 py-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {page * size + 1} to{" "}
                        {Math.min((page + 1) * size, totalElements)} of{" "}
                        {totalElements} items
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
                          onClick={() =>
                            setPage((p) => Math.min(totalPages - 1, p + 1))
                          }
                          disabled={page >= totalPages - 1}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="low-stock">
          <LowStockPage />
        </TabsContent>

        <TabsContent value="expiring">
          <ExpiringPage />
        </TabsContent>

        <TabsContent value="transfers">
          <StockTransfersPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Loading skeleton component
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

export default InventoryPage;
