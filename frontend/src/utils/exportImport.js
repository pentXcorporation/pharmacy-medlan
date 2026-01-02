/**
 * Export/Import Utilities
 * Helper functions for exporting data to CSV/Excel and importing data
 */

/**
 * Convert JSON array to CSV string
 */
export const jsonToCSV = (data, headers = null) => {
  if (!data || data.length === 0) {
    return "";
  }

  // Extract headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Create header row
  const headerRow = csvHeaders.join(",");

  // Create data rows
  const dataRows = data.map((row) => {
    return csvHeaders
      .map((header) => {
        let value = row[header];

        // Handle nested objects (e.g., category.categoryName)
        if (header.includes(".")) {
          const keys = header.split(".");
          value = keys.reduce((obj, key) => obj?.[key], row);
        }

        // Handle null/undefined
        if (value === null || value === undefined) {
          return "";
        }

        // Handle objects/arrays
        if (typeof value === "object") {
          value = JSON.stringify(value);
        }

        // Escape quotes and wrap in quotes if contains comma, newline, or quote
        value = String(value).replace(/"/g, '""');
        if (
          value.includes(",") ||
          value.includes("\n") ||
          value.includes('"')
        ) {
          return `"${value}"`;
        }

        return value;
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
};

/**
 * Download data as CSV file
 */
export const downloadCSV = (data, filename = "export.csv", headers = null) => {
  const csv = jsonToCSV(data, headers);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
};

/**
 * Download data as JSON file
 */
export const downloadJSON = (data, filename = "export.json") => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  downloadBlob(blob, filename);
};

/**
 * Download blob as file
 */
const downloadBlob = (blob, filename) => {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Parse CSV string to JSON array
 */
export const csvToJSON = (csv) => {
  const lines = csv.split("\n").filter((line) => line.trim());

  if (lines.length === 0) {
    return [];
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);

  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }

  return data;
};

/**
 * Parse a single CSV line handling quoted values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current);

  return result;
};

/**
 * Read file as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

/**
 * Validate CSV file structure
 */
export const validateCSV = (data, requiredFields = []) => {
  if (!data || data.length === 0) {
    return { valid: false, error: "File is empty" };
  }

  const headers = Object.keys(data[0]);

  // Check for required fields
  const missingFields = requiredFields.filter(
    (field) => !headers.includes(field)
  );

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  return { valid: true };
};

/**
 * Download data from API response
 * Handles both direct data and blob responses
 */
export const downloadFromResponse = (response, filename) => {
  // If response is a blob
  if (response.data instanceof Blob) {
    downloadBlob(response.data, filename);
    return;
  }

  // If response contains file data
  if (response.headers["content-type"]?.includes("text/csv")) {
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, filename);
    return;
  }

  // Default to JSON download
  downloadJSON(response.data, filename);
};

/**
 * Create FormData for file upload
 */
export const createFileFormData = (file, fieldName = "file", additionalData = {}) => {
  const formData = new FormData();
  formData.append(fieldName, file);

  // Add additional data
  Object.keys(additionalData).forEach((key) => {
    const value = additionalData[key];
    if (value !== null && value !== undefined) {
      formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
    }
  });

  return formData;
};
