/**
 * Products List Page
 * Displays all products with filtering, sorting, and pagination
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { ROUTES } from "@/config";
import { useProducts, useDeleteProduct } from "@/features/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatters";
import { useConfirm } from "@/components/common/ConfirmDialog";

/**
 * ProductsPage component
 */
const ProductsPage = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products
  const { data, isLoading, error } = useProducts({
    page: 0,
    size: 50,
    sort: "productName,asc",
    ...(searchQuery && { search: searchQuery }),
  });

  const deleteProduct = useDeleteProduct();

  // Extract products from response
  const products = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.content && Array.isArray(data.content)) return data.content;
    return [];
  }, [data]);

  // Handlers
  const handleView = (product) => {
    navigate(ROUTES.PRODUCTS.VIEW(product.id));
  };

  const handleEdit = (product) => {
    navigate(ROUTES.PRODUCTS.EDIT(product.id));
  };

  const handleDelete = async (product) => {
    const confirmed = await confirm({
      title: "Delete Product",
      description: `Are you sure you want to delete "${product.productName}"?`,
      confirmText: "Delete",
      variant: "destructive",
    });

    if (confirmed) {
      deleteProduct.mutate(product.id);
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
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
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Upload className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            onClick={() => navigate(ROUTES.PRODUCTS.NEW)}
            className="flex-1 sm:flex-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-sm sm:text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `${products.length} products found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-10 text-destructive">
              Error loading products. Please try again.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[600px] sm:min-w-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Code</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Product Name
                      </TableHead>
                      <TableHead className="whitespace-nowrap hidden sm:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">
                        Form
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Price</TableHead>
                      <TableHead className="whitespace-nowrap hidden sm:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <LoadingSkeleton />
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="text-muted-foreground">
                            No products found. Click "Add Product" to create
                            your first product.
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-mono text-xs sm:text-sm whitespace-nowrap">
                            {product.productCode}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-sm truncate max-w-[150px] sm:max-w-none">
                                {product.productName}
                              </span>
                              {product.genericName && (
                                <span className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                                  {product.genericName}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge
                              variant="outline"
                              className="whitespace-nowrap"
                            >
                              {product.category?.categoryName || "-"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell whitespace-nowrap">
                            {product.dosageForm || "-"}
                          </TableCell>
                          <TableCell className="font-medium whitespace-nowrap">
                            {formatCurrency(product.sellingPrice)}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge
                              variant={
                                product.isActive ? "default" : "secondary"
                              }
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleView(product)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEdit(product)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(product)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
