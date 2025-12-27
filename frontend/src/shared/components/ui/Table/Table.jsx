import { cn } from '@/shared/utils';
import styles from './Table.module.css';

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
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn(styles.tableWrapper, className)} {...props}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={styles.th}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.tr}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={styles.td}>
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
