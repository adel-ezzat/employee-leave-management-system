/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string or date string
 * @param {string} format - 'short' (YYYY-MM-DD) or 'long' (Jan 20, 2026)
 * @returns {string} Formatted date
 */
export function formatDate(dateString, format = 'short') {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        // If it's already in YYYY-MM-DD format, return as is
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }
        return dateString;
    }
    
    if (format === 'long') {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // Short format: YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * Format a date range
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {string} Formatted date range
 */
export function formatDateRange(startDate, endDate) {
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);
    return `${formattedStart} - ${formattedEnd}`;
}


