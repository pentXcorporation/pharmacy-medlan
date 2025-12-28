/**
 * Stock Transfer Form Component
 * Form for creating new stock transfers
 */

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonSpinner } from "@/components/common";

// Validation schema
const stockTransferSchema = z
  .object({
    fromBranchId: z.string().min(1, "Source branch is required"),
    toBranchId: z.string().min(1, "Destination branch is required"),
    notes: z.string().max(500).optional().nullable(),
    items: z
      .array(
        z.object({
          productId: z.string().min(1, "Product is required"),
          quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        })
      )
      .min(1, "At least one item is required"),
  })
  .refine((data) => data.fromBranchId !== data.toBranchId, {
    message: "Source and destination branches must be different",
    path: ["toBranchId"],
  });

/**
 * StockTransferForm component
 * @param {Object} props
 * @param {Array} props.branches - Available branches
 * @param {Array} props.products - Available products
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isSubmitting - Loading state
 */
const StockTransferForm = ({
  branches = [],
  products = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const form = useForm({
    resolver: zodResolver(stockTransferSchema),
    defaultValues: {
      fromBranchId: "",
      toBranchId: "",
      notes: "",
      items: [{ productId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleSubmit = (data) => {
    onSubmit({
      ...data,
      items: data.items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      })),
    });
  };

  const addItem = () => {
    append({ productId: "", quantity: 1 });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fromBranchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Branch *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={String(branch.id)}>
                            {branch.branchName}
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
                name="toBranchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Branch *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={String(branch.id)}>
                            {branch.branchName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transfer Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                <FormField
                  control={form.control}
                  name={`items.${index}.productId`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className={index === 0 ? "" : "sr-only"}>
                        Product *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={String(product.id)}
                            >
                              {product.productName} ({product.productCode})
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
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel className={index === 0 ? "" : "sr-only"}>
                        Quantity *
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-8"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <ButtonSpinner />}
            Create Transfer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StockTransferForm;
