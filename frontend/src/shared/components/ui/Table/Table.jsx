import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';

/**
 * Table Component
 * Reusable data table with sorting and pagination support
 */
export function Table({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No data available',
  className,
  ...props
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full overflow-auto", className)} {...props}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className="p-2 align-middle [&:has([role=checkbox])]:pr-0"
                >
                  {column.cell ? column.cell(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
