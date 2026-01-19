package com.pharmacy.medlan.service.report;

import com.pharmacy.medlan.enums.InvoiceStatus;
import com.pharmacy.medlan.enums.SaleStatus;
import com.pharmacy.medlan.model.pos.Invoice;
import com.pharmacy.medlan.model.pos.Sale;
import com.pharmacy.medlan.model.pos.SaleItem;
import com.pharmacy.medlan.repository.pos.InvoiceRepository;
import com.pharmacy.medlan.repository.pos.SaleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinancialReportServiceImpl implements FinancialReportService {

    private final SaleRepository saleRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public BigDecimal getTotalRevenue(Long branchId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        
        BigDecimal total = saleRepository.getTotalSalesByBranchAndDate(branchId, startDateTime, endDateTime);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Override
    public Map<String, BigDecimal> getRevenueByCategory(Long branchId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        
        List<Sale> sales = saleRepository.findByBranchAndDateRange(branchId, startDateTime, endDateTime);
        Map<String, BigDecimal> categoryRevenue = new HashMap<>();
        
        for (Sale sale : sales) {
            if (sale.getStatus() == SaleStatus.COMPLETED && sale.getSaleItems() != null) {
                for (SaleItem item : sale.getSaleItems()) {
                    String categoryName = item.getProduct().getCategory() != null ?
                            item.getProduct().getCategory().getCategoryName() : "Uncategorized";
                    categoryRevenue.merge(categoryName, item.getTotalAmount(), BigDecimal::add);
                }
            }
        }
        return categoryRevenue;
    }

    @Override
    public Map<String, BigDecimal> getDailyRevenue(Long branchId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        
        List<Sale> sales = saleRepository.findByBranchAndDateRange(branchId, startDateTime, endDateTime);
        Map<String, BigDecimal> dailyRevenue = new TreeMap<>();
        
        for (Sale sale : sales) {
            if (sale.getStatus() == SaleStatus.COMPLETED) {
                String dateKey = sale.getSaleDate().toLocalDate().toString();
                dailyRevenue.merge(dateKey, sale.getTotalAmount(), BigDecimal::add);
            }
        }
        return dailyRevenue;
    }

    @Override
    public BigDecimal getTotalExpenses(Long branchId, LocalDate startDate, LocalDate endDate) {
        // Would need expense tracking - placeholder
        return BigDecimal.ZERO;
    }

    @Override
    public Map<String, BigDecimal> getExpensesByCategory(Long branchId, LocalDate startDate, LocalDate endDate) {
        // Would need expense tracking - placeholder
        return Map.of();
    }

    @Override
    public Map<String, Object> getProfitAndLossReport(Long branchId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        
        List<Sale> sales = saleRepository.findByBranchAndDateRange(branchId, startDateTime, endDateTime);
        
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        
        for (Sale sale : sales) {
            if (sale.getStatus() == SaleStatus.COMPLETED) {
                totalRevenue = totalRevenue.add(sale.getTotalAmount());
                
                if (sale.getSaleItems() != null) {
                    for (SaleItem item : sale.getSaleItems()) {
                        if (item.getCostPrice() != null) {
                            totalCost = totalCost.add(
                                    item.getCostPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                        }
                    }
                }
            }
        }
        
        BigDecimal grossProfit = totalRevenue.subtract(totalCost);
        BigDecimal profitMargin = totalRevenue.compareTo(BigDecimal.ZERO) > 0 ?
                grossProfit.multiply(BigDecimal.valueOf(100)).divide(totalRevenue, 2, RoundingMode.HALF_UP) :
                BigDecimal.ZERO;
        
        Map<String, Object> report = new HashMap<>();
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalRevenue", totalRevenue);
        report.put("totalCost", totalCost);
        report.put("grossProfit", grossProfit);
        report.put("profitMargin", profitMargin);
        
        return report;
    }

    @Override
    public BigDecimal getGrossProfit(Long branchId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> pnl = getProfitAndLossReport(branchId, startDate, endDate);
        return (BigDecimal) pnl.get("grossProfit");
    }

    @Override
    public BigDecimal getNetProfit(Long branchId, LocalDate startDate, LocalDate endDate) {
        BigDecimal grossProfit = getGrossProfit(branchId, startDate, endDate);
        BigDecimal expenses = getTotalExpenses(branchId, startDate, endDate);
        return grossProfit.subtract(expenses);
    }

    @Override
    public Map<String, Object> getCashFlowReport(Long branchId, LocalDate startDate, LocalDate endDate) {
        BigDecimal totalSales = getTotalRevenue(branchId, startDate, endDate);
        
        // Get paid invoices
        List<Invoice> invoices = invoiceRepository.findByBranchAndDateRange(branchId, startDate, endDate);
        BigDecimal cashReceived = invoices.stream()
                .filter(inv -> inv.getStatus() == InvoiceStatus.PAID)
                .map(Invoice::getPaidAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("startDate", startDate);
        summary.put("endDate", endDate);
        summary.put("totalSales", totalSales);
        summary.put("cashReceived", cashReceived);
        summary.put("cashPayments", BigDecimal.ZERO); // Would need payment tracking
        summary.put("netCashFlow", cashReceived);
        
        return summary;
    }

    @Override
    public BigDecimal getTotalReceivables(Long branchId) {
        BigDecimal outstanding = invoiceRepository.getTotalOutstandingByBranch(branchId);
        return outstanding != null ? outstanding : BigDecimal.ZERO;
    }

    @Override
    public BigDecimal getTotalPayables(Long branchId) {
        // Would need supplier payment tracking - placeholder
        return BigDecimal.ZERO;
    }

    @Override
    public List<Map<String, Object>> getAgeingReport(Long branchId, String type) {
        if ("receivables".equalsIgnoreCase(type)) {
            List<Invoice> invoices = invoiceRepository.findByBranchId(branchId);
            List<Map<String, Object>> agingReport = new ArrayList<>();
            LocalDate today = LocalDate.now();
            
            for (Invoice invoice : invoices) {
                if (invoice.getStatus() == InvoiceStatus.ISSUED || 
                    invoice.getStatus() == InvoiceStatus.PARTIALLY_PAID ||
                    invoice.getStatus() == InvoiceStatus.OVERDUE) {
                    
                    Map<String, Object> item = new HashMap<>();
                    item.put("invoiceId", invoice.getId());
                    item.put("invoiceNumber", invoice.getInvoiceNumber());
                    item.put("customerName", invoice.getCustomer() != null ? invoice.getCustomer().getCustomerName() : "N/A");
                    item.put("totalAmount", invoice.getTotalAmount());
                    item.put("balanceAmount", invoice.getBalanceAmount());
                    
                    if (invoice.getDueDate() != null) {
                        long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(invoice.getDueDate(), today);
                        item.put("daysOverdue", Math.max(0, daysOverdue));
                        
                        String agingBucket;
                        if (daysOverdue <= 0) agingBucket = "Current";
                        else if (daysOverdue <= 30) agingBucket = "1-30 Days";
                        else if (daysOverdue <= 60) agingBucket = "31-60 Days";
                        else if (daysOverdue <= 90) agingBucket = "61-90 Days";
                        else agingBucket = "90+ Days";
                        item.put("agingBucket", agingBucket);
                    } else {
                        item.put("daysOverdue", 0);
                        item.put("agingBucket", "Current");
                    }
                    
                    agingReport.add(item);
                }
            }
            return agingReport;
        }
        return List.of(); // Payables would need supplier payment tracking
    }

    @Override
    public Map<String, BigDecimal> getTaxSummary(Long branchId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        
        List<Sale> sales = saleRepository.findByBranchAndDateRange(branchId, startDateTime, endDateTime);
        
        BigDecimal totalTaxCollected = BigDecimal.ZERO;
        Map<String, BigDecimal> taxByRate = new HashMap<>();
        
        for (Sale sale : sales) {
            if (sale.getStatus() == SaleStatus.COMPLETED && sale.getTaxAmount() != null) {
                totalTaxCollected = totalTaxCollected.add(sale.getTaxAmount());
            }
        }
        
        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("totalTaxCollected", totalTaxCollected);
        summary.put("totalTaxPayable", BigDecimal.ZERO); // Would need input tax tracking
        summary.put("netTax", totalTaxCollected);
        
        return summary;
    }
    
    @Override
    public Map<String, Object> getFinancialSummary(Long branchId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        
        // Calculate revenue
        List<Sale> sales = saleRepository.findByBranchAndDateRange(branchId, startDateTime, endDateTime);
        BigDecimal totalSales = BigDecimal.ZERO;
        BigDecimal cashSales = BigDecimal.ZERO;
        BigDecimal creditSales = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        
        for (Sale sale : sales) {
            if (sale.getStatus() == SaleStatus.COMPLETED) {
                totalSales = totalSales.add(sale.getTotalAmount());
                
                // Separate cash and credit sales based on payment method
                if (sale.getPaymentMethod() != null) {
                    if ("CASH".equals(sale.getPaymentMethod().name())) {
                        cashSales = cashSales.add(sale.getTotalAmount());
                    } else {
                        creditSales = creditSales.add(sale.getTotalAmount());
                    }
                } else {
                    // Default to cash if payment method is not specified
                    cashSales = cashSales.add(sale.getTotalAmount());
                }
                
                if (sale.getTaxAmount() != null) {
                    totalTax = totalTax.add(sale.getTaxAmount());
                }
                
                // Calculate cost
                if (sale.getSaleItems() != null) {
                    for (SaleItem item : sale.getSaleItems()) {
                        if (item.getCostPrice() != null) {
                            totalCost = totalCost.add(
                                    item.getCostPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                        }
                    }
                }
            }
        }
        
        // Returns/Refunds - would need return tracking
        BigDecimal returnsRefunds = BigDecimal.ZERO;
        BigDecimal netRevenue = totalSales.subtract(returnsRefunds);
        
        // Revenue breakdown
        Map<String, Object> revenue = new HashMap<>();
        revenue.put("totalSales", totalSales);
        revenue.put("cashSales", cashSales);
        revenue.put("creditSales", creditSales);
        revenue.put("returnsRefunds", returnsRefunds);
        revenue.put("netRevenue", netRevenue);
        
        // Expenses - placeholder (would need expense tracking)
        Map<String, Object> expenses = new HashMap<>();
        expenses.put("purchases", totalCost);
        expenses.put("salaries", BigDecimal.ZERO);
        expenses.put("rent", BigDecimal.ZERO);
        expenses.put("utilities", BigDecimal.ZERO);
        expenses.put("transportation", BigDecimal.ZERO);
        expenses.put("marketing", BigDecimal.ZERO);
        expenses.put("miscellaneous", BigDecimal.ZERO);
        expenses.put("totalExpenses", totalCost);
        
        // Profitability
        BigDecimal grossProfit = netRevenue.subtract(totalCost);
        BigDecimal grossMargin = netRevenue.compareTo(BigDecimal.ZERO) > 0 ?
                grossProfit.multiply(BigDecimal.valueOf(100)).divide(netRevenue, 2, RoundingMode.HALF_UP) :
                BigDecimal.ZERO;
        BigDecimal netProfit = grossProfit; // Same as gross profit without other expenses tracked
        BigDecimal netMargin = netRevenue.compareTo(BigDecimal.ZERO) > 0 ?
                netProfit.multiply(BigDecimal.valueOf(100)).divide(netRevenue, 2, RoundingMode.HALF_UP) :
                BigDecimal.ZERO;
        
        Map<String, Object> profitability = new HashMap<>();
        profitability.put("grossProfit", grossProfit);
        profitability.put("grossMargin", grossMargin);
        profitability.put("netProfit", netProfit);
        profitability.put("netMargin", netMargin);
        
        // Cash Flow - simplified
        Map<String, Object> cashFlow = new HashMap<>();
        cashFlow.put("openingCash", BigDecimal.ZERO); // Would need cash book tracking
        cashFlow.put("cashIn", cashSales);
        cashFlow.put("cashOut", BigDecimal.ZERO); // Would need expense tracking
        cashFlow.put("closingCash", cashSales);
        
        // Receivables and Payables
        BigDecimal accountsReceivable = getTotalReceivables(branchId);
        BigDecimal accountsPayable = getTotalPayables(branchId);
        
        // Build final summary
        Map<String, Object> summary = new HashMap<>();
        summary.put("startDate", startDate);
        summary.put("endDate", endDate);
        summary.put("revenue", revenue);
        summary.put("expenses", expenses);
        summary.put("profitability", profitability);
        summary.put("cashFlow", cashFlow);
        summary.put("accountsReceivable", accountsReceivable);
        summary.put("accountsPayable", accountsPayable);
        summary.put("totalTax", totalTax);
        
        return summary;
    }
}
