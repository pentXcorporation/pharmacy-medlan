/**
 * Transaction Form Dialog
 * Form for creating/editing financial transactions
 */

import { useState } from "react";
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
import { TRANSACTION_TYPE, PAYMENT_METHOD } from "@/constants";

const TransactionFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  transaction,
}) => {
  const isEditing = !!transaction;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: transaction || {
      date: new Date().toISOString().split("T")[0],
      type: "INCOME",
      amount: "",
      description: "",
      paymentMethod: "CASH",
      reference: "",
    },
  });

  const transactionType = watch("type");

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit transaction:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Transaction" : "New Transaction"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update transaction details"
              : "Create a new financial transaction"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type *</Label>
              <Select
                defaultValue={transaction?.type || "INCOME"}
                onValueChange={(value) => setValue("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                  <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select
              defaultValue={transaction?.paymentMethod || "CASH"}
              onValueChange={(value) => setValue("paymentMethod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CHEQUE">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference Number</Label>
            <Input
              id="reference"
              placeholder="e.g., INV-001, CHQ-123"
              {...register("reference")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction details"
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
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Transaction"
                : "Create Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormDialog;
