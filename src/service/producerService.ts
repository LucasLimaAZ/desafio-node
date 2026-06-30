import { getWinnerRows } from "../repository/winsRepository";
import { ProducerInterval } from "../model/producerInterval";

export interface ProducerService {
  getProducerIntervals: () => Promise<{
    min: ProducerInterval[];
    max: ProducerInterval[];
  }>;
}

function buildIntervals(rows: Array<{ producer: string; year: number }>) {
  const producerMap = new Map<string, number[]>();

  for (const row of rows) {
    if (!producerMap.has(row.producer)) {
      producerMap.set(row.producer, []);
    }
    producerMap.get(row.producer)?.push(row.year);
  }

  const intervals: ProducerInterval[] = [];
  for (const [producer, years] of producerMap.entries()) {
    for (let i = 1; i < years.length; i += 1) {
      intervals.push(
        new ProducerInterval({
          producer,
          interval: years[i] - years[i - 1],
          previousWin: years[i - 1],
          followingWin: years[i],
        }),
      );
    }
  }

  return intervals;
}

export async function getProducerIntervals(db: any) {
  const rows = await getWinnerRows(db);
  const intervals = buildIntervals(rows);

  if (intervals.length === 0) {
    return { min: [], max: [] };
  }

  const minInterval = Math.min(...intervals.map((item) => item.interval));
  const maxInterval = Math.max(...intervals.map((item) => item.interval));

  return {
    min: intervals.filter((item) => item.interval === minInterval),
    max: intervals.filter((item) => item.interval === maxInterval),
  };
}

export function createProducerService(db: any): ProducerService {
  return {
    getProducerIntervals: () => getProducerIntervals(db),
  };
}
