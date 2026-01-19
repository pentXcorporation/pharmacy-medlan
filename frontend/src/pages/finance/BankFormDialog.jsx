/**
 * Bank Form Dialog
 * Form for creating and editing bank accounts
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

const BankFormDialog = ({ open, onOpenChange, bank = null, onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      accountHolderName: "",
      accountType: "CURRENT",
      openingBalance: "0",
      isActive: true,
    },
  });

  const accountType = watch("accountType");
  const isActive = watch("isActive");

  useEffect(() => {
    if (bank) {
      reset({
        bankName: bank.bankName || "",
        accountNumber: bank.accountNumber || "",
        ifscCode: bank.ifscCode || "",
        branchName: bank.branchName || "",
        accountHolderName: bank.accountHolderName || "",
        accountType: bank.accountType || "CURRENT",
        openingBalance: bank.openingBalance?.toString() || "0",
        isActive: bank.isActive !== false,
      });
    } else {
      reset({
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        branchName: "",
        accountHolderName: "",
        accountType: "CURRENT",
        openingBalance: "0",
        isActive: true,
      });
    }
  }, [bank, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      openingBalance: parseFloat(data.openingBalance) || 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bank ? "Edit Bank Account" : "Add New Bank Account"}</DialogTitle>
          <DialogDescription>
            {bank ? "Update bank account details" : "Enter details for the new bank account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                placeholder="e.g., Commercial Bank"
                {...register("bankName", {
                  required: "Bank name is required",
                  minLength: {
                    value: 2,
                    message: "Bank name must be at least 2 characters",
                  },
                })}
              />
              {errors.bankName && (
                <p className="text-sm text-red-600">{errors.bankName.message}</p>
              )}
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                placeholder="e.g., 1234567890"
                {...register("accountNumber", {
                  required: "Account number is required",
                  pattern: {
                    value: /^[0-9]{8,20}$/,
                    message: "Account number must be 8-20 digits",
                  },
                })}
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-600">{errors.accountNumber.message}</p>
              )}
            </div>

            {/* IFSC Code */}
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                placeholder="e.g., COMB0123456"
                {...register("ifscCode", {
                  pattern: {
                    value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: "Invalid IFSC code format",
                  },
                })}
              />
              {errors.ifscCode && (
                <p className="text-sm text-red-600">{errors.ifscCode.message}</p>
              )}
            </div>

            {/* Branch Name */}
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                placeholder="e.g., Main Branch"
                {...register("branchName")}
              />
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label htmlFor="accountHolderName">Account Holder Name *</Label>
              <Input
                id="accountHolderName"
                placeholder="e.g., ABC Pharmacy Pvt Ltd"
                {...register("accountHolderName", {
                  required: "Account holder name is required",
                })}
              />
              {errors.accountHolderName && (
                <p className="text-sm text-red-600">{errors.accountHolderName.message}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type *</Label>
              <Select
                value={accountType}
                onValueChange={(value) => setValue("accountType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="OVERDRAFT">Overdraft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Opening Balance */}
            <div className="space-y-2">
              <Label htmlFor="openingBalance">Opening Balance *</Label>
              <Input
                id="openingBalance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("openingBalance", {
                  required: "Opening balance is required",
                  min: {
                    value: 0,
                    message: "Opening balance cannot be negative",
                  },
                })}
              />
              {errors.openingBalance && (
                <p className="text-sm text-red-600">{errors.openingBalance.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active Account
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {bank ? "Update" : "Create"} Bank Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BankFormDialog;
