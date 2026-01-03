import React, { useState } from "react";
import { Calendar, DollarSign, TrendingUp, TrendingDown, Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";

/**
 * Cash Book Page - Track all cash transactions
 * Records cash receipts and payments with running balance
 */
const CashBookPage = () => {
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    type: "all",
  });

  // Mock data - replace with actual API calls
  const cashTransactions = [
    {
      id: 1,
      date: "2026-01-03",
      time: "09:30",
      reference: "SALE-0001",
      description: "Cash Sale - Bill #0001",
      type: "RECEIPT",
      amount: 1250.00,
      runningBalance: 15250.00,
    },
    {
      id: 2,
      date: "2026-01-03",
      time: "10:15",
      reference: "SALE-0002",
      description: "Cash Sale - Bill #0002",
      type: "RECEIPT",
      amount: 3500.00,
      runningBalance: 18750.00,
    },
    {
      id: 3,
      date: "2026-01-03",
      time: "11:00",
      reference: "EXP-001",
      description: "Utility Bills Payment",
      type: "PAYMENT",
      amount: 2000.00,
      runningBalance: 16750.00,
    },
    {
      id: 4,
      date: "2026-01-03",
      time: "12:30",
      reference: "SALE-0003",
      description: "Cash Sale - Bill #0003",
      type: "RECEIPT",
      amount: 850.00,
      runningBalance: 17600.00,
    },
    {
      id: 5,
      date: "2026-01-03",
      time: "14:00",
      reference: "PAY-GRN-001",
      description: "Supplier Payment - ABC Pharma",
      type: "PAYMENT",
      amount: 5000.00,
      runningBalance: 12600.00,
    },
  ];

  const summary = {
    openingBalance: 14000.00,
    totalReceipts: 5600.00,
    totalPayments: 7000.00,
    closingBalance: 12600.00,
  };

  const handleExport = () => {
    console.log("Exporting cash book data...");
    // Implement actual export logic
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cash Book</h1>
          <p className="text-gray-600 mt-1">Track all cash receipts and payments</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Cash Book
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Opening Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summary.openingBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
              Total Receipts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{summary.totalReceipts.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
              Total Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{summary.totalPayments.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Closing Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summary.closingBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="RECEIPT">Receipts Only</SelectItem>
                  <SelectItem value="PAYMENT">Payments Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Book Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Book Entries</CardTitle>
          <CardDescription>
            Chronological record of all cash transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Receipt (₹)</TableHead>
                <TableHead className="text-right">Payment (₹)</TableHead>
                <TableHead className="text-right">Balance (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-gray-50 font-medium">
                <TableCell colSpan={6}>Opening Balance</TableCell>
                <TableCell className="text-right">
                  ₹{summary.openingBalance.toLocaleString()}
                </TableCell>
              </TableRow>
              {cashTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.date}</div>
                      <div className="text-sm text-gray-500">{transaction.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {transaction.reference}
                    </code>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "RECEIPT" ? "success" : "destructive"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    {transaction.type === "RECEIPT"
                      ? `₹${transaction.amount.toLocaleString()}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right text-red-600 font-medium">
                    {transaction.type === "PAYMENT"
                      ? `₹${transaction.amount.toLocaleString()}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₹{transaction.runningBalance.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-100 font-bold">
                <TableCell colSpan={4}>Totals</TableCell>
                <TableCell className="text-right text-green-600">
                  ₹{summary.totalReceipts.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-red-600">
                  ₹{summary.totalPayments.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ₹{summary.closingBalance.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashBookPage;
