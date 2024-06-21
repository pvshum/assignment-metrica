import type { AppProps } from 'next/app';
import { AppShell, Burger, createTheme, Group, MantineProvider, NavLink } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { IconHome2, IconChartDots2, IconSend } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { MetricStoreProvider } from '@/providers/metric-store-provider';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const theme = createTheme({});

export default function App({ Component, pageProps }: AppProps) {
  const [opened, { toggle }] = useDisclosure();

  const router = useRouter();

  return (
    <MantineProvider theme={theme} >
      <Notifications position='top-right' />
      <MetricStoreProvider>
        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              Metrica
            </Group>
          </AppShell.Header>
          <AppShell.Navbar p="md">
            <NavLink
              label="Home"
              leftSection={<IconHome2 size="1rem" stroke={1.5} />}
              onClick={() => {
                router.push('/');
              }}
              active={router.pathname === '/'}
            />
            <NavLink
              label="Submit"
              leftSection={<IconSend size="1rem" stroke={1.5} />}
              onClick={() => {
                router.push('/metric/submit');
              }}
              active={router.pathname === '/metric/submit'}
            />
            <NavLink
              label="Watch"
              leftSection={<IconChartDots2 size="1rem" stroke={1.5} />}
              onClick={() => {
                router.push('/metric/watch');
              }}
              active={router.pathname === '/metric/watch'}
            />
          </AppShell.Navbar>
          <AppShell.Main>
            <Component {...pageProps} />

          </AppShell.Main>
        </AppShell>
      </MetricStoreProvider>
    </MantineProvider>
  );
}
