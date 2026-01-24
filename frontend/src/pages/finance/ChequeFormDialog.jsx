/**
 * Cheque Form Dialog
 * Form for creating/editing cheques with backend integration
 */

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
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
import { bankService } from "@/services";
import { CHEQUE_STATUS } from "@/constants";

const ChequeFormDialog = ({ open, onOpenChange, onSubmit, cheque }) => {
  const isEditing = !!cheque;
  const [banks, setBanks] = useState([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
    reset,
  } = useForm({
    defaultValues: {
      chequeNumber: "",
      chequeDate: new Date().toISOString().split("T")[0],
      depositDate: new Date().toISOString().split("T")[0],
      bankId: "",
      bankName: "",
      receivedFrom: "",
      company: "",
      amount: "",
      status: "PENDING",
      referenceNumber: "",
      remarks: "",
    },
  });

  // Load banks on mount
  useEffect(() => {
    const loadBanks = async () => {
      try {
        setIsLoadingBanks(true);
        const response = await bankService.getActive();
        setBanks(response.data.data || []);
      } catch (error) {
        console.error("Error loading banks:", error);
      } finally {
        setIsLoadingBanks(false);
      }
    };
    if (open) {
      loadBanks();
    }
  }, [open]);

  // Reset form when cheque data changes
  useEffect(() => {
    if (cheque && open) {
      reset({
        chequeNumber: cheque.chequeNumber || "",
        chequeDate: cheque.chequeDate || new Date().toISOString().split("T")[0],
        depositDate: cheque.depositDate || new Date().toISOString().split("T")[0],
        bankId: cheque.bankId?.toString() || "",
        bankName: cheque.bankName || "",
        receivedFrom: cheque.receivedFrom || "",
        company: cheque.company || "",
        amount: cheque.amount || "",
        status: cheque.status || "PENDING",
        referenceNumber: cheque.referenceNumber || "",
        remarks: cheque.remarks || "",
      });
    } else if (!cheque && open) {
      reset({
        chequeNumber: "",
        chequeDate: new Date().toISOString().split("T")[0],
        depositDate: new Date().toISOString().split("T")[0],
        bankId: "",
        bankName: "",
        receivedFrom: "",
        company: "",
        amount: "",
        status: "PENDING",
        referenceNumber: "",
        remarks: "",
      });
    }
  }, [cheque, open, reset]);

  const handleFormSubmit = async (data) => {
    try {
      // Transform data to match backend CreateChequeRequest DTO
      const requestData = {
        chequeNumber: data.chequeNumber,
        amount: parseFloat(data.amount),
        chequeDate: data.chequeDate,
        depositDate: data.depositDate,
        bankId: parseInt(data.bankId),
        bankName: data.bankName,
        receivedFrom: data.receivedFrom || null,
        company: data.company || null,
        status: data.status,
        referenceNumber: data.referenceNumber || null,
        remarks: data.remarks || null,
      };

      await onSubmit(requestData);
    } catch (error) {
      console.error("Failed to submit cheque:", error);
    }
  };

  const handleBankChange = (bankId) => {
    const selectedBank = banks.find((b) => b.id.toString() === bankId);
    if (selectedBank) {
      setValue("bankName", selectedBank.bankName);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="depositDate">Deposit Date *</Label>
              <Input
                id="depositDate"
                type="date"
                {...register("depositDate", {
                  required: "Deposit date is required",
                })}
              />
              {errors.depositDate && (
                <p className="text-sm text-destructive">
                  {errors.depositDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="DEPOSITED">Deposited</SelectItem>
                      <SelectItem value="CLEARED">Cleared</SelectItem>
                      <SelectItem value="BOUNCED">Bounced</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="REPLACED">Replaced</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankId">Bank Account *</Label>
              <Controller
                name="bankId"
                control={control}
                rules={{ required: "Bank is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleBankChange(value);
                    }}
                    value={field.value}
                    disabled={isLoadingBanks}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id.toString()}>
                          {bank.bankName} - {bank.accountNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bankId && (
                <p className="text-sm text-destructive">
                  {errors.bankId.message}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receivedFrom">Received From</Label>
              <Input
                id="receivedFrom"
                placeholder="Payer name"
                {...register("receivedFrom")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Company name"
                {...register("company")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input
              id="referenceNumber"
              placeholder="e.g., INV-001"
              {...register("referenceNumber")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Additional notes"
              rows={3}
              {...register("remarks")}
            />
          </div>

          <input type="hidden" {...register("bankName")} />

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
