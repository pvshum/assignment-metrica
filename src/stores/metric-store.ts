import { createStore } from 'zustand/vanilla';
import axios, { AxiosError } from 'axios';
import type { GetAverageMetricsRequest, GetAverageMetricsResponse, PostMetric } from '@/pages/api/metric';
import dayjs from 'dayjs';

export type MetricState = {
  data: GetAverageMetricsResponse | null
  dataLoading: boolean
  submitInProgress: boolean
  error: string | null
}

export type MetricActions = {
  fetchMetrics: (params: GetAverageMetricsRequest) => Promise<GetAverageMetricsResponse>
  submitMetric: (params: PostMetric) => Promise<GetAverageMetricsResponse>
}

export type MetricStore = MetricState & MetricActions

export const initMetricStore = (): MetricState => {
  return {
    data: null,
    dataLoading: false,
    submitInProgress: false,
    error: null,
  };
};

export const defaultInitState: MetricState = {
  data: null,
  dataLoading: false,
  submitInProgress: false,
  error: null,
};

export const createMetricStore = (
  initState: MetricState = defaultInitState,
) => {
  return createStore<MetricStore>()((set) => ({
    ...initState,

    fetchMetrics: async (params: GetAverageMetricsRequest) => {
      set({ dataLoading: true });
      const url = '/api/metric';
      try {
        const response = await axios.get(url, { params });
        set({ data: response.data, error: null, dataLoading: false });
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          set({ data: null, error: error.message, dataLoading: false });
        } else {
          set({ data: null, error: 'An unknown error occurred', dataLoading: false });
        }
        return null;
      }
    },
    
    submitMetric: async (params: PostMetric) => {
      set({ submitInProgress: true });
      const url = '/api/metric';
      try {
        const response = await axios.post(url, params);
        set({ submitInProgress: false });
        return response.data;
      } catch (error) {
        console.error(error);
        set({ submitInProgress: false });
        return null;
      }
    },
  }));
};