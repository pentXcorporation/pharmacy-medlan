/**
 * Settings Page
 * Tabbed settings interface for profile, system, and notifications
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Settings,
  User,
  Bell,
  Building2,
  Palette,
  Shield,
  Database,
  Receipt,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, ButtonSpinner } from "@/components/common";
import { useAuthStore, useBranchStore, useUiStore } from "@/store";
import {
  authService,
  userService,
  systemConfigService,
  branchService,
} from "@/services";
import { toast } from "sonner";
import { ROLE_LABELS } from "@/constants";

// Profile schema - matches UpdateUserRequest backend
const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().optional().or(z.literal("")),
});

// Password schema - matches ChangePasswordRequest backend
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuthStore();
  const { setSelectedBranch, selectedBranch: currentBranch } = useBranchStore();
  const { preferences, updatePreference } = useUiStore();
  const [isUpdating, setIsUpdating] = useState(false);

  // Determine active tab from URL
  const getTabFromPath = (pathname) => {
    if (pathname.includes("/profile")) return "profile";
    if (pathname.includes("/general")) return "profile";
    if (pathname.includes("/branch")) return "branch";
    if (pathname.includes("/tax")) return "tax";
    if (pathname.includes("/notifications")) return "notifications";
    if (pathname.includes("/preferences")) return "preferences";
    return "profile";
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  // Branch and Tax settings state
  const [branches, setBranches] = useState([]);
  const [viewBranch, setViewBranch] = useState("");
  const [branchSettings, setBranchSettings] = useState(() => {
    const saved = localStorage.getItem("branch-settings");
    return saved
      ? JSON.parse(saved)
      : {
          defaultBranch: "",
          allowTransfers: true,
          autoSync: true,
        };
  });
  const [taxSettings, setTaxSettings] = useState(() => {
    const saved = localStorage.getItem("tax-settings");
    return saved
      ? JSON.parse(saved)
      : {
          enableTax: true,
          defaultTaxRate: "0",
          taxInclusive: false,
          multipleTaxRates: false,
        };
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // Load branches
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const response = await branchService.getActive();
        // Extract data from ApiResponse wrapper (response.data.data)
        const branchData = response.data?.data || response.data?.content || [];
        setBranches(Array.isArray(branchData) ? branchData : []);
        console.log("Loaded branches:", branchData);
      } catch (error) {
        console.error("Failed to load branches:", error);
        setBranches([]);
      }
    };
    loadBranches();
  }, []);

  // Sync branch settings with currently selected branch
  useEffect(() => {
    if (currentBranch && currentBranch.id) {
      setBranchSettings((prev) => ({
        ...prev,
        defaultBranch: String(currentBranch.id),
      }));
    }
  }, [currentBranch]);

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, profileForm]);

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleProfileUpdate = async (data) => {
    setIsUpdating(true);
    try {
      const response = await userService.update(user.id, {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber || null,
        role: user.role, // Keep existing role
        isActive: user.isActive, // Keep existing status
      });

      // Update user in store
      setUser(response.data.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (data) => {
    setIsUpdating(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password changed successfully");
      passwordForm.reset();
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsUpdating(false);
    }
  };

  // Branch settings handlers
  const handleBranchSettingChange = (key, value) => {
    setBranchSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveBranchSettings = async () => {
    setIsLoadingSettings(true);
    try {
      // Save to localStorage
      localStorage.setItem("branch-settings", JSON.stringify(branchSettings));
      
      // If a default branch is selected, set it as the active branch
      if (branchSettings.defaultBranch) {
        const selectedBranchId = parseInt(branchSettings.defaultBranch);
        const branch = branches.find((b) => b.id === selectedBranchId);
        
        if (branch) {
          setSelectedBranch(branch);
          toast.success("Branch settings saved and default branch set");
        } else {
          toast.success("Branch settings saved");
        }
      } else {
        toast.success("Branch settings saved");
      }
    } catch (error) {
      console.error("Failed to save branch settings:", error);
      toast.error("Failed to save branch settings");
    } finally {
      setIsLoadingSettings(false);
    }
  };

  // Tax settings handlers
  const handleTaxSettingChange = (key, value) => {
    setTaxSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveTaxSettings = async () => {
    setIsLoadingSettings(true);
    try {
      // Save to localStorage (backend endpoint not implemented yet)
      localStorage.setItem("tax-settings", JSON.stringify(taxSettings));
      toast.success("Tax settings saved successfully");
    } catch (error) {
      console.error("Failed to save tax settings:", error);
      toast.error("Failed to save tax settings");
    } finally {
      setIsLoadingSettings(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences"
        icon={Settings}
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          // Update URL when tab changes
          const pathMap = {
            profile: "/settings",
            security: "/settings",
            branch: "/settings/branch",
            tax: "/settings/tax",
            notifications: "/settings/notifications",
            preferences: "/settings/preferences",
          };
          if (pathMap[value] && location.pathname !== pathMap[value]) {
            navigate(pathMap[value], { replace: true });
          }
        }}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6 lg:w-[700px]">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="branch" className="gap-2">
            <MapPin className="h-4 w-4" />
            Branch
          </TabsTrigger>
          <TabsTrigger value="tax" className="gap-2">
            <Receipt className="h-4 w-4" />
            Tax
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Palette className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                  className="space-y-4"
                >
                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+94 77 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <ButtonSpinner />}
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{user?.username || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">
                    {ROLE_LABELS[user?.role] || user?.role || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="font-medium">
                    {user?.branch?.branchName || "All Branches"}
                  </p>
                  {user?.branch?.branchCode && (
                    <p className="text-xs text-muted-foreground">
                      Code: {user.branch.branchCode}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee Code</p>
                  <p className="font-medium">{user?.employeeCode || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    {user?.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                  className="space-y-4 max-w-md"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Must be at least 8 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <ButtonSpinner />}
                    Change Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app to generate verification codes
                  </p>
                </div>
                <Switch disabled />
              </div>
              <p className="text-sm text-muted-foreground mt-2">Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are running low
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Expiry Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about products nearing expiry
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications for purchase order status changes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a daily summary of sales and activities
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Branch Settings Tab */}
        <TabsContent value="branch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branch Configuration</CardTitle>
              <CardDescription>
                Configure branch settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Branch</Label>
                <Select
                  value={branchSettings.defaultBranch}
                  onValueChange={(value) =>
                    handleBranchSettingChange("defaultBranch", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(branches) && branches.length > 0 ? (
                      branches.map((branch) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                          {branch.branchName || branch.name} - {branch.branchCode || branch.code}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No branches available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The default branch for operations and reporting
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Branch Transfers</p>
                  <p className="text-sm text-muted-foreground">
                    Enable inventory transfers between branches
                  </p>
                </div>
                <Switch
                  checked={branchSettings.allowTransfers}
                  onCheckedChange={(checked) =>
                    handleBranchSettingChange("allowTransfers", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Sync</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync data across branches
                  </p>
                </div>
                <Switch
                  checked={branchSettings.autoSync}
                  onCheckedChange={(checked) =>
                    handleBranchSettingChange("autoSync", checked)
                  }
                />
              </div>
              <Separator />
              <Button
                onClick={handleSaveBranchSettings}
                disabled={isLoadingSettings}
              >
                {isLoadingSettings && <ButtonSpinner />}
                Save Branch Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branch Selection</CardTitle>
              <CardDescription>
                View and manage branch information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Branch to View</Label>
                <Select
                  value={viewBranch}
                  onValueChange={setViewBranch}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(branches) && branches.length > 0 ? (
                      branches.map((branch) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                          {branch.branchName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No branches available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {viewBranch && (
                <div className="space-y-2 pt-4">
                  {branches
                    .filter((b) => String(b.id) === viewBranch)
                    .map((branch) => (
                      <div key={branch.id} className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">
                              Branch Code
                            </Label>
                            <p className="font-medium">{branch.branchCode}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Contact
                            </Label>
                            <p className="font-medium">
                              {branch.contactNumber || "N/A"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-muted-foreground">
                              Address
                            </Label>
                            <p className="font-medium">
                              {branch.address || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings Tab */}
        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>
                Configure tax rates and tax-related settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Tax</p>
                  <p className="text-sm text-muted-foreground">
                    Apply tax to sales and purchases
                  </p>
                </div>
                <Switch
                  checked={taxSettings.enableTax}
                  onCheckedChange={(checked) =>
                    handleTaxSettingChange("enableTax", checked)
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Default Tax Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={taxSettings.defaultTaxRate}
                  onChange={(e) =>
                    handleTaxSettingChange("defaultTaxRate", e.target.value)
                  }
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">
                  The default tax rate applied to transactions
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tax Inclusive Pricing</p>
                  <p className="text-sm text-muted-foreground">
                    Product prices include tax
                  </p>
                </div>
                <Switch
                  checked={taxSettings.taxInclusive}
                  onCheckedChange={(checked) =>
                    handleTaxSettingChange("taxInclusive", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Multiple Tax Rates</p>
                  <p className="text-sm text-muted-foreground">
                    Allow different tax rates for different products
                  </p>
                </div>
                <Switch
                  checked={taxSettings.multipleTaxRates}
                  onCheckedChange={(checked) =>
                    handleTaxSettingChange("multipleTaxRates", checked)
                  }
                />
              </div>
              <Separator />
              <Button
                onClick={handleSaveTaxSettings}
                disabled={isLoadingSettings}
              >
                {isLoadingSettings && <ButtonSpinner />}
                Save Tax Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
              <CardDescription>
                Additional tax configuration details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Tax Rate</span>
                  <span className="text-sm text-muted-foreground">
                    {taxSettings.defaultTaxRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tax Status</span>
                  <span
                    className={`text-sm ${
                      taxSettings.enableTax
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {taxSettings.enableTax ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pricing Model</span>
                  <span className="text-sm text-muted-foreground">
                    {taxSettings.taxInclusive
                      ? "Tax Inclusive"
                      : "Tax Exclusive"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <Select
                    value={preferences.themeMode}
                    onValueChange={(value) => {
                      updatePreference("themeMode", value);
                      toast.success("Theme updated");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <Select
                    value={preferences.colorTheme}
                    onValueChange={(value) => {
                      updatePreference("colorTheme", value);
                      toast.success("Color theme updated");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue (Default)</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="slate">Slate</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose your preferred accent color
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={preferences.dateFormat}
                    onValueChange={(value) => {
                      updatePreference("dateFormat", value);
                      toast.success("Date format updated");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={preferences.currency}
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LKR">LKR (Rs.)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Currency is fixed to LKR for this system</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>
                Adjust settings to improve accessibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">High Contrast Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => {
                    updatePreference("highContrast", checked);
                    toast.success(checked ? "High contrast enabled" : "High contrast disabled");
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reduce Motion</p>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  checked={preferences.reduceMotion}
                  onCheckedChange={(checked) => {
                    updatePreference("reduceMotion", checked);
                    toast.success(checked ? "Reduce motion enabled" : "Reduce motion disabled");
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Large Text</p>
                  <p className="text-sm text-muted-foreground">
                    Increase font size throughout the app
                  </p>
                </div>
                <Switch
                  checked={preferences.largeText}
                  onCheckedChange={(checked) => {
                    updatePreference("largeText", checked);
                    toast.success(checked ? "Large text enabled" : "Large text disabled");
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Screen Reader Support</p>
                  <p className="text-sm text-muted-foreground">
                    Enable enhanced screen reader compatibility
                  </p>
                </div>
                <Switch
                  checked={preferences.screenReader}
                  onCheckedChange={(checked) => {
                    updatePreference("screenReader", checked);
                    toast.success(checked ? "Screen reader support enabled" : "Screen reader support disabled");
                  }}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Keyboard Navigation</Label>
                <Select
                  value={preferences.keyboardNav}
                  onValueChange={(value) =>
                    updatePreference("keyboardNav", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="enhanced">Enhanced</SelectItem>
                    <SelectItem value="vim">Vim-style</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose keyboard navigation style
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table Preferences</CardTitle>
              <CardDescription>
                Default settings for data tables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label>Default Page Size</Label>
                  <Select
                    value={preferences.tablePageSize}
                    onValueChange={(value) =>
                      updatePreference("tablePageSize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 rows</SelectItem>
                      <SelectItem value="25">25 rows</SelectItem>
                      <SelectItem value="50">50 rows</SelectItem>
                      <SelectItem value="100">100 rows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="font-medium">Compact Tables</p>
                  <p className="text-sm text-muted-foreground">
                    Use smaller row height in tables
                  </p>
                </div>
                <Switch
                  checked={preferences.compactTables}
                  onCheckedChange={(checked) =>
                    updatePreference("compactTables", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
