/**
 * Salary Payment Dialog
 * Form for processing salary payments
 */

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_METHOD } from "@/constants";

const SalaryPaymentDialog = ({ open, onOpenChange, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      month: new Date().toISOString().slice(0, 7),
      employeeName: "",
      basicSalary: "",
      allowances: 0,
      deductions: 0,
      paymentMethod: "BANK_TRANSFER",
      notes: "",
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to process salary:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Process Salary Payment</DialogTitle>
          <DialogDescription>
            Record salary payment for an employee
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month *</Label>
              <Input
                id="month"
                type="month"
                {...register("month", { required: "Month is required" })}
              />
              {errors.month && (
                <p className="text-sm text-destructive">
                  {errors.month.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeName">Employee *</Label>
              <Input
                id="employeeName"
                placeholder="Employee name"
                {...register("employeeName", {
                  required: "Employee name is required",
                })}
              />
              {errors.employeeName && (
                <p className="text-sm text-destructive">
                  {errors.employeeName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basicSalary">Basic Salary *</Label>
              <Input
                id="basicSalary"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("basicSalary", {
                  required: "Basic salary is required",
                  min: { value: 0, message: "Must be positive" },
                })}
              />
              {errors.basicSalary && (
                <p className="text-sm text-destructive">
                  {errors.basicSalary.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowances">Allowances</Label>
              <Input
                id="allowances"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("allowances")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deductions">Deductions</Label>
              <Input
                id="deductions"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("deductions")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select
              defaultValue="BANK_TRANSFER"
              onValueChange={(value) => setValue("paymentMethod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CHEQUE">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes"
              rows={2}
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Process Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryPaymentDialog;
