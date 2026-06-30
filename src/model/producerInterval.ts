export interface ProducerIntervalProps {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export class ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;

  constructor({
    producer,
    interval,
    previousWin,
    followingWin,
  }: ProducerIntervalProps) {
    this.producer = producer;
    this.interval = interval;
    this.previousWin = previousWin;
    this.followingWin = followingWin;
  }
}
