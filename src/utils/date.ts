/**
 * Formats a date string to dot notation format (YYYY.MM.DD)
 * Example: "2025-12-13" -> "2025.12.13"
 */
export function formatDateDotNotation(dateString: string): string {
  return new Date(dateString)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");
}

/**
 * Formats a date string to long format (Month Day, Year)
 * Example: "2025-12-13" -> "December 13, 2025"
 */
export function formatDateLong(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
