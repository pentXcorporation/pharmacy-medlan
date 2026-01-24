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
  X,
  Filter,
} from "lucide-react";
import { ROUTES } from "@/config";
import { useProducts, useDeleteProduct } from "@/features/products";
import { useCategories } from "@/features/categories";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
 * Normalize and tokenize text for better matching
 */
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace special chars with space
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

/**
 * Tokenize search query into individual words
 */
const tokenizeQuery = (query) => {
  return normalizeText(query)
    .split(' ')
    .filter(token => token.length > 0);
};

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

/**
 * Enhanced fuzzy matching with similarity percentage
 */
const getFuzzySimilarity = (str, query) => {
  const normalizedStr = normalizeText(str);
  const normalizedQuery = normalizeText(query);
  
  // Direct substring match
  if (normalizedStr.includes(normalizedQuery)) {
    return 1.0;
  }
  
  // Check word-by-word
  const strWords = normalizedStr.split(' ');
  const queryWords = normalizedQuery.split(' ');
  
  let bestSimilarity = 0;
  
  // Single word fuzzy match
  if (queryWords.length === 1) {
    strWords.forEach(word => {
      if (word.length < 2) return;
      
      // Starts with check
      if (word.startsWith(normalizedQuery)) {
        bestSimilarity = Math.max(bestSimilarity, 0.9);
        return;
      }
      
      // Levenshtein distance
      const distance = levenshteinDistance(word, normalizedQuery);
      const maxLen = Math.max(word.length, normalizedQuery.length);
      const similarity = 1 - (distance / maxLen);
      
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
      }
    });
  } else {
    // Multi-word query - check if all words are present
    const allWordsPresent = queryWords.every(qWord => 
      strWords.some(sWord => {
        if (sWord.includes(qWord)) return true;
        const distance = levenshteinDistance(sWord, qWord);
        return distance <= Math.floor(qWord.length * 0.3); // 30% tolerance
      })
    );
    
    if (allWordsPresent) {
      bestSimilarity = 0.85;
    }
  }
  
  return bestSimilarity;
};

/**
 * Advanced product search algorithm with optimized matching
 * Supports: exact matches, partial matches, multi-word search, fuzzy matching, tokenized search
 */
