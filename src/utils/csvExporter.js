/**
 * Converts an array of objects into a CSV string.
 * @param {Array<Object>} data - The array of objects (rows) to export.
 * @param {Array<string>} headers - Optional array of column keys to include.
 * @returns {string} The CSV formatted data.
 */
 export function convertToCSV(data, headers = null) {
    if (!data || data.length === 0) {
      return '';
    }
  
    // Use all keys from the first object if headers are not provided
    const keys = headers || Object.keys(data[0]);
  
    // Escape special characters (like double quotes and new lines) and wrap in quotes if needed
    const escapeValue = (value) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      // If value contains a comma, double quote, or new line, wrap it in double quotes
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        // Escape double quotes by replacing them with two double quotes
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };
  
    // 1. Create the header row
    const headerRow = keys.join(',');
  
    // 2. Create the data rows
    const csvRows = data.map(row =>
      keys.map(key => escapeValue(row[key])).join(',')
    );
  
    return [headerRow, ...csvRows].join('\n');
  }
  
  /**
   * Triggers the file download in the browser.
   * @param {string} csvString - The CSV data as a string.
   * @param {string} filename - The name for the downloaded file.
   */
  export function downloadCSV(csvString, filename = 'export.csv') {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
  
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }