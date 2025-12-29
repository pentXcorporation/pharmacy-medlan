/**
 * Stock Adjustment Form Page
 * Create new stock adjustments
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { ROUTES } from "@/config";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Validation schema
const adjustmentSchema = z.object({
  adjustmentType: z.string().min(1, "Adjustment type is required"),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
});

const ADJUSTMENT_TYPES = [
  { value: "DAMAGE", label: "Damage" },
  { value: "LOSS", label: "Loss" },
  { value: "EXPIRY", label: "Expiry" },
  { value: "CORRECTION", label: "Correction" },
  { value: "COUNT", label: "Physical Count" },
];

/**
 * StockAdjustmentFormPage component
 */
const StockAdjustmentFormPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      adjustmentType: "",
      reason: "",
      notes: "",
    },
  });

  // Add item to adjustment
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        productId: "",
        productName: "",
        currentStock: 0,
        adjustmentQty: 0,
        newStock: 0,
      },
    ]);
  };

  // Remove item from adjustment
  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (items.length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement actual API call
      console.log("Submitting adjustment:", { ...data, items });
      navigate(ROUTES.INVENTORY.ADJUSTMENTS.LIST);
    } catch (error) {
      console.error("Error creating adjustment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Stock Adjustment"
        description="Create a new stock adjustment for damage, loss, or corrections"
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.INVENTORY.ADJUSTMENTS.LIST)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Adjustments
          </Button>
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Adjustment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Adjustment Details</CardTitle>
              <CardDescription>
                Enter the adjustment type and reason
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="adjustmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adjustment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ADJUSTMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter reason" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any additional information about this adjustment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Adjustment Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Adjustment Items</CardTitle>
                <CardDescription>Add products to adjust</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={handleAddItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items added. Click "Add Item" to add products to adjust.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Adjustment Qty</TableHead>
                        <TableHead>New Stock</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input placeholder="Search product..." />
                          </TableCell>
                          <TableCell>{item.currentStock}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0"
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>{item.newStock}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.INVENTORY.ADJUSTMENTS.LIST)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || items.length === 0}>
              {isSubmitting ? "Creating..." : "Create Adjustment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StockAdjustmentFormPage;
