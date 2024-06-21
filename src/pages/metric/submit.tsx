import { metricNameOptions } from '@/constants';
import { Button, Group, Select, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import Head from 'next/head';

import '@mantine/dates/styles.css';
import { useMetricStore } from '@/providers/metric-store-provider';

export default function MetricsSubmit() {

  const {
    submitInProgress,
    submitMetric,
  } = useMetricStore((state) => state);

  type FormValues = {
    name: string;
    timestamp: string;
    value: string;
  }
  const form = useForm({
    initialValues: {
      name: metricNameOptions[0],
      timestamp: new Date().toISOString(),
      value: '',
    },

    validate: {
      name: (value) => value ? null : 'Metric name is required',
      timestamp: (value) => value ? null : 'Timestamp is required',
      value: (value) => value ? null : 'Value is required',
    },
  });

  const formSubmitHandler = form.onSubmit(async (values) => {
    const { name, timestamp, value } = values;
    
    // need to convert value to float as the form returns it as a string
    await submitMetric({ name, timestamp, value: parseFloat(value) });
    
    form.reset();

    notifications.show({
      title: 'Metric submitted',
      message: 'Navage to Watch page to see it',
      color: 'green',
    });
  });

  return (
    <>
      <Head>
        <title>Metrica: Submit</title>
      </Head>
      <main>

        <Title order={1} mb="md">Submit</Title>

        <Group>
          <form onSubmit={formSubmitHandler}>

            <Select
              label="Metric Name"
              placeholder="Select metric name"
              data={metricNameOptions}
              {...form.getInputProps('name')}
              mb="md"
              disabled={submitInProgress}
            />

            <TextInput
              label="Value"
              placeholder="Enter value"
              {...form.getInputProps('timestamp')}
              mb="md"
              w={220}
              disabled={submitInProgress}
            />

            <TextInput
              label="Value"
              placeholder="Enter value"
              {...form.getInputProps('value')}
              mb="md"
              disabled={submitInProgress}
            />
            <Button type="submit" size="xs" loading={submitInProgress}>Submit</Button>
          </form>
        </Group>

      </main>
    </>
  );
}
