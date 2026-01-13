import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions [{ key: 'field', label: 'Header' }]
 * @param {String} filename - Name of the file (without extension)
 */
export function exportToExcel(data, columns, filename = 'export') {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Prepare worksheet data
    const worksheetData = [
        // Header row
        columns.map(col => col.label)
    ];

    // Data rows
    data.forEach(item => {
        const row = columns.map(col => {
            const value = col.transform ? col.transform(item[col.key], item) : item[col.key];
            return value !== null && value !== undefined ? value : '';
        });
        worksheetData.push(row);
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const colWidths = columns.map((col, index) => {
        const maxLength = Math.max(
            col.label.length,
            ...data.map(item => {
                const value = col.transform ? col.transform(item[col.key], item) : item[col.key];
                return value ? String(value).length : 0;
            })
        );
        return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
    });
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${timestamp}.xlsx`;

    // Write file
    XLSX.writeFile(wb, fullFilename);
}
