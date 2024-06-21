import { aggregatesMap, formatChartLabelDate } from '@/helpers';
import type { Interval } from '@/pages/api/metric';
import { Paper, Text } from '@mantine/core';

interface ChartTooltipProps {
  label: string;
  payload: Record<string, any>[] | undefined;
  interval: Interval | undefined;
}

export function ChartTooltip({ label, payload, interval }: ChartTooltipProps) {
  if (!payload) return null;

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      <Text fz="sm">{formatChartLabelDate(label, interval)}</Text>
      {payload.map((item: any) => (
        <Text key={item.name} c={item.color} fz="sm">
          {aggregatesMap[item.name] || 'Value'}:{' '}
          {item.name === 'count' ? item.value : Number(item.value).toFixed(2)}
        </Text>
      ))}
    </Paper>
  );
}
