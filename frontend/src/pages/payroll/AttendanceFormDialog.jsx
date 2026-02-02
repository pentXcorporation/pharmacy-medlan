/**
 * Attendance Form Dialog
 * Form for marking employee attendance
 */

import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import payrollService from "@/services/payrollService";
import { useAuthStore } from "@/store/authStore";
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

const AttendanceFormDialog = ({ open, onOpenChange, onSubmit }) => {
  const getBranchId = useAuthStore((state) => state.getBranchId);
  const branchId = getBranchId();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      employeeId: "",
      checkIn: "",
      checkOut: "",
      status: "PRESENT",
      notes: "",
    },
  });

  // Fetch employees
  const { data: employeesData } = useQuery({
    queryKey: ["employees", "all"],
    queryFn: () => payrollService.getAllEmployees({ page: 0, size: 1000 }),
    select: (response) => response.data,
  });

  const handleFormSubmit = async (data) => {
    try {
      // Convert employeeId to number and ensure proper format
      const payload = {
        ...data,
        branchId: branchId,
        employeeId: Number(data.employeeId),
        date: data.date,
        checkIn: data.checkIn || null,
        checkOut: data.checkOut || null,
      };

      await onSubmit(payload);
      reset();
    } catch (error) {
      console.error("Failed to mark attendance:", error);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Record employee attendance for the day
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              {...register("date", { required: "Date is required" })}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee *</Label>
            <Controller
              name="employeeId"
              control={control}
              rules={{ required: "Employee is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeesData?.content?.map((employee) => (
                      <SelectItem
                        key={employee.id}
                        value={String(employee.id)}
                      >
                        {employee.fullName} ({employee.employeeCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employeeId && (
              <p className="text-sm text-destructive">
                {errors.employeeId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check In</Label>
              <Input
                id="checkIn"
                type="time"
                {...register("checkIn")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">Check Out</Label>
              <Input
                id="checkOut"
                type="time"
                {...register("checkOut")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRESENT">Present</SelectItem>
                    <SelectItem value="ABSENT">Absent</SelectItem>
                    <SelectItem value="LATE">Late</SelectItem>
                    <SelectItem value="HALF_DAY">Half Day</SelectItem>
                    <SelectItem value="ON_LEAVE">On Leave</SelectItem>
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
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Mark Attendance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceFormDialog;
