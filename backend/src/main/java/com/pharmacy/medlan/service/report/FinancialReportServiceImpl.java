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
}
