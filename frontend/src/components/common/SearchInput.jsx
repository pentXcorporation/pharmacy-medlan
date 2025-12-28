/**
 * SearchInput Component
 * Search input with debouncing and clear functionality
 */

import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * SearchInput component with debouncing
 */
const SearchInput = ({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
  isLoading = false,
  autoFocus = false,
  className,
  inputClassName,
  size = 'default',
  showClear = true,
  ...props
}) => {
  // Internal state for uncontrolled usage
  const [internalValue, setInternalValue] = useState('');
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const debouncedValue = useDebounce(value, debounceMs);

  // Trigger search on debounced value change
  useEffect(() => {
    onSearch?.(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (controlledValue !== undefined) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleClear = () => {
    if (controlledValue !== undefined) {
      onChange?.('');
    } else {
      setInternalValue('');
      onChange?.('');
    }
  };

  const sizeClasses = {
    sm: 'h-8 text-sm',
    default: 'h-10',
    lg: 'h-12 text-lg',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Search Icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      
      {/* Input */}
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'pl-9',
          showClear && value && 'pr-9',
          sizeClasses[size],
          inputClassName
        )}
        {...props}
      />

      {/* Loading/Clear Button */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
        ) : (
          showClear && value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )
        )}
      </div>
    </div>
  );
};

/**
 * CommandSearch - Search with command palette style
 */
export const CommandSearch = ({
  placeholder = 'Type a command or search...',
  shortcutKey = 'K',
  ...props
}) => (
  <SearchInput
    placeholder={placeholder}
    className="w-full max-w-md"
    {...props}
  />
);

export default SearchInput;
