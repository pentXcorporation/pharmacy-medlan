/**
 * Products List Page
 * Displays all products with filtering, sorting, and pagination
 */

import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileDown,
} from "lucide-react";
import { ROUTES } from "@/config";
import { useProducts, useDeleteProduct } from "@/features/products";
import { useCategories } from "@/features/categories";
import { useDebounce } from "@/hooks/useDebounce";
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
import { downloadCSV, readFileAsText, csvToJSON } from "@/utils/exportImport";
import { useConfirm } from "@/components/common/ConfirmDialog";
import { productService } from "@/services";
import { toast } from "sonner";

/**
 * Advanced product search algorithm
 * Supports: exact barcode match, name search, generic name search, SKU search, partial matches
 */
const searchProducts = (products, searchTerm) => {
  if (!searchTerm || searchTerm.trim().length === 0) return products;

  const query = searchTerm.trim().toLowerCase();
  const results = [];

  products.forEach((product) => {
    // Handle various possible field names from API
    const name = (product.productName || product.name || "").toLowerCase();
    const sku = (product.productCode || product.sku || "").toLowerCase();
    const barcode = (product.barcode || "").toLowerCase();
    const genericName = (product.genericName || "").toLowerCase();
    const manufacturer = (product.manufacturer || "").toLowerCase();
    const description = (product.description || "").toLowerCase();
    const category = (product.category?.categoryName || "").toLowerCase();

    let score = 0;
    let matchType = "";

    // Priority 1: Exact barcode match
    if (barcode && barcode === query) {
      score = 1000;
      matchType = "barcode-exact";
    }
    // Priority 2: Barcode starts with query
    else if (barcode && barcode.startsWith(query)) {
      score = 900;
      matchType = "barcode-prefix";
    }
    // Priority 3: Barcode contains query
    else if (barcode && barcode.includes(query)) {
      score = 800;
      matchType = "barcode-partial";
    }
    // Priority 4: Exact SKU match
    else if (sku && sku === query) {
      score = 700;
      matchType = "sku-exact";
    }
    // Priority 5: SKU starts with query
    else if (sku && sku.startsWith(query)) {
      score = 600;
      matchType = "sku-prefix";
    }
    // Priority 6: Product name OR Generic name exact match
    else if ((name && name === query) || (genericName && genericName === query)) {
      score = 550;
      matchType = (genericName && genericName === query) ? "generic-exact" : "name-exact";
    }
    // Priority 7: Product name OR Generic name starts with query
    else if ((name && name.startsWith(query)) || (genericName && genericName.startsWith(query))) {
      score = 500;
      matchType = (genericName && genericName.startsWith(query)) ? "generic-prefix" : "name-prefix";
    }
    // Priority 8: Product name OR Generic name contains whole word match
    else if (
      (name && (name.includes(` ${query} `) || name.startsWith(`${query} `) || name.endsWith(` ${query}`))) ||
      (genericName && (genericName.includes(` ${query} `) || genericName.startsWith(`${query} `) || genericName.endsWith(` ${query}`)))
    ) {
      score = 450;
      const genericMatch = genericName && (genericName.includes(` ${query} `) || genericName.startsWith(`${query} `) || genericName.endsWith(` ${query}`));
      matchType = genericMatch ? "generic-word" : "name-word";
    }
    // Priority 9: Product name OR Generic name contains query anywhere
    else if ((name && name.includes(query)) || (genericName && genericName.includes(query))) {
      score = 400;
      matchType = (genericName && genericName.includes(query)) ? "generic-partial" : "name-partial";
    }
    // Priority 10: Category contains query
    else if (category && category.includes(query)) {
      score = 300;
      matchType = "category";
    }
    // Priority 11: Description contains query
    else if (description && description.includes(query)) {
      score = 250;
      matchType = "description";
    }
    // Priority 12: SKU contains query
    else if (sku && sku.includes(query)) {
      score = 200;
      matchType = "sku-partial";
    }
    // Priority 13: Manufacturer match
    else if (manufacturer && manufacturer.includes(query)) {
      score = 150;
      matchType = "manufacturer";
    }

    // Fuzzy matching for typos (check both name and generic name)
    if (score === 0 && query.length >= 3) {
      if (name && isCloseMatch(name, query)) {
        score = 100;
        matchType = "fuzzy-name";
      } else if (genericName && isCloseMatch(genericName, query)) {
        score = 95;
        matchType = "fuzzy-generic";
      }
    }

    if (score > 0) {
      results.push({
        ...product,
        searchScore: score,
        matchType,
      });
    }
  });

  // Sort by score (highest first)
  return results.sort((a, b) => b.searchScore - a.searchScore);
};

/**
 * Basic fuzzy matching - checks if strings are similar within 1-2 character differences
 */
const isCloseMatch = (str, query) => {
  const words = str.split(" ");
  return words.some(word => {
    if (word.length < query.length) return false;
    let differences = 0;
    for (let i = 0; i < Math.min(word.length, query.length); i++) {
      if (word[i] !== query[i]) differences++;
      if (differences > 2) return false;
    }
    return differences <= 2 && Math.abs(word.length - query.length) <= 1;
  });
};

/**
 * ProductsPage component
 */
