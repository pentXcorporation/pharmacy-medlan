/**
 * Cheque Form Dialog
 * Form for creating/editing cheques
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

const ChequeFormDialog = ({ open, onOpenChange, onSubmit, cheque }) => {
  const isEditing = !!cheque;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: cheque || {
      chequeNumber: "",
      chequeDate: new Date().toISOString().split("T")[0],
      bankName: "",
      branchName: "",
      payeeName: "",
      amount: "",
      notes: "",
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit cheque:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Cheque" : "New Cheque"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update cheque details"
              : "Record a new cheque payment or collection"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chequeNumber">Cheque Number *</Label>
              <Input
                id="chequeNumber"
                placeholder="e.g., 123456"
                {...register("chequeNumber", {
                  required: "Cheque number is required",
                })}
              />
              {errors.chequeNumber && (
                <p className="text-sm text-destructive">
                  {errors.chequeNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chequeDate">Cheque Date *</Label>
              <Input
                id="chequeDate"
                type="date"
                {...register("chequeDate", {
                  required: "Cheque date is required",
                })}
              />
              {errors.chequeDate && (
                <p className="text-sm text-destructive">
                  {errors.chequeDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                placeholder="e.g., Commercial Bank"
                {...register("bankName", {
                  required: "Bank name is required",
                })}
              />
              {errors.bankName && (
                <p className="text-sm text-destructive">
                  {errors.bankName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                placeholder="e.g., Main Branch"
                {...register("branchName")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payeeName">Payee Name *</Label>
            <Input
              id="payeeName"
              placeholder="Name of the payee"
              {...register("payeeName", {
                required: "Payee name is required",
              })}
            />
            {errors.payeeName && (
              <p className="text-sm text-destructive">
                {errors.payeeName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" },
              })}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
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
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Cheque"
                : "Create Cheque"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChequeFormDialog;
