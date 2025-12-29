/**
 * PageHeader Component
 * Consistent page header with title, description, and actions
 */

import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * Breadcrumb item type
 * @typedef {Object} BreadcrumbItem
 * @property {string} label - Display label
 * @property {string} href - Link path
 */

/**
 * Breadcrumbs component using shadcn breadcrumb
 */
const Breadcrumbs = ({ items = [] }) => {
  if (items.length === 0) return null;

  return (
    <Breadcrumb className="mb-2">
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={item.href || index}>
            {item.href ? (
              <>
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
                {index < items.length - 1 && <BreadcrumbSeparator />}
              </>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

/**
 * PageHeader component
 */
const PageHeader = ({
  title,
  description,
  breadcrumbs = [],
  actions,
  backHref,
  showBack = false,
  className,
  children,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backHref) {
      navigate(backHref);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn("mb-4 sm:mb-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

      {/* Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Back Button */}
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          )}

          {/* Title & Description */}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate">
              {title}
            </h1>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Additional Content */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PageHeader;
