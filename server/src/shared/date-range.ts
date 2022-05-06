import { Clock } from '@app/shared/clock';
import { isAfter, isBefore, subMonths, subWeeks } from 'date-fns';

export enum DateRangeFilter {
  LastMonth = '1month',
  Last3Months = '3months',
  LastWeek = '1week',
}

export class DateRange {
  private static filterToRangeMakers: { [key in DateRangeFilter]: (() => DateRange) | undefined } = {
    [DateRangeFilter.LastMonth]: () => new DateRange(subMonths(Clock.current(), 1), Clock.current()),
    [DateRangeFilter.LastWeek]: () => new DateRange(subWeeks(Clock.current(), 1), Clock.current()),
    [DateRangeFilter.Last3Months]: () => new DateRange(subMonths(Clock.current(), 3), Clock.current()),
  };

  private constructor(readonly startAt: Date, readonly endAt: Date) {}

  static fromFilter(filter: DateRangeFilter) {
    const makeRange = this.filterToRangeMakers[filter];
    if (!makeRange) {
      const fallbackMaker = this.filterToRangeMakers[DateRangeFilter.LastMonth]!;
      return fallbackMaker();
    }
    return makeRange();
  }

  within(date: Date) {
    return isAfter(date, this.startAt) && isBefore(date, this.endAt);
  }
}
