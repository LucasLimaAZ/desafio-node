import { getWinnerRows } from "../repository/winsRepository";
import { ProducerInterval } from "../model/producerInterval";

export interface ProducerService {
  getProducerIntervals: () => Promise<{
    min: ProducerInterval[];
    max: ProducerInterval[];
  }>;
}

type WinnerRow = {
  producer: string;
  year: number;
};

function toProducerInterval(
  producer: string,
  previousWin: number,
  followingWin: number,
): ProducerInterval {
  return new ProducerInterval({
    producer,
    interval: followingWin - previousWin,
    previousWin,
    followingWin,
  });
}

export async function getProducerIntervals(db: any) {
  const rows = (await getWinnerRows(db)) as WinnerRow[];
  const min: ProducerInterval[] = [];
  const max: ProducerInterval[] = [];
  let minInterval: number | null = null;
  let maxInterval: number | null = null;
  const lastWins = new Map<string, number>();

  for (const row of rows) {
    const previousWin = lastWins.get(row.producer);

    if (previousWin !== undefined) {
      const interval = row.year - previousWin;
      const candidate = toProducerInterval(row.producer, previousWin, row.year);

      if (minInterval === null || interval < minInterval) {
        minInterval = interval;
        min.length = 0;
        min.push(candidate);
      } else if (interval === minInterval) {
        min.push(candidate);
      }

      if (maxInterval === null || interval > maxInterval) {
        maxInterval = interval;
        max.length = 0;
        max.push(candidate);
      } else if (interval === maxInterval) {
        max.push(candidate);
      }
    }

    lastWins.set(row.producer, row.year);
  }

  return { min, max };
}

export function createProducerService(db: any): ProducerService {
  return {
    getProducerIntervals: () => getProducerIntervals(db),
  };
}