const searchProducts = (products, searchTerm) => {
  if (!searchTerm || searchTerm.trim().length === 0) return products;

  const query = searchTerm.trim();
  const normalizedQuery = normalizeText(query);
  const queryTokens = tokenizeQuery(query);
  const results = [];

  products.forEach((product) => {
    // Extract and normalize all searchable fields
    const name = product.productName || product.name || "";
    const sku = product.productCode || product.sku || "";
    const barcode = product.barcode || "";
    const genericName = product.genericName || "";
    const manufacturer = product.manufacturer || "";
    const supplier = product.supplier || "";
    const description = product.description || "";
    const category = product.category?.categoryName || "";
    const strength = product.strength || "";
    const dosageForm = product.dosageForm || "";

    const normalizedName = normalizeText(name);
    const normalizedSku = normalizeText(sku);
    const normalizedBarcode = normalizeText(barcode);
    const normalizedGeneric = normalizeText(genericName);
    const normalizedManufacturer = normalizeText(manufacturer);
    const normalizedCategory = normalizeText(category);
    const normalizedDescription = normalizeText(description);
    const normalizedSupplier = normalizeText(supplier);
    const normalizedStrength = normalizeText(strength);

    let score = 0;
    let matchType = "";
    let matchedFields = [];

    // Priority 1: Exact barcode match (highest priority)
    if (normalizedBarcode && normalizedBarcode === normalizedQuery) {
      score = 10000;
      matchType = "barcode-exact";
      matchedFields.push("barcode");
    }
    // Priority 2: Exact SKU/Code match
    else if (normalizedSku && normalizedSku === normalizedQuery) {
      score = 9000;
      matchType = "sku-exact";
      matchedFields.push("code");
    }
    // Priority 3: Barcode starts with query
    else if (normalizedBarcode && normalizedBarcode.startsWith(normalizedQuery)) {
      score = 8500;
      matchType = "barcode-prefix";
      matchedFields.push("barcode");
    }
    // Priority 4: SKU starts with query
    else if (normalizedSku && normalizedSku.startsWith(normalizedQuery)) {
      score = 8000;
      matchType = "sku-prefix";
      matchedFields.push("code");
    }
    // Priority 5: Exact product name match
    else if (normalizedName === normalizedQuery) {
      score = 7500;
      matchType = "name-exact";
      matchedFields.push("name");
    }
    // Priority 6: Exact generic name match
    else if (normalizedGeneric && normalizedGeneric === normalizedQuery) {
      score = 7000;
      matchType = "generic-exact";
      matchedFields.push("generic");
    }
    // Priority 7: Product name starts with query
    else if (normalizedName.startsWith(normalizedQuery)) {
      score = 6500;
      matchType = "name-prefix";
      matchedFields.push("name");
    }
    // Priority 8: Generic name starts with query
    else if (normalizedGeneric && normalizedGeneric.startsWith(normalizedQuery)) {
      score = 6000;
      matchType = "generic-prefix";
      matchedFields.push("generic");
    }
    // Priority 9: All query tokens present in name
    else if (queryTokens.length > 1 && queryTokens.every(token => normalizedName.includes(token))) {
      score = 5500;
      matchType = "name-all-tokens";
      matchedFields.push("name");
    }
    // Priority 10: All query tokens present in generic name
    else if (queryTokens.length > 1 && normalizedGeneric && queryTokens.every(token => normalizedGeneric.includes(token))) {
      score = 5000;
      matchType = "generic-all-tokens";
      matchedFields.push("generic");
    }
    // Priority 11: Product name contains whole word
    else if (normalizedName.split(' ').some(word => word === normalizedQuery)) {
      score = 4500;
      matchType = "name-word";
      matchedFields.push("name");
    }
    // Priority 12: Generic name contains whole word
    else if (normalizedGeneric && normalizedGeneric.split(' ').some(word => word === normalizedQuery)) {
      score = 4000;
      matchType = "generic-word";
      matchedFields.push("generic");
    }
    // Priority 13: Name contains query substring
    else if (normalizedName.includes(normalizedQuery)) {
      score = 3500;
      matchType = "name-partial";
      matchedFields.push("name");
    }
    // Priority 14: Generic name contains query substring
    else if (normalizedGeneric && normalizedGeneric.includes(normalizedQuery)) {
      score = 3000;
      matchType = "generic-partial";
      matchedFields.push("generic");
    }
    // Priority 15: Barcode contains query
    else if (normalizedBarcode && normalizedBarcode.includes(normalizedQuery)) {
      score = 2800;
      matchType = "barcode-partial";
      matchedFields.push("barcode");
    }
    // Priority 16: SKU contains query
    else if (normalizedSku && normalizedSku.includes(normalizedQuery)) {
      score = 2600;
      matchType = "sku-partial";
      matchedFields.push("code");
    }
    // Priority 17: Strength match
    else if (normalizedStrength && normalizedStrength.includes(normalizedQuery)) {
      score = 2400;
      matchType = "strength";
      matchedFields.push("strength");
    }
    // Priority 18: Category match
    else if (normalizedCategory && normalizedCategory.includes(normalizedQuery)) {
      score = 2200;
      matchType = "category";
      matchedFields.push("category");
    }
    // Priority 19: Dosage form match
    else if (normalizedQuery === normalizeText(dosageForm)) {
      score = 2000;
      matchType = "dosage-form";
      matchedFields.push("form");
    }
    // Priority 20: Manufacturer match
    else if (normalizedManufacturer && normalizedManufacturer.includes(normalizedQuery)) {
      score = 1800;
      matchType = "manufacturer";
      matchedFields.push("manufacturer");
    }
    // Priority 21: Supplier match
    else if (normalizedSupplier && normalizedSupplier.includes(normalizedQuery)) {
      score = 1600;
      matchType = "supplier";
      matchedFields.push("supplier");
    }
    // Priority 22: Description match
    else if (normalizedDescription && normalizedDescription.includes(normalizedQuery)) {
      score = 1400;
      matchType = "description";
      matchedFields.push("description");
    }

    // Fuzzy matching with advanced similarity
    if (score === 0 && normalizedQuery.length >= 3) {
      // Check name fuzzy match
      const nameSimilarity = getFuzzySimilarity(name, query);
      if (nameSimilarity >= 0.7) {
        score = Math.floor(1200 * nameSimilarity);
        matchType = "fuzzy-name";
        matchedFields.push("name-fuzzy");
      }
      
      // Check generic name fuzzy match
      if (genericName) {
        const genericSimilarity = getFuzzySimilarity(genericName, query);
        if (genericSimilarity >= 0.7 && genericSimilarity * 1100 > score) {
          score = Math.floor(1100 * genericSimilarity);
          matchType = "fuzzy-generic";
          matchedFields.push("generic-fuzzy");
        }
      }
      
      // Check manufacturer fuzzy match
      if (manufacturer) {
        const mfgSimilarity = getFuzzySimilarity(manufacturer, query);
        if (mfgSimilarity >= 0.8 && mfgSimilarity * 900 > score) {
          score = Math.floor(900 * mfgSimilarity);
          matchType = "fuzzy-manufacturer";
          matchedFields.push("manufacturer-fuzzy");
        }
      }
    }

    // Boost score for multiple token matches
    if (queryTokens.length > 1 && score > 0) {
      const tokenMatchCount = queryTokens.filter(token => 
        normalizedName.includes(token) || 
        normalizedGeneric.includes(token) ||
        normalizedBarcode.includes(token) ||
        normalizedSku.includes(token)
      ).length;
      
      const tokenBoost = (tokenMatchCount / queryTokens.length) * 500;
      score += tokenBoost;
    }

    if (score > 0) {
      results.push({
        ...product,
        searchScore: score,
        matchType,
        matchedFields,
      });
    }
  });

  // Sort by score (highest first)
  return results.sort((a, b) => b.searchScore - a.searchScore);
};

