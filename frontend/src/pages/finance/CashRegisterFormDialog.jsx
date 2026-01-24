/**
 * Cash Register Form Dialog
 * Form for recording cash in/out transactions
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

const CashRegisterFormDialog = ({ open, onOpenChange, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      type: "CASH_IN",
      amount: "",
      description: "",
      category: "",
    },
  });

  const transactionType = watch("type");

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit transaction:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Cash Transaction</DialogTitle>
          <DialogDescription>
            Record a cash in or cash out transaction
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type *</Label>
            <Select
              defaultValue="CASH_IN"
              onValueChange={(value) => setValue("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH_IN">Cash In</SelectItem>
                <SelectItem value="CASH_OUT">Cash Out</SelectItem>
                <SelectItem value="SALE">Sale</SelectItem>
                <SelectItem value="REFUND">Refund</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="COLLECTION">Collection</SelectItem>
                <SelectItem value="ADVANCE">Advance</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Petty Cash, Sales, Utilities"
              {...register("category")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder={
                transactionType === "CASH_IN"
                  ? "e.g., Cash received from customer"
                  : transactionType === "CASH_OUT"
                  ? "e.g., Petty cash withdrawal"
                  : transactionType === "SALE"
                  ? "e.g., POS sale payment"
                  : transactionType === "EXPENSE"
                  ? "e.g., Office supplies purchase"
                  : "Enter transaction details"
              }
              rows={3}
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
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
              {isSubmitting ? "Recording..." : "Record Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CashRegisterFormDialog;
