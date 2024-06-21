import Head from 'next/head';
import { useMetricStore } from '@/providers/metric-store-provider';
import { Group, Loader, Title, Text, SegmentedControl, Select, Button, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { BarChart } from '@mantine/charts';
import type { Aggregate, GetAverageMetricsRequest, Interval } from '@/pages/api/metric';
import { formatXAxisDate } from '@/helpers';
import { ChartTooltip } from '@/components/ChartTooltip';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { IconRefresh } from '@tabler/icons-react';
import { aggregateOptions, intervalOptions, metricNameOptions } from '@/constants';

import '@mantine/charts/styles.css';
import '@mantine/charts/styles.layer.css';
import '@mantine/dates/styles.css';

export default function MetricsWatch() {

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [minMaxDates, setMinMaxDates] = useState<{ min: Date | undefined, max: Date | undefined }>({ min: undefined, max: undefined });

  const [params, setParams] = useState<GetAverageMetricsRequest>({
    name: 'PageLoad',
    aggregate: 'avg',
    interval: 'day',
  });

  const {
    data, error, dataLoading,
    fetchMetrics,
  } = useMetricStore((state) => state);

  const fetchData = async () => {
    const data = await fetchMetrics(params);
    if (isFirstLoad) {
      setMinMaxDates({
        min: new Date(data.metrics[0].time),
        max: new Date(data.metrics[data.metrics.length - 1].time),
      });
    }
    setIsFirstLoad(false);
  };

  useEffect(() => {
    fetchData();
  }, [params]);



  return (
    <>
      <Head>
        <title>Metrica: Watch</title>
      </Head>
      <main>

        <Title order={1} mb="md">Watch</Title>

        <Group mb="lg" justify='space-between'>
          <Group>
            <Select
              label="Metric Name"
              value={params.name}
              onChange={(value) => value ? setParams({ ...params, name: value }) : null}
              data={metricNameOptions}
            />
            <Select
              label="Aggregate"
              value={params.aggregate}
              onChange={(value) => setParams({ ...params, aggregate: value as Aggregate })}
              data={aggregateOptions}
            />
            <Text size="sm" mt={24}>by</Text>
            <SegmentedControl
              mt={24}
              data={intervalOptions}
              value={params.interval}
              onChange={(value) => setParams({ ...params, interval: value as Interval })}
            />
          </Group>

          <Group>
            <DatePickerInput
              label="From"
              placeholder="Start date and time"
              clearable
              onChange={(value) => setParams({ ...params, timeFrom: value ? dayjs(value).format('YYYY-MM-DD') : undefined })}
              minDate={minMaxDates.min}
              maxDate={minMaxDates.max}
            />
            <DatePickerInput
              label="To"
              placeholder="End date and time"
              clearable
              onChange={(value) => setParams({ ...params, timeTo: value ? dayjs(value).format('YYYY-MM-DD') : undefined })}
              minDate={minMaxDates.min}
              maxDate={minMaxDates.max}
            />
          </Group>
        </Group>



        {!data || !data.metrics.length || dataLoading
          ? <Loader />
          :
          <BarChart
            h={300}
            my='xl'
            data={data.metrics}
            dataKey="time"
            series={[{ name: params.aggregate }]}
            tickLine="x"
            valueFormatter={(value) => value.toFixed(2)}
            xAxisProps={{
              tickFormatter: formatXAxisDate,
            }}
            tooltipProps={{
              content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} interval={params.interval} />,
            }}
          />
        }

        {!dataLoading
          ? <Button onClick={fetchData} leftSection={<IconRefresh size={16} />} size='xs'>Refresh</Button>
          : null
        }
      </main>
    </>
  );
}
