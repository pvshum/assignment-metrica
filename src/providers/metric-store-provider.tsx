'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import {
  type MetricStore,
  createMetricStore,
  initMetricStore,
} from '@/stores/metric-store';

export type MetricStoreApi = ReturnType<typeof createMetricStore>

export const MetricStoreContext = createContext<MetricStoreApi | undefined>(
  undefined,
);

export interface MetricStoreProviderProps {
  children: ReactNode
}

  export const MetricStoreProvider = ({
  children,
}: MetricStoreProviderProps) => {
  const storeRef = useRef<MetricStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createMetricStore(initMetricStore());
  }

  return (
    <MetricStoreContext.Provider value={storeRef.current}>
      {children}
    </MetricStoreContext.Provider>
  );
};

export const useMetricStore = <T,>(
  selector: (store: MetricStore) => T,
): T => {
  const metricStoreContext = useContext(MetricStoreContext);

  if (!metricStoreContext) {
    throw new Error('useMetricStore must be used within MetricStoreProvider');
  }

  return useStore(metricStoreContext, selector);
};