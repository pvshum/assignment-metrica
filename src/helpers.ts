import type { Interval } from '@/pages/api/metric';

export const formatXAxisDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' });

export const formatChartLabelDate = (value: string, interval: Interval | undefined) => {
  const date = new Date(value);
  const dayFormat = { month: 'numeric', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions;
  if (interval === 'minute') {
    return date.toLocaleTimeString([], { ...dayFormat, hour: '2-digit', minute: '2-digit' });
  }
  if (interval === 'hour') {
    return date.toLocaleTimeString([], { ...dayFormat, hour: '2-digit', minute: '2-digit' });
  }
  if (interval === 'day') {
    return date.toLocaleDateString([], { ...dayFormat });
  }
  return value;
};



export const aggregatesMap: Record<string, string> = {
  avg: 'Average',
  count: 'Count',
  max: 'Maximum',
};