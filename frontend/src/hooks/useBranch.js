/**
 * Branch Hook
 * Provides branch selection and management utilities
 */

import { useCallback, useMemo, useEffect } from "react";
import { useBranchStore, useAuthStore } from "@/store";
import { useApiQuery } from "./useApi";
import { API_ENDPOINTS } from "@/config";
import { ROLES } from "@/constants";

/**
 * Hook for branch operations
 * @returns {Object} Branch utilities and state
 */
export const useBranch = () => {
  const { user } = useAuthStore();
  const {
    selectedBranch,
    branches,
    isLoading,
    setSelectedBranch,
    setBranches,
    setLoading,
    getSelectedBranchId,
  } = useBranchStore();

  /**
   * Fetch branches from API
   */
  const branchesQuery = useApiQuery("branches", API_ENDPOINTS.BRANCHES.ALL, {
    enabled: !!user,
  });

  /**
   * Process fetched branches and auto-select if needed
   */
  useEffect(() => {
    if (branchesQuery.data) {
      const branchList = branchesQuery.data?.data?.content || branchesQuery.data?.data || branchesQuery.data?.content || branchesQuery.data || [];
      
      if (Array.isArray(branchList) && branchList.length > 0) {
        setBranches(branchList);

        // Auto-select first active branch if none is selected
        if (!selectedBranch) {
          const firstActiveBranch = branchList.find((b) => (b.isActive !== false && b.active !== false)) || branchList[0];
          setSelectedBranch(firstActiveBranch);
        }
      }
    }
  }, [branchesQuery.data, selectedBranch, setBranches, setSelectedBranch]);

  /**
   * Check if user can switch branches
   */
  const canSwitchBranch = useMemo(() => {
    if (!user?.role) return false;
    // Allow super admin, admin, owner, and branch managers to switch branches
    // Also allow if there are multiple branches available
    const privilegedRoles = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OWNER, ROLES.BRANCH_MANAGER];
    return privilegedRoles.includes(user.role) || branches.length > 1;
  }, [user?.role, branches.length]);

  /**
   * Get branches available to the user
   */
  const availableBranches = useMemo(() => {
    if (!user) return [];

    // Super admin and admin can see all branches
    if ([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OWNER].includes(user.role)) {
      return branches;
    }

    // For other users, show all active branches
    // (Branch-specific filtering should be done at the backend level)
    return branches.filter((b) => (b.isActive !== false && b.active !== false));
  }, [user, branches]);

  /**
   * Handle branch change
   * @param {Object} branch - Branch to select
   */
  const changeBranch = useCallback(
    (branch) => {
      if (!branch) {
        console.warn("Invalid branch provided");
        return;
      }
      setSelectedBranch(branch);
    },
    [setSelectedBranch]
  );

  /**
   * Get current branch ID (for API requests)
   */
  const currentBranchId = useMemo(() => {
    return getSelectedBranchId();
  }, [selectedBranch, getSelectedBranchId]);

  /**
   * Check if branch is active
   * @param {string|number} branchId - Branch ID to check
   * @returns {boolean}
   */
  const isBranchActive = useCallback(
    (branchId) => {
      const branch = branches.find((b) => b.id === branchId);
      return branch?.isActive ?? branch?.active ?? false;
    },
    [branches]
  );

  /**
   * Get branch by ID
   * @param {string|number} branchId - Branch ID
   * @returns {Object|null}
   */
  const getBranchById = useCallback(
    (branchId) => {
      return branches.find((b) => b.id === branchId) || null;
    },
    [branches]
  );

  /**
   * Format branch for display
   * @param {Object} branch - Branch object
   * @returns {string}
   */
  const formatBranchName = useCallback((branch) => {
    if (!branch) return "";
    return branch.branchName || branch.name || `Branch ${branch.id}`;
  }, []);

  return {
    // State
    selectedBranch,
    branches: availableBranches,
    allBranches: branches,
    isLoading: isLoading || branchesQuery.isLoading,
    currentBranchId,

    // Actions
    changeBranch,
    refetch: branchesQuery.refetch,

    // Checks
    canSwitchBranch,
    isBranchActive,

    // Helpers
    getBranchById,
    formatBranchName,
  };
};

export default useBranch;
