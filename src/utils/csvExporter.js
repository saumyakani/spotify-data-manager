
 export function convertToCSV(data, headers = null) {
    if (!data || data.length === 0) {
      return '';
    }
  
 
    const keys = headers || Object.keys(data[0]);
  
 
    const escapeValue = (value) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
   
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {

        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };
  

    const headerRow = keys.join(',');
  

    const csvRows = data.map(row =>
      keys.map(key => escapeValue(row[key])).join(',')
    );
  
    return [headerRow, ...csvRows].join('\n');
  }

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