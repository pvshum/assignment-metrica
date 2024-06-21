import { RESPONSE_MESSAGES } from '@/constants';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export type Interval = 'minute' | 'hour' | 'day';
export type Aggregate = 'avg' | 'max' | 'count';


export interface Metric {
  time: string;
  avg?: number;
  max?: number;
  count?: number;
}
export interface GetAverageMetricsResponse {
  name: string;
  aggregate: Aggregate;
  interval: Interval;
  metrics: Metric[] | [];
}

export interface GetAverageMetricsRequest {
  name: string;
  aggregate: Aggregate;
  interval?: Interval;
  timeFrom?: string;
  timeTo?: string;
}

type GetAverageMetrics = (params: GetAverageMetricsRequest) => Promise<Metric[]>;

const getAverageMetrics: GetAverageMetrics = async ({
  name,
  aggregate,
  interval,
  timeFrom,
  timeTo,
}) => {

  const aggregateQuery = (aggregate: Aggregate) => {
    switch (aggregate) {
      case 'avg':
        return 'AVG("value") AS avg';
      case 'max':
        return 'MAX("value") AS max';
      case 'count':
        // casting to String as BigIng is not JSON serialisable
        return 'CAST(COUNT("value") AS TEXT) AS count';
      default:
        return '';
    }
  };
  const aggregateQueryString = aggregateQuery(aggregate);

  // adding 1 day to ensure the timeTo is inclusive
  const adjustedTimeTo = timeTo ? new Date(new Date(timeTo).getTime() + 24 * 60 * 60 * 1000) : undefined;

  const result = await prisma.$queryRaw<Metric[] | []>`
    SELECT
      DATE_TRUNC(${Prisma.sql`${interval}`}, "timestamp") AS time,
      ${Prisma.raw(aggregateQueryString)}
    FROM
      "Metric"
    WHERE
      "name" = ${name}
      ${timeFrom ? Prisma.sql`AND "timestamp" >= ${new Date(timeFrom)}` : Prisma.sql``}
      ${adjustedTimeTo ? Prisma.sql`AND "timestamp" <= ${adjustedTimeTo}` : Prisma.sql``}
    GROUP BY
      time
    ORDER BY
      time ASC
  `;
  return result;
};


const getMetrics = async (req: NextApiRequest, res: NextApiResponse) => {
  const DEFAULT_AGGREGATE = 'avg';
  const DEFAULT_INTERVAL = 'day';

  const {
    name,
    aggregate = DEFAULT_AGGREGATE,
    interval = DEFAULT_INTERVAL,
    timeFrom,
    timeTo,
  } = req.query as Partial<GetAverageMetricsRequest>;

  if (!name) {
    return res.status(400).json({ error: RESPONSE_MESSAGES.EMPTY_METRIC_NAME });
  }

  const metrics = await getAverageMetrics({ name, aggregate, interval, timeFrom, timeTo });

  const response: GetAverageMetricsResponse = { name, aggregate, interval, metrics };

  res.status(200).json(response);
};

export interface PostMetric {
  name: string;
  value: number;
  timestamp?: string;
}

const createMetric = async (req: NextApiRequest, res: NextApiResponse) => {
  const { 
    name,
    value,
    timestamp,
  } = req.body as PostMetric;

  if (!name) {
    return res.status(400).json({ error: RESPONSE_MESSAGES.EMPTY_METRIC_NAME });
  }
  if (!value) {
    return res.status(400).json({ error: RESPONSE_MESSAGES.EMPTY_METRIC_VALUE });
  }

  const data = {
    name,
    value: typeof value === 'string' ? parseFloat(value) : value,
    timestamp: timestamp ? new Date(timestamp) : undefined,
  };

  const metric = await prisma.metric.create({
    data,
  });
  res.status(200).json(metric);
};

export default function processRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === 'GET') {
    return getMetrics(req, res);
  }

  if (req.method === 'POST') {
    return createMetric(req, res);
  }

  return res.status(405).json({ error: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED });
}
