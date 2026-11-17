const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Formats "YYYY", "YYYY-MM" or "YYYY-MM-DD" for display.
 * Parsed manually so the result never shifts with the viewer's time zone.
 */
export function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-");

  if (!month) return year;
  const monthName = MONTHS[Number(month) - 1] ?? month;

  return day ? `${Number(day)} ${monthName} ${year}` : `${monthName} ${year}`;
}

/** "1 item", "3 items". */
export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Turns any text into a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const RELEASE_DATE_PATTERN = /^\d{4}(-\d{2}){0,2}$/;

export const today = () => new Date().toISOString().slice(0, 10);
