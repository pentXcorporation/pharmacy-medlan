/**
 * User Form Page
 * Create or edit a user
 */

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useUser,
  useCreateUser,
  useUpdateUser,
  UserForm,
} from "@/features/users";
import { useBranches } from "@/features/branches";
import { PageHeader, PageLoader } from "@/components/common";
import { Button } from "@/components/ui/button";

/**
 * UserFormPage component
 */
const UserFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Fetch user if editing
  const { data: user, isLoading } = useUser(id);

  // Fetch branches for selection
  const { data: branchesData } = useBranches({ isActive: true, size: 1000 });
  const branches = branchesData?.content || [];

  // Mutations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const handleSubmit = (data) => {
    if (isEditing) {
      updateUser.mutate(
        { id, data },
        {
          onSuccess: () => navigate(ROUTES.USERS.LIST),
        }
      );
    } else {
      createUser.mutate(data, {
        onSuccess: () => navigate(ROUTES.USERS.LIST),
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isEditing && isLoading) {
    return <PageLoader message="Loading user..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit User" : "Add New User"}
        description={
          isEditing
            ? `Editing: ${user?.firstName} ${user?.lastName}`
            : "Create a new user account"
        }
        actions={
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="max-w-4xl">
        <UserForm
          user={user}
          branches={branches}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createUser.isPending || updateUser.isPending}
        />
      </div>
    </div>
  );
};

export default UserFormPage;
