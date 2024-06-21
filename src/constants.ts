export const RESPONSE_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  EMPTY_METRIC_NAME: 'Metric name is required',
  EMPTY_METRIC_VALUE: 'Metric value is required',
};

export const aggregateOptions = [
  { value: 'avg', label: 'Average' },
  { value: 'count', label: 'Count' },
  { value: 'max', label: 'Max' },
];

export const intervalOptions = [
  { value: 'minute', label: 'Minute' },
  { value: 'hour', label: 'Hour' },
  { value: 'day', label: 'Day' },
];

// Ideally this would be fetched from the backend
export const metricNameOptions = ['PageLoad', 'APIRequest', 'Login', 'Signup', 'Search'];