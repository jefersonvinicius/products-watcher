import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';

const logger = pino({
  level: isProd ? 'info' : 'debug',
  transport: isProd ? undefined : { target: 'pino-pretty', options: { colorize: true } },
});

type DurationTrackStart = {
  time: bigint;
};

type Duration = {
  start: bigint;
  end: bigint;
  elapsed: number;
};

const HOUR_IN_MILLI = 60 * 60 * 1000;
const MINUTE_IN_MILLI = 60 * 1000;
const SECOND_IN_MILLI = 1000;

const padStart = (n: number, length: number = 2) => n.toString().padStart(length, '0');

export const benchmark = {
  start: (): DurationTrackStart => ({ time: process.hrtime.bigint() }),
  end: (track: DurationTrackStart): Duration => {
    const end = process.hrtime.bigint();
    const duration = end - track.time; // nanoseconds
    const durationMilli = Number(duration) / 1e6; // milli
    return { start: track.time, end, elapsed: durationMilli };
  },
  format: (duration: Duration) => {
    const hours = Math.floor(duration.elapsed / HOUR_IN_MILLI);
    const rest = duration.elapsed % HOUR_IN_MILLI;
    const minutes = Math.floor(rest / MINUTE_IN_MILLI);
    const restSeconds = rest % MINUTE_IN_MILLI;
    const seconds = Math.floor(restSeconds / SECOND_IN_MILLI);
    const milli = Math.floor(restSeconds % SECOND_IN_MILLI);

    return `${padStart(hours)}h:${padStart(minutes)}m:${padStart(seconds)}s:${padStart(milli, 3)}ms`;
  },
};

export default logger;
