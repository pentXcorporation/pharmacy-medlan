/**
 * Branch Form Page
 * Create or edit a branch
 */

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";

import { ROUTES } from "@/config/routes.config";
import { Button } from "@/components/ui/button";
import { PageHeader, LoadingSpinner } from "@/components/common";
import {
  useBranch,
  useCreateBranch,
  useUpdateBranch,
  BranchForm,
} from "@/features/branches";

const BranchFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Queries
  const { data: branch, isLoading: isBranchLoading } = useBranch(id);
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();

  const isLoading = isEditing && isBranchLoading;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Handle form submission
  const handleSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate(
        { id, data },
        { onSuccess: () => navigate(ROUTES.BRANCHES.ROOT) }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => navigate(ROUTES.BRANCHES.ROOT),
      });
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.BRANCHES.ROOT);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Branch" : "Create Branch"}
        description={
          isEditing
            ? "Update branch information"
            : "Add a new pharmacy branch location"
        }
        icon={Building2}
        actions={
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Branches
          </Button>
        }
      />

      <div className="max-w-3xl">
        <BranchForm
          branch={branch}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default BranchFormPage;
