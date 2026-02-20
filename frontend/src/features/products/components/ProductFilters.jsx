/**
 * Product Filters Component
 * Filter controls for product list
 */

import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useActiveCategories } from "../hooks";
import { PRODUCT_TYPE_LABELS, ALL_PRODUCT_TYPES } from "@/constants";

/**
 * ProductFilters component
 */
const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const { data: categories = [] } = useActiveCategories();

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (value) => {
    onFilterChange({
      ...filters,
      categoryId: value === "all" ? undefined : value,
    });
  };

  const handleStatusChange = (value) => {
    onFilterChange({
      ...filters,
      status: value === "all" ? undefined : value,
    });
  };

  const handleProductTypeChange = (value) => {
    onFilterChange({
      ...filters,
      productType: value === "all" ? undefined : value,
    });
  };

  const activeFiltersCount = [
    filters.search,
    filters.categoryId,
    filters.status,
    filters.productType,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={filters.categoryId || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Product Type Filter */}
        <Select
          value={filters.productType || "all"}
          onValueChange={handleProductTypeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Product Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {ALL_PRODUCT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {PRODUCT_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
