/**
 * ! Executing this script will seed your database with metrics.
 * ! Make sure to adjust the script to your needs.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getRandomDate(start: Date, end: Date): Date {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date;
}
function getRandomElement<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

async function main() {

  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1); // Set endDate to yesterday
  
  const startDate = new Date(endDate);
  startDate.setMonth(endDate.getMonth() - 1); // Set startDate to one month before endDate
  
  const NUMBER_OF_METRICS = 100000;
  const metricNames = ["PageLoad", "APIRequest", "Login", "Signup", "Search"];

  const metrics = Array.from({ length: NUMBER_OF_METRICS }, (_, index) => ({
    timestamp: getRandomDate(startDate, endDate),
    name: getRandomElement(metricNames),
    value: Math.random() * 100 + Math.random() * 10,
  }));

  await prisma.metric.createMany({
    data: metrics,
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
