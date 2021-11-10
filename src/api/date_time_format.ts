import IDateOptions from '@/types/IDateOptions';

export const dateOptions: IDateOptions = {
  weekday: 'long',
  day: 'numeric',
  // year: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: 'numeric'
};

export function getFormatDateTime(
  date: Date,
  options?: IDateOptions): string {
    
  return new Intl
    .DateTimeFormat(undefined, options ? options : dateOptions)
    .format(date);
}