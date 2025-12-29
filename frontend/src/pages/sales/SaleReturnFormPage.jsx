/**
 * Sale Return Form Page
 * Process a new return for a sale
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Search, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, ButtonSpinner } from "@/components/common";
import { useSale, useCreateSaleReturn } from "@/features/sales";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { ROUTES } from "@/config";

const returnReasons = [
  "Defective Product",
  "Wrong Product",
  "Expired Product",
  "Customer Changed Mind",
  "Allergic Reaction",
  "Wrong Quantity",
  "Other",
];

const returnSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
  refundMethod: z.enum(["CASH", "CREDIT", "ORIGINAL_METHOD"]),
});

const SaleReturnFormPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const saleIdParam = searchParams.get("saleId");

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [saleId, setSaleId] = useState(saleIdParam);
  const [selectedItems, setSelectedItems] = useState({});
  const [returnQuantities, setReturnQuantities] = useState({});

  // Queries
  const { data: sale, isLoading: saleLoading } = useSale(saleId);
  const createReturnMutation = useCreateSaleReturn();

  const form = useForm({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      reason: "",
      notes: "",
      refundMethod: "ORIGINAL_METHOD",
    },
  });

  // Initialize return quantities when sale loads
  useEffect(() => {
    if (sale?.items) {
      const quantities = {};
      const selected = {};
      sale.items.forEach((item) => {
        quantities[item.id] = item.quantity - (item.returnedQuantity || 0);
        selected[item.id] = false;
      });
      setReturnQuantities(quantities);
      setSelectedItems(selected);
    }
  }, [sale]);

  // Search for sale by invoice
  const handleSearch = () => {
    if (invoiceSearch.trim()) {
      // In a real app, this would search and return the sale ID
      // For now, we'll just set it directly if it looks like an ID
      setSaleId(invoiceSearch);
    }
  };

  // Calculate refund total
  const calculateRefundTotal = () => {
    if (!sale?.items) return 0;
    return sale.items.reduce((total, item) => {
      if (selectedItems[item.id]) {
        return total + item.unitPrice * returnQuantities[item.id];
      }
      return total;
    }, 0);
  };

  // Handle submit
  const onSubmit = (data) => {
    const returnItems = sale.items
      .filter((item) => selectedItems[item.id] && returnQuantities[item.id] > 0)
      .map((item) => ({
        saleItemId: item.id,
        quantity: returnQuantities[item.id],
      }));

    if (returnItems.length === 0) {
      return;
    }

    createReturnMutation.mutate(
      {
        saleId: sale.id,
        items: returnItems,
        reason: data.reason,
        notes: data.notes,
        refundMethod: data.refundMethod,
      },
      {
        onSuccess: () => {
          navigate(ROUTES.SALES.RETURNS);
        },
      }
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title="Process Sale Return"
        description="Select items to return and process refund"
      />

      {/* Sale Search */}
      {!sale && (
        <Card>
          <CardHeader>
            <CardTitle>Find Sale</CardTitle>
            <CardDescription>
              Enter the invoice number to find the original sale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter invoice number..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                className="max-w-md"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sale Details */}
      {sale && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Sale Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label className="text-muted-foreground">Invoice #</Label>
                  <p className="font-medium">{sale.invoiceNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">
                    {formatDateTime(sale.createdAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">
                    {sale.customerName || "Walk-in"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Original Total
                  </Label>
                  <p className="font-medium">
                    {formatCurrency(sale.totalAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Items to Return</CardTitle>
                <CardDescription>
                  Check the items you want to return and specify quantities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Return</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Original Qty</TableHead>
                      <TableHead>Already Returned</TableHead>
                      <TableHead>Return Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Refund</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sale.items?.map((item) => {
                      const maxReturn =
                        item.quantity - (item.returnedQuantity || 0);
                      const isSelected = selectedItems[item.id];

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                setSelectedItems({
                                  ...selectedItems,
                                  [item.id]: checked,
                                })
                              }
                              disabled={maxReturn <= 0}
                            />
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.sku}
                            </p>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.returnedQuantity || 0}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={returnQuantities[item.id] || 0}
                              onChange={(e) =>
                                setReturnQuantities({
                                  ...returnQuantities,
                                  [item.id]: Math.min(
                                    Math.max(0, parseInt(e.target.value) || 0),
                                    maxReturn
                                  ),
                                })
                              }
                              disabled={!isSelected || maxReturn <= 0}
                              className="w-20"
                              min={0}
                              max={maxReturn}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {isSelected
                              ? formatCurrency(
                                  item.unitPrice * returnQuantities[item.id]
                                )
                              : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <Separator className="my-4" />

                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Total Refund
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(calculateRefundTotal())}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Reason *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {returnReasons.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
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
                  name="refundMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Method *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ORIGINAL_METHOD">
                            Original Payment Method
                          </SelectItem>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="CREDIT">Store Credit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes about this return..."
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createReturnMutation.isPending || calculateRefundTotal() === 0
                }
              >
                {createReturnMutation.isPending && <ButtonSpinner />}
                <Undo2 className="h-4 w-4 mr-2" />
                Process Return
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default SaleReturnFormPage;
