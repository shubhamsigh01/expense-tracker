/**
 * Checks if a given date string is within the current month and year.
 */
export function isCurrentMonth(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 * Returns a short month name (e.g., 'Jan') for a given month index.
 */
export function getShortMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'short' });
}

/**
 * Checks if a given date string matches a specific month and year.
 */
export function isSameMonth(dateStr: string, month: number, year: number): boolean {
  const date = new Date(dateStr);
  return date.getMonth() === month && date.getFullYear() === year;
}

/**
 * Formats a date string for display (e.g., 'Oct 12').
 */
export function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
