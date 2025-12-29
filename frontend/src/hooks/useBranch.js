/**
 * Branch Hook
 * Provides branch selection and management utilities
 */

import { useCallback, useMemo } from "react";
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
    onSuccess: (data) => {
      const branchList = data?.content || data || [];
      setBranches(branchList);

      // Auto-select user's branch or first branch
      if (!selectedBranch && branchList.length > 0) {
        const userBranch = branchList.find((b) => b.id === user?.branchId);
        setSelectedBranch(userBranch || branchList[0]);
      }
    },
  });

  /**
   * Check if user can switch branches
   */
  const canSwitchBranch = useMemo(() => {
    if (!user?.role) return false;
    // Only super admin and owner can switch between all branches
    return [ROLES.SUPER_ADMIN, ROLES.OWNER].includes(user.role);
  }, [user?.role]);

  /**
   * Get branches available to the user
   */
  const availableBranches = useMemo(() => {
    if (!user) return [];

    // Super admin and owner can see all branches
    if ([ROLES.SUPER_ADMIN, ROLES.OWNER].includes(user.role)) {
      return branches;
    }

    // Others can only see their assigned branch
    return branches.filter((b) => b.id === user.branchId);
  }, [user, branches]);

  /**
   * Handle branch change
   * @param {Object} branch - Branch to select
   */
  const changeBranch = useCallback(
    (branch) => {
      if (!canSwitchBranch && branch.id !== user?.branchId) {
        console.warn("User does not have permission to switch branches");
        return;
      }
      setSelectedBranch(branch);
    },
    [canSwitchBranch, user?.branchId, setSelectedBranch]
  );

  /**
   * Get current branch ID (for API requests)
   */
  const currentBranchId = useMemo(() => {
    return getSelectedBranchId() || user?.branchId;
  }, [selectedBranch, user?.branchId, getSelectedBranchId]);

  /**
   * Check if branch is active
   * @param {string|number} branchId - Branch ID to check
   * @returns {boolean}
   */
  const isBranchActive = useCallback(
    (branchId) => {
      const branch = branches.find((b) => b.id === branchId);
      return branch?.active ?? false;
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
    return branch.name || `Branch ${branch.id}`;
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