const ProductsPage = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  // Debounce search for performance
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch all products (removed search param for client-side filtering)
  const { data, isLoading, error, refetch } = useProducts({
    page: 0,
    size: 1000, // Fetch more products for better search results
    sort: "productName,asc",
  });

  // Fetch all categories to map category IDs to names
  const { data: categoriesData } = useCategories();

  const deleteProduct = useDeleteProduct();

  // Create category lookup map
  const categoryMap = useMemo(() => {
    if (!categoriesData?.content) return {};
    return categoriesData.content.reduce((map, category) => {
      map[category.id] = category;
      return map;
    }, {});
  }, [categoriesData]);

  // Extract all products from response and map categories
  const allProducts = useMemo(() => {
    if (!data) return [];
    let products = [];
    if (Array.isArray(data)) products = data;
    else if (data.content && Array.isArray(data.content)) products = data.content;
    
    // Map category IDs to category objects
    return products.map(product => {
      if (product.categoryId && categoryMap[product.categoryId]) {
        return {
          ...product,
          category: categoryMap[product.categoryId]
        };
      }
      return product;
    });
  }, [data, categoryMap]);

  // Filter products using advanced search
  const products = useMemo(() => {
    return searchProducts(allProducts, debouncedSearch);
  }, [allProducts, debouncedSearch]);

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

  // Export products to CSV
  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Prepare data for export
      const exportData = products.map((product) => ({
        Code: product.productCode,
        Name: product.productName,
        "Generic Name": product.genericName || "",
        Category: product.category?.categoryName || "",
        "Dosage Form": product.dosageForm || "",
        Strength: product.strength || "",
        Manufacturer: product.manufacturer || "",
        Barcode: product.barcode || "",
        "Selling Price": product.sellingPrice || 0,
        "Cost Price": product.costPrice || 0,
        "Reorder Level": product.reorderLevel || 0,
        "Min Order Qty": product.minOrderQuantity || 0,
        "Pack Size": product.packSize || 1,
        Unit: product.unit || "",
        Status: product.isActive ? "Active" : "Inactive",
        Description: product.description || "",
      }));

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `products-export-${timestamp}.csv`;

      // Download CSV
      downloadCSV(exportData, filename);

      toast.success(`Exported ${exportData.length} products successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export products");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file selection for import
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const template = [
      {
        Code: "PROD001",
        Name: "Product Name",
        "Generic Name": "Generic Name",
        Category: "Category Name",
        "Dosage Form": "Tablet",
        Strength: "500mg",
        Manufacturer: "Manufacturer Name",
        Barcode: "1234567890123",
        "Selling Price": "100.00",
        "Cost Price": "80.00",
        "Reorder Level": "10",
        "Min Order Qty": "5",
        "Pack Size": "10",
        Unit: "Box",
        Status: "Active",
        Description: "Product description",
      },
    ];

    downloadCSV(template, "product-import-template.csv");
    toast.success("Template downloaded successfully");
  };

  // Import products from CSV
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    try {
      setIsImporting(true);

      // Read file content
      const content = await readFileAsText(file);
      const importedData = csvToJSON(content);

      if (importedData.length === 0) {
        toast.error("The CSV file is empty");
        return;
      }

      // Validate required fields
      const requiredFields = ["Code", "Name", "Selling Price"];
      const firstRow = importedData[0];
      const missingFields = requiredFields.filter(
        (field) => !Object.keys(firstRow).includes(field)
      );

      if (missingFields.length > 0) {
        toast.error(
          `Missing required columns: ${missingFields.join(", ")}`
        );
        return;
      }

      // Transform data to match API format
      const productsToImport = importedData.map((row) => ({
        productCode: row.Code,
        productName: row.Name,
        genericName: row["Generic Name"],
        dosageForm: row["Dosage Form"],
        strength: row.Strength,
        manufacturer: row.Manufacturer,
        barcode: row.Barcode,
        sellingPrice: parseFloat(row["Selling Price"]) || 0,
        costPrice: parseFloat(row["Cost Price"]) || 0,
        reorderLevel: parseInt(row["Reorder Level"]) || 0,
        minOrderQuantity: parseInt(row["Min Order Qty"]) || 0,
        packSize: parseInt(row["Pack Size"]) || 1,
        unit: row.Unit,
        isActive: row.Status?.toLowerCase() === "active",
        description: row.Description,
      }));

      // TODO: Call backend API to bulk import
      // For now, show success message
      console.log("Products to import:", productsToImport);
      toast.success(
        `Ready to import ${productsToImport.length} products. Backend import API needs to be implemented.`
      );

      // Refresh product list
      refetch();
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import products");
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
                disabled={isImporting}
              >
                <Upload className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">
                  {isImporting ? "Importing..." : "Import"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Import Products</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadTemplate}>
                <FileDown className="mr-2 h-4 w-4" />
                Download Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={handleExport}
            disabled={isExporting || products.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">
              {isExporting ? "Exporting..." : "Export"}
            </span>
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
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate max-w-[150px] sm:max-w-none">
                                  {product.productName}
                                </span>
                                {product.matchType?.includes("barcode") && (
                                  <Badge variant="secondary" className="text-xs">
                                    Barcode
                                  </Badge>
                                )}
                                {product.matchType?.includes("generic") && (
                                  <Badge variant="default" className="text-xs">
                                    Generic
                                  </Badge>
                                )}
                                {product.matchType?.includes("fuzzy") && (
                                  <Badge variant="outline" className="text-xs">
                                    Similar
                                  </Badge>
                                )}
                              </div>
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
