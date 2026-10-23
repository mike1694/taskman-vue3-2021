import type { DateOptions } from '@/types/DateOptions';

export const dateOptions: DateOptions = {
  weekday: 'long',
  day: 'numeric',
  // year: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: 'numeric',
};

export function getFormatDateTime(
  date: Date,
  options?: DateOptions,
): string {
  return new Intl.DateTimeFormat(
    undefined,
    options ? options : dateOptions,
  ).format(date);
}
