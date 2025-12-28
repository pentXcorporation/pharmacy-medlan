/**
 * LoadingSpinner Component
 * Animated loading indicator with different sizes and variants
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * LoadingSpinner component
 */
const LoadingSpinner = ({
  size = 'default',
  className,
  label = 'Loading...',
  showLabel = false,
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const spinner = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        fullScreen && 'min-h-screen',
        className
      )}
    >
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {showLabel && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

/**
 * PageLoader - Full page loading state
 */
export const PageLoader = ({ message = 'Loading...' }) => (
  <LoadingSpinner
    size="lg"
    showLabel
    label={message}
    className="min-h-[400px]"
  />
);

/**
 * ButtonSpinner - Inline spinner for buttons
 */
export const ButtonSpinner = ({ className }) => (
  <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
);

/**
 * CardLoader - Loading state for cards
 */
export const CardLoader = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="default" showLabel />
  </div>
);

export default LoadingSpinner;
