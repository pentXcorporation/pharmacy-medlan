/**
 * POS Product Search Component
 * Search and add products to cart with advanced search capabilities
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Barcode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { useDebounce } from "@/hooks/useDebounce";
import { usePOSStore } from "../store";
import { toast } from "sonner";

/**
 * Advanced product search algorithm
 * Supports: exact barcode match, name search, generic name search, SKU search, partial matches
 */
const searchProducts = (products, searchTerm) => {
  if (!searchTerm || searchTerm.trim().length === 0) return [];

  const query = searchTerm.trim().toLowerCase();
  const results = [];

  products.forEach((product) => {
    // Handle various possible field names from API
    const name = (product.name || product.productName || "").toLowerCase();
    const sku = (product.sku || product.productCode || "").toLowerCase();
    const barcode = (product.barcode || "").toLowerCase();
    const genericName = (product.genericName || "").toLowerCase();
    const manufacturer = (product.manufacturer || "").toLowerCase();
    const description = (product.description || "").toLowerCase();

    let score = 0;
    let matchType = "";

    // Priority 1: Exact barcode match (instant add)
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
    // Priority 10: Description contains query
    else if (description && description.includes(query)) {
      score = 250;
      matchType = "description";
    }
    // Priority 11: SKU contains query
    else if (sku && sku.includes(query)) {
      score = 200;
      matchType = "sku-partial";
    }
    // Priority 12: Manufacturer match
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
      // Boost score for products with good stock
      const stock = product.quantityAvailable || product.stockQuantity || product.quantity || 0;
      if (stock > 0) {
        score += 10;
      }

      results.push({
        ...product,
        searchScore: score,
        matchType,
      });
    }
  });

  // Sort by score (highest first) and return top 10
  return results
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, 10);
};

/**
 * Basic fuzzy matching - checks if strings are similar within 1-2 character differences
 */
const isCloseMatch = (str, query) => {
  // Simple check: if query is found with wildcards
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

const POSProductSearch = ({ products = [], isLoading }) => {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const addItem = usePOSStore((state) => state.addItem);

  // Debounce search for performance (except for barcodes which should be instant)
  const debouncedSearch = useDebounce(search, search.length > 10 ? 0 : 200);

  // Filter products using advanced search
  const filteredProducts = useMemo(() => {
    const results = searchProducts(products, debouncedSearch);
    // Debug logging (remove in production)
    if (debouncedSearch && results.length === 0 && products.length > 0) {
      console.log("Search Debug:", {
        query: debouncedSearch,
        totalProducts: products.length,
        sampleProduct: products[0],
        results: results.length
      });
    }
    return results;
  }, [products, debouncedSearch]);

  // Handle product selection
  const handleSelect = (product) => {
    // Check if product has stock
    const stockQty = product.quantityAvailable || product.stockQuantity || product.quantity || 0;
    if (stockQty <= 0) {
      toast.error("Out of Stock", {
        description: `${product.name || product.productName} has no available stock.`,
      });
      return;
    }

    addItem(product);
    setSearch("");
    setShowResults(false);
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  // Auto-select for exact barcode match
  useEffect(() => {
    if (filteredProducts.length > 0 && 
        filteredProducts[0].matchType === "barcode-exact" &&
        search.length > 8) { // Typical barcode length
      handleSelect(filteredProducts[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts, search]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredProducts.length > 0) {
        handleSelect(filteredProducts[selectedIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        Math.min(prev + 1, filteredProducts.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Escape") {
      setShowResults(false);
      setSearch("");
      setSelectedIndex(0);
    }
  };

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="pl-9 sm:pl-10 pr-12 sm:pr-20 h-10 sm:h-12 text-sm sm:text-lg"
          autoFocus
          disabled={isLoading}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-8 w-8"
          title="Scan barcode"
        >
          <Barcode className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Loading indicator */}
      {showResults && isLoading && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg p-4 text-center text-muted-foreground">
          Loading products...
        </div>
      )}

      {/* Search Results */}
      {showResults && filteredProducts.length > 0 && !isLoading && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-[300px] sm:max-h-[400px] overflow-y-auto">
          {filteredProducts.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-muted flex items-center justify-between border-b last:border-0 gap-2 ${
                index === selectedIndex ? "bg-muted" : ""
              }`}
              onClick={() => handleSelect(product)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm sm:text-base truncate">
                    {product.name || product.productName}
                  </p>
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
                  {product.isPrescriptionRequired && (
                    <Badge variant="destructive" className="text-xs">
                      ℞ Rx
                    </Badge>
                  )}
                  {product.isNarcotic && (
                    <Badge variant="destructive" className="text-xs">
                      Narcotic
                    </Badge>
                  )}
                  {product.isRefrigerated && (
                    <Badge variant="default" className="text-xs">
                      ❄️ Cold
                    </Badge>
                  )}
                </div>
                <div className="space-y-0.5 mt-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {product.sku || product.productCode} {(product.barcode) && `• ${product.barcode}`}
                  </p>
                  {product.genericName && (
                    <p className="text-xs text-muted-foreground truncate">
                      <span className="font-semibold">Generic:</span> {product.genericName}
                    </p>
                  )}
                  {(product.strength || product.dosageForm) && (
                    <p className="text-xs text-muted-foreground truncate">
                      {product.strength} {product.dosageForm && `• ${product.dosageForm}`}
                    </p>
                  )}
                  {product.manufacturer && (
                    <p className="text-xs text-muted-foreground truncate">
                      <span className="font-semibold">Mfr:</span> {product.manufacturer}
                    </p>
                  )}
                  {product.drugSchedule && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Schedule:</span> {product.drugSchedule}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm sm:text-base">
                  {formatCurrency(product.sellingPrice || product.price)}
                </p>
                {product.mrp && (
                  <p className="text-xs text-muted-foreground">
                    MRP: {formatCurrency(product.mrp)}
                  </p>
                )}
                <Badge
                  variant={
                    (product.quantityAvailable || product.stockQuantity || product.quantity || 0) > 10
                      ? "default"
                      : (product.quantityAvailable || product.stockQuantity || product.quantity || 0) > 0
                      ? "warning"
                      : "destructive"
                  }
                  className="mt-1 text-xs"
                >
                  Stock: {product.quantityAvailable || product.stockQuantity || product.quantity || 0}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults &&
        search.length >= 1 &&
        filteredProducts.length === 0 &&
        !isLoading && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg p-4 text-center text-muted-foreground">
            No products found for "{search}"
          </div>
        )}
    </div>
  );
};

export default POSProductSearch;
