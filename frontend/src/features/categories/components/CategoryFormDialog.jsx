/**
 * Category Form Dialog Component
 * Used for creating and editing categories in a dialog
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/common";

// Validation schema
const categorySchema = z.object({
  categoryName: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Name too long"),
  description: z
    .string()
    .max(500, "Description too long")
    .optional()
    .nullable(),
  isActive: z.boolean().default(true),
});

/**
 * CategoryFormDialog component
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onOpenChange - Dialog state change handler
 * @param {Object} props.category - Category to edit (null for create)
 * @param {Function} props.onSubmit - Submit handler
 * @param {boolean} props.isSubmitting - Loading state
 */
const CategoryFormDialog = ({
  open,
  onOpenChange,
  category,
  onSubmit,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(category);

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
      description: "",
      isActive: true,
    },
  });

  // Reset form when category changes
  useEffect(() => {
    if (open) {
      if (category) {
        form.reset({
          categoryName: category.categoryName || "",
          description: category.description || "",
          isActive: category.isActive ?? true,
        });
      } else {
        form.reset({
          categoryName: "",
          description: "",
          isActive: true,
        });
      }
    }
  }, [category, form, open]);

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category details below."
              : "Create a new category for organizing products."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Pain Relief" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the category"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Inactive categories won't appear in product selection
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                {isSubmitting && <ButtonSpinner />}
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
