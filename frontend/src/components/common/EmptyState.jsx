/**
 * EmptyState Component
 * Placeholder for empty data states with icon and call-to-action
 */

import { Package, Search, FileX, AlertCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * Default icons for common empty states
 */
const EMPTY_ICONS = {
  default: Package,
  search: Search,
  noData: FileX,
  error: AlertCircle,
};

/**
 * EmptyState component
 */
const EmptyState = ({
  icon: Icon,
  iconType = 'default',
  title = 'No data found',
  description,
  actionLabel,
  actionIcon: ActionIcon = Plus,
  onAction,
  actionHref,
  className,
  size = 'default',
}) => {
  const IconComponent = Icon || EMPTY_ICONS[iconType] || EMPTY_ICONS.default;

  const sizeClasses = {
    sm: 'py-8',
    default: 'py-16',
    lg: 'py-24',
  };

  const iconSizes = {
    sm: 'h-10 w-10',
    default: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size],
        className
      )}
    >
      <div className="rounded-full bg-muted p-4 mb-4">
        <IconComponent
          className={cn('text-muted-foreground', iconSizes[size])}
        />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {(onAction || actionHref) && actionLabel && (
        <Button onClick={onAction} asChild={!!actionHref}>
          {actionHref ? (
            <a href={actionHref}>
              <ActionIcon className="h-4 w-4 mr-2" />
              {actionLabel}
            </a>
          ) : (
            <>
              <ActionIcon className="h-4 w-4 mr-2" />
              {actionLabel}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

/**
 * SearchEmptyState - Specialized empty state for search results
 */
export const SearchEmptyState = ({
  searchTerm,
  onClear,
  suggestions = [],
}) => (
  <EmptyState
    iconType="search"
    title="No results found"
    description={
      searchTerm
        ? `No results found for "${searchTerm}". Try adjusting your search.`
        : 'Try searching for something.'
    }
    actionLabel={searchTerm && onClear ? 'Clear search' : undefined}
    onAction={onClear}
    actionIcon={Search}
  />
);

/**
 * ErrorEmptyState - Specialized empty state for errors
 */
export const ErrorEmptyState = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading data. Please try again.',
  onRetry,
}) => (
  <EmptyState
    iconType="error"
    title={title}
    description={description}
    actionLabel={onRetry ? 'Try again' : undefined}
    onAction={onRetry}
  />
);

export default EmptyState;
