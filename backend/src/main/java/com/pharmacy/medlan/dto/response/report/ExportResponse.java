package com.pharmacy.medlan.dto.response.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportResponse {
    
    /**
     * Filename of the exported document
     */
    private String filename;
    
    /**
     * MIME type (application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, etc.)
     */
    private String mimeType;
    
    /**
     * Base64 encoded file content
     */
    private String contentBase64;
    
    /**
     * File size in bytes
     */
    private long fileSize;
    
    /**
     * Export type (PDF, EXCEL, CSV)
     */
    private String exportType;
    
    /**
     * Report type identifier
     */
    private String reportType;
    
    /**
     * Generation timestamp
     */
    private LocalDateTime generatedAt;
    
    /**
     * Number of records/pages in the report
     */
    private int recordCount;
    
    /**
     * Any additional metadata
     */
    private String metadata;
    
    /**
     * Data URL for direct download
     */
    public String getDataUrl() {
        return "data:" + mimeType + ";base64," + contentBase64;
    }
    
    /**
     * Create a PDF response
     */
    public static ExportResponse pdf(String filename, String base64Content, int recordCount) {
        return ExportResponse.builder()
                .filename(filename)
                .mimeType("application/pdf")
                .contentBase64(base64Content)
                .exportType("PDF")
                .generatedAt(LocalDateTime.now())
                .recordCount(recordCount)
                .build();
    }
    
    /**
     * Create an Excel response
     */
    public static ExportResponse excel(String filename, String base64Content, int recordCount) {
        return ExportResponse.builder()
                .filename(filename)
                .mimeType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .contentBase64(base64Content)
                .exportType("EXCEL")
                .generatedAt(LocalDateTime.now())
                .recordCount(recordCount)
                .build();
    }
    
    /**
     * Create a CSV response
     */
    public static ExportResponse csv(String filename, String base64Content, int recordCount) {
        return ExportResponse.builder()
                .filename(filename)
                .mimeType("text/csv")
                .contentBase64(base64Content)
                .exportType("CSV")
                .generatedAt(LocalDateTime.now())
                .recordCount(recordCount)
                .build();
    }
}
