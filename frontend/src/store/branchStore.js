/**
 * Branch Store - Zustand store for selected branch state
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  selectedBranch: null,
  branches: [],
  isLoading: false,
  error: null,
};

export const useBranchStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Set selected branch
      setSelectedBranch: (branch) => {
        set({ selectedBranch: branch });
      },

      // Set branches list
      setBranches: (branches) => {
        set({ branches });
      },

      // Set loading state
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Set error
      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Get selected branch ID
      getSelectedBranchId: () => {
        const { selectedBranch } = get();
        return selectedBranch?.id;
      },

      // Get selected branch name
      getSelectedBranchName: () => {
        const { selectedBranch } = get();
        return selectedBranch?.name || 'Select Branch';
      },

      // Clear selection
      clearSelection: () => {
        set({ selectedBranch: null });
      },

      // Reset store
      reset: () => {
        set(initialState);
      },

      // Check if branch is selected
      hasBranch: () => {
        const { selectedBranch } = get();
        return selectedBranch !== null;
      },
    }),
    {
      name: 'branch-storage',
      partialize: (state) => ({
        selectedBranch: state.selectedBranch,
      }),
    }
  )
);
