import { format as dateFnsFormat, parseISO } from 'date-fns';

export function formatDateWithPattern(date: string | undefined, pattern: string = 'yyyy-MM-dd HH:mm'): string {
  if (!date) return '—';
  try {
    return dateFnsFormat(parseISO(date), pattern);
  } catch {
    return date;
  }
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function isValidDate(dateString: string): boolean {
  try {
    const date = parseISO(dateString);
    return !Number.isNaN(date.getTime());
  } catch {
    return false;
  }
}
