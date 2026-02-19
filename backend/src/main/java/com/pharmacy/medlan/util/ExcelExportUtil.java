package com.pharmacy.medlan.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class ExcelExportUtil {

    /**
     * Create an Excel workbook from headers and data rows
     *
     * @param sheetName name of the worksheet
     * @param headers   column headers
     * @param data      list of rows, each row being a list of cell values
     * @return byte array of the Excel file
     */
    public byte[] exportToExcel(String sheetName, List<String> headers, List<List<Object>> data) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(sheetName);

            // Create header style
            CellStyle headerStyle = createHeaderStyle(workbook);

            // Create header row
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.size(); i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers.get(i));
                cell.setCellStyle(headerStyle);
            }

            // Create data rows
            for (int rowIdx = 0; rowIdx < data.size(); rowIdx++) {
                Row row = sheet.createRow(rowIdx + 1);
                List<Object> rowData = data.get(rowIdx);
                for (int colIdx = 0; colIdx < rowData.size(); colIdx++) {
                    Cell cell = row.createCell(colIdx);
                    setCellValue(cell, rowData.get(colIdx));
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.size(); i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            log.error("Error generating Excel file", e);
            throw new RuntimeException("Failed to generate Excel file", e);
        }
    }

    /**
     * Export a list of maps to Excel
     */
    public byte[] exportMapsToExcel(String sheetName, List<String> headers,
                                     List<String> keys, List<Map<String, Object>> data) {
        List<List<Object>> rows = data.stream()
                .map(map -> keys.stream()
                        .map(key -> map.getOrDefault(key, ""))
                        .collect(java.util.stream.Collectors.toList()))
                .collect(java.util.stream.Collectors.toList());
        return exportToExcel(sheetName, headers, rows);
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private void setCellValue(Cell cell, Object value) {
        if (value == null) {
            cell.setCellValue("");
        } else if (value instanceof Number) {
            cell.setCellValue(((Number) value).doubleValue());
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else if (value instanceof java.time.LocalDate) {
            cell.setCellValue(((java.time.LocalDate) value).toString());
        } else if (value instanceof java.time.LocalDateTime) {
            cell.setCellValue(((java.time.LocalDateTime) value).toString());
        } else {
            cell.setCellValue(value.toString());
        }
    }
}
