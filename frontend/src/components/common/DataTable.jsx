/**
 * DataTable Component
 * Reusable data table with sorting, filtering, pagination using shadcn components
 */

import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

/**
 * Sortable header component
 */
const SortableHeader = ({
  column,
  sortKey,
  sortDirection,
  onSort,
  children,
}) => {
  const isActive = column === sortKey;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => onSort(column)}
    >
      <span>{children}</span>
      {isActive && sortDirection === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : isActive && sortDirection === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  );
};

/**
 * Loading skeleton for table
 */
const TableSkeleton = ({ columns, rows = 5 }) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={colIndex}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

/**
 * Pagination controls using shadcn Pagination
 */
const DataTablePagination = ({
  currentPage,
  pageCount,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < pageCount - 1;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 py-4">
      {/* Results count - hidden on very small screens */}
      <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <span>
          {Math.min(currentPage * pageSize + 1, totalItems)}-
          {Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-4">
        {/* Rows per page - hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows:</span>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[65px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page indicator */}
        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
          Page {currentPage + 1}/{pageCount || 1}
        </span>

        {/* Navigation buttons using shadcn Pagination */}
        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(0)}
                disabled={!canGoPrevious}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(pageCount - 1)}
                disabled={!canGoNext}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

/**
 * Get nested value from object using accessor key
 */
const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  if (typeof path === "function") return path(obj);
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

/**
 * Main DataTable component
 */
const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  isFetching = false,
  searchPlaceholder = "Search...",
  searchColumn,
  showSearch = false,
  showPagination = true,
  pageSize: defaultPageSize = 10,
  onRowClick,
  emptyMessage = "No data available.",
  className,
  // Server-side pagination props
  pagination: externalPagination,
  onPaginationChange,
  // Server-side sorting props
  sorting: externalSorting,
  onSortingChange,
  // Manual pagination/sorting (server-side mode)
  manualPagination = !!onPaginationChange,
  manualSorting = !!onSortingChange,
}) => {
  // Internal state for client-side operations
  const [internalSorting, setInternalSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [internalPageIndex, setInternalPageIndex] = useState(0);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
  const [rowSelection, setRowSelection] = useState({});

  // Use external state if provided, otherwise use internal state
  const sorting = externalSorting ?? internalSorting;
  const setSorting = onSortingChange ?? setInternalSorting;

  const pageIndex = externalPagination?.pageIndex ?? internalPageIndex;
  const pageSize = externalPagination?.pageSize ?? internalPageSize;

  // Handle sorting
  const handleSort = (columnId) => {
    const currentSort = sorting.find((s) => s.id === columnId);
    let newSorting;

    if (!currentSort) {
      newSorting = [{ id: columnId, desc: false }];
    } else if (!currentSort.desc) {
      newSorting = [{ id: columnId, desc: true }];
    } else {
      newSorting = [];
    }

    setSorting(newSorting);
  };

  // Handle page change
  const handlePageChange = (newPageIndex) => {
    if (onPaginationChange) {
      onPaginationChange({ pageIndex: newPageIndex, pageSize });
    } else {
      setInternalPageIndex(newPageIndex);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    if (onPaginationChange) {
      onPaginationChange({ pageIndex: 0, pageSize: newPageSize });
    } else {
      setInternalPageSize(newPageSize);
      setInternalPageIndex(0);
    }
  };

  // Process data (filter, sort, paginate) for client-side mode
  const processedData = useMemo(() => {
    // Ensure data is an array
    const safeData = Array.isArray(data) ? data : [];
    let result = [...safeData];

    // Client-side filtering
    if (!manualPagination && globalFilter) {
      result = result.filter((row) =>
        columns.some((col) => {
          const value = getNestedValue(row, col.accessorKey || col.id);
          return String(value ?? "")
            .toLowerCase()
            .includes(globalFilter.toLowerCase());
        })
      );
    }

    // Client-side sorting
    if (!manualSorting && sorting.length > 0) {
      const { id, desc } = sorting[0];
      result.sort((a, b) => {
        const col = columns.find((c) => (c.accessorKey || c.id) === id);
        const aVal = col?.accessorFn
          ? col.accessorFn(a)
          : getNestedValue(a, col?.accessorKey);
        const bVal = col?.accessorFn
          ? col.accessorFn(b)
          : getNestedValue(b, col?.accessorKey);

        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return desc ? 1 : -1;
        if (aVal > bVal) return desc ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [data, globalFilter, sorting, columns, manualPagination, manualSorting]);

  // Paginate data for client-side mode
  const paginatedData = useMemo(() => {
    if (manualPagination) return Array.isArray(data) ? data : [];
    const start = pageIndex * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, data, pageIndex, pageSize, manualPagination]);

  // Calculate pagination info
  const totalItems = externalPagination?.total ?? processedData.length;
  const pageCount =
    externalPagination?.pageCount ?? Math.ceil(totalItems / pageSize);

  // Get current sort info
  const sortKey = sorting[0]?.id;
  const sortDirection = sorting[0]?.desc ? "desc" : "asc";

  // Mock table object for TanStack Table API compatibility
  const mockTable = useMemo(
    () => ({
      getIsAllPageRowsSelected: () => {
        if (paginatedData.length === 0) return false;
        return paginatedData.every((row) => rowSelection[row.id]);
      },
      getIsSomePageRowsSelected: () => {
        if (paginatedData.length === 0) return false;
        const selectedCount = paginatedData.filter(
          (row) => rowSelection[row.id]
        ).length;
        return selectedCount > 0 && selectedCount < paginatedData.length;
      },
      toggleAllPageRowsSelected: (value) => {
        if (value) {
          const newSelection = { ...rowSelection };
          paginatedData.forEach((row) => {
            if (row.id) newSelection[row.id] = true;
          });
          setRowSelection(newSelection);
        } else {
          const newSelection = { ...rowSelection };
          paginatedData.forEach((row) => {
            if (row.id) delete newSelection[row.id];
          });
          setRowSelection(newSelection);
        }
      },
      getSelectedRowModel: () => ({
        rows: paginatedData
          .filter((row) => rowSelection[row.id])
          .map((row) => ({
            original: row,
            id: row.id,
          })),
      }),
    }),
    [paginatedData, rowSelection]
  );

  // Mock row object creator for TanStack Table API compatibility
  const createMockRow = (row) => ({
    original: row,
    getValue: (key) => getNestedValue(row, key),
    getIsSelected: () => !!rowSelection[row.id],
    toggleSelected: (value) => {
      setRowSelection((prev) => {
        const newSelection = { ...prev };
        if (value ?? !prev[row.id]) {
          newSelection[row.id] = true;
        } else {
          delete newSelection[row.id];
        }
        return newSelection;
      });
    },
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      {showSearch && (
        <div className="flex items-center gap-4">
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                const columnId = column.accessorKey || column.id;
                const canSort = column.enableSorting !== false;

                return (
                  <TableHead
                    key={columnId}
                    className={cn("whitespace-nowrap", column.meta?.className)}
                    style={{
                      width: column.size ? `${column.size}px` : undefined,
                      maxWidth: column.size ? `${column.size}px` : undefined,
                    }}
                  >
                    {canSort && typeof column.header === "string" ? (
                      <SortableHeader
                        column={columnId}
                        sortKey={sortKey}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        {column.header}
                      </SortableHeader>
                    ) : typeof column.header === "function" ? (
                      column.header({ table: mockTable, column })
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton columns={columns.length} />
          ) : (
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => {
                  const mockRow = createMockRow(row);
                  return (
                    <TableRow
                      key={row.id ?? rowIndex}
                      onClick={() => onRowClick?.(row)}
                      className={cn(
                        onRowClick && "cursor-pointer hover:bg-accent/50",
                        isFetching && "opacity-50",
                        rowSelection[row.id] && "bg-muted/50"
                      )}
                    >
                      {columns.map((column) => {
                        const columnId = column.accessorKey || column.id;
                        const value = column.accessorFn
                          ? column.accessorFn(row)
                          : getNestedValue(row, column.accessorKey);

                        return (
                          <TableCell
                            key={columnId}
                            className={column.meta?.className}
                          >
                            {column.cell
                              ? column.cell({
                                  row: mockRow,
                                  getValue: () => value,
                                  table: mockTable,
                                })
                              : value ?? "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <DataTablePagination
          currentPage={pageIndex}
          pageCount={pageCount}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

// Export sortable header for use in column definitions
DataTable.SortableHeader = SortableHeader;

export default DataTable;
