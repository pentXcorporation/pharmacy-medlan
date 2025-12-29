/**
 * POS Product Search Component
 * Search and add products to cart
 */

import { useState, useRef, useEffect } from "react";
import { Search, Barcode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { usePOSStore } from "../store";

const POSProductSearch = ({ products = [], isLoading }) => {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const addItem = usePOSStore((state) => state.addItem);

  // Filter products based on search
  const filteredProducts =
    search.length >= 2
      ? products
          .filter(
            (p) =>
              p.name?.toLowerCase().includes(search.toLowerCase()) ||
              p.sku?.toLowerCase().includes(search.toLowerCase()) ||
              p.barcode?.includes(search)
          )
          .slice(0, 10)
      : [];

  // Handle product selection
  const handleSelect = (product) => {
    addItem(product);
    setSearch("");
    setShowResults(false);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredProducts.length === 1) {
      handleSelect(filteredProducts[0]);
    }
    if (e.key === "Escape") {
      setShowResults(false);
    }
  };

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

      {/* Search Results */}
      {showResults && filteredProducts.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-[300px] sm:max-h-[400px] overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-muted flex items-center justify-between border-b last:border-0 gap-2"
              onClick={() => handleSelect(product)}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">
                  {product.name}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {product.sku} {product.barcode && `• ${product.barcode}`}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm sm:text-base">
                  {formatCurrency(product.sellingPrice)}
                </p>
                <Badge
                  variant={
                    product.stockQuantity > 10
                      ? "default"
                      : product.stockQuantity > 0
                      ? "warning"
                      : "destructive"
                  }
                  className="mt-1 text-xs"
                >
                  {product.stockQuantity}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults &&
        search.length >= 2 &&
        filteredProducts.length === 0 &&
        !isLoading && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg p-4 text-center text-muted-foreground">
            No products found
          </div>
        )}
    </div>
  );
};

export default POSProductSearch;
