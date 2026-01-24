/**
 * User View Page
 * Display detailed information about a user
 */

import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building,
  Calendar,
  User,
} from "lucide-react";
import { ROUTES } from "@/config";
import { useUser } from "@/features/users";
import { PageHeader, PageLoader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROLE_LABELS } from "@/constants";

const UserViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: user, isLoading } = useUser(id);

  if (isLoading) {
    return <PageLoader message="Loading user details..." />;
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">User not found</h2>
          <Button onClick={() => navigate(ROUTES.USERS.LIST)} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="User Details"
        description={`View details for ${user.fullName}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(ROUTES.USERS.LIST)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
          <Button onClick={() => navigate(ROUTES.USERS.EDIT(id))}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Full Name
                </p>
                <p className="text-base">{user.fullName}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Username
                </p>
                <p className="text-base">@{user.username}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{user.email || "-"}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </p>
                <p className="text-base">{user.phoneNumber || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Role
                </p>
                <Badge className="mt-1">
                  {ROLE_LABELS[user.role] || user.role}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Branch
                </p>
                <p className="text-base">
                  {user.branchName || "All Branches"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Employee Code
                </p>
                <p className="text-base">{user.employeeCode || "-"}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={user.isActive ? "default" : "secondary"}
                  className="mt-1"
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions & Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions & Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Discount Limit
                </p>
                <p className="text-base">
                  {user.discountLimit ? `${user.discountLimit}%` : "No limit"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Credit Transaction Limit
                </p>
                <p className="text-base">
                  {user.creditTransactionLimit
                    ? `Rs. ${parseFloat(
                        user.creditTransactionLimit
                      ).toLocaleString()}`
                    : "No limit"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Created At
                </p>
                <p className="text-base">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </p>
                <p className="text-base">
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserViewPage;
