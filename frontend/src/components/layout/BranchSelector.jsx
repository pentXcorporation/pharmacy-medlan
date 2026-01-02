/**
 * Branch Selector Component
 * Dropdown for switching between branches (for authorized roles)
 */

import { Building2, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBranch } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

/**
 * Branch Selector dropdown component
 */
const BranchSelector = () => {
  const [open, setOpen] = useState(false);
  const {
    selectedBranch,
    branches,
    isLoading,
    canSwitchBranch,
    changeBranch,
    formatBranchName,
  } = useBranch();

  // Show loading state
  if (isLoading && branches.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md bg-muted">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Show static display only if user can't switch branches AND there's only one branch
  if (!canSwitchBranch && branches.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md bg-muted">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">
          {selectedBranch ? formatBranchName(selectedBranch) : "No Branch"}
        </span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between gap-2 min-w-[150px] max-w-[200px]"
          disabled={isLoading}
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {selectedBranch
              ? formatBranchName(selectedBranch)
              : "Select branch..."}
          </span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandList>
            <CommandEmpty>No branch found.</CommandEmpty>
            <CommandGroup>
              {branches.map((branch) => (
                <CommandItem
                  key={branch.id}
                  value={formatBranchName(branch)}
                  onSelect={() => {
                    changeBranch(branch);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedBranch?.id === branch.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{formatBranchName(branch)}</span>
                    {branch.location && (
                      <span className="text-xs text-muted-foreground">
                        {branch.location}
                      </span>
                    )}
                  </div>
                  {!(branch.isActive ?? branch.active ?? true) && (
                    <span className="ml-auto text-xs text-destructive">
                      Inactive
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BranchSelector;