/**
 * ProductsPage component
 */
const ProductsPage = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dosageFormFilter, setDosageFormFilter] = useState("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState("all");
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

  // Get unique dosage forms for filter
  const dosageForms = useMemo(() => {
    const forms = new Set();
    allProducts.forEach(product => {
      if (product.dosageForm) {
        forms.add(product.dosageForm);
      }
    });
    return Array.from(forms).sort();
  }, [allProducts]);

  // Filter products using advanced search and filters
  const products = useMemo(() => {
    let filtered = searchProducts(allProducts, debouncedSearch);
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => 
        product.category?.id?.toString() === categoryFilter.toString()
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter(product => product.isActive === true);
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter(product => product.isActive === false);
      } else if (statusFilter === "discontinued") {
        filtered = filtered.filter(product => product.isDiscontinued === true);
      }
    }
    
    // Apply dosage form filter
    if (dosageFormFilter !== "all") {
      filtered = filtered.filter(product => 
        product.dosageForm === dosageFormFilter
      );
    }
    
    // Apply price range filter
    if (priceRangeFilter !== "all") {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.sellingPrice) || 0;
        switch (priceRangeFilter) {
          case "under-100":
            return price < 100;
          case "100-500":
            return price >= 100 && price < 500;
          case "500-1000":
            return price >= 500 && price < 1000;
          case "1000-5000":
            return price >= 1000 && price < 5000;
          case "over-5000":
            return price >= 5000;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [allProducts, debouncedSearch, categoryFilter, statusFilter, dosageFormFilter, priceRangeFilter]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== "all") count++;
    if (statusFilter !== "all") count++;
    if (dosageFormFilter !== "all") count++;
    if (priceRangeFilter !== "all") count++;
    return count;
  }, [categoryFilter, statusFilter, dosageFormFilter, priceRangeFilter]);

  // Clear all filters
  const clearFilters = () => {
    setCategoryFilter("all");
    setStatusFilter("all");
    setDosageFormFilter("all");
    setPriceRangeFilter("all");
    setSearchQuery("");
  };

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

      // Call backend API to bulk import
      try {
        // Create a new CSV file from the parsed data
        const csvContent = [
          // Header row
          Object.keys(productsToImport[0]).join(","),
          // Data rows
          ...productsToImport.map(product => 
            Object.values(product).map(val => 
              typeof val === 'string' && val.includes(',') ? `"${val}"` : val
            ).join(",")
          )
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const file = new File([blob], "products_import.csv", { type: "text/csv" });
        
        // Upload to backend
        await productService.import(file);
        
        toast.success(
          `Successfully imported ${productsToImport.length} products!`
        );
        
        // Refresh product list
        refetch();
      } catch (apiError) {
        console.error("Backend import error:", apiError);
        // Fallback: show data ready message if backend is not available
        toast.info(
          `Parsed ${productsToImport.length} products. Backend import endpoint may need configuration.`
        );
      }
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </CardTitle>
            {(activeFiltersCount > 0 || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="w-full space-y-1.5">
              <Input
                placeholder="🔍 Search by name, code, barcode, generic name, manufacturer, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              {searchQuery && products.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Found {products.length} {products.length === 1 ? 'product' : 'products'} matching "{searchQuery}"
                </p>
              )}
              {searchQuery && products.length === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  No products found. Try a different search term or check the filters.
                </p>
              )}
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Category Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Category
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesData?.content?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dosage Form Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Dosage Form
                </label>
                <Select value={dosageFormFilter} onValueChange={setDosageFormFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Forms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Forms</SelectItem>
                    {dosageForms.map((form) => (
                      <SelectItem key={form} value={form}>
                        {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Price Range
                </label>
                <Select value={priceRangeFilter} onValueChange={setPriceRangeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-100">Under ₹100</SelectItem>
                    <SelectItem value="100-500">₹100 - ₹500</SelectItem>
                    <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                    <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                    <SelectItem value="over-5000">Over ₹5,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filter Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {categoryFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categoriesData?.content?.find(c => c.id.toString() === categoryFilter)?.categoryName}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setCategoryFilter("all")}
                    />
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setStatusFilter("all")}
                    />
                  </Badge>
                )}
                {dosageFormFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Form: {dosageFormFilter}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setDosageFormFilter("all")}
                    />
                  </Badge>
                )}
                {priceRangeFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Price: {priceRangeFilter.split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setPriceRangeFilter("all")}
                    />
                  </Badge>
                )}
              </div>
            )}
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
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm truncate max-w-[150px] sm:max-w-none">
                                  {product.productName}
                                </span>
                                {/* Match type badges */}
                                {product.matchType?.includes("barcode") && (
                                  <Badge variant="secondary" className="text-xs shrink-0">
                                    📱 Barcode
                                  </Badge>
                                )}
                                {product.matchType?.includes("sku") && (
                                  <Badge variant="secondary" className="text-xs shrink-0">
                                    🏷️ Code
                                  </Badge>
                                )}
                                {product.matchType?.includes("generic") && (
                                  <Badge variant="default" className="text-xs shrink-0">
                                    🧬 Generic
                                  </Badge>
                                )}
                                {product.matchType?.includes("category") && (
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    📁 Category
                                  </Badge>
                                )}
                                {product.matchType?.includes("manufacturer") && (
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    🏭 Mfg
                                  </Badge>
                                )}
                                {product.matchType?.includes("strength") && (
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    💊 Strength
                                  </Badge>
                                )}
                                {product.matchType?.includes("fuzzy") && (
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    ≈ Similar
                                  </Badge>
                                )}
                                {product.matchType?.includes("exact") && (
                                  <Badge variant="success" className="text-xs shrink-0 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    ✓ Exact
                                  </Badge>
                                )}
                              </div>
                              {product.genericName && (
                                <span className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                                  {product.genericName}
                                </span>
                              )}
                              {/* Show search score in development */}
                              {product.searchScore && process.env.NODE_ENV === 'development' && (
                                <span className="text-xs text-muted-foreground">
                                  Score: {Math.round(product.searchScore)}
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
