import { Clock } from '@app/shared/clock';
import { DateRange, DateRangeFilter } from '@app/shared/date-range';

describe('DateRange', () => {
  describe('when creating from filter', () => {
    it('should return last month range correctly', async () => {
      jest.spyOn(Clock, 'current').mockReturnValue(new Date('2022-11-23T10:10:00.000Z'));
      const dateRange = DateRange.fromFilter(DateRangeFilter.LastMonth);

      expect(dateRange.startAt).toStrictEqual(new Date('2022-10-23T10:10:00.000Z'));
      expect(dateRange.endAt).toStrictEqual(new Date('2022-11-23T10:10:00.000Z'));
    });

    it('should return last week range correctly', async () => {
      jest.spyOn(Clock, 'current').mockReturnValue(new Date('2022-11-23T10:10:00.000Z'));
      const dateRange = DateRange.fromFilter(DateRangeFilter.LastWeek);

      expect(dateRange.startAt).toStrictEqual(new Date('2022-11-16T10:10:00.000Z'));
      expect(dateRange.endAt).toStrictEqual(new Date('2022-11-23T10:10:00.000Z'));
    });

    it('should return last tree months range correctly', async () => {
      jest.spyOn(Clock, 'current').mockReturnValue(new Date('2022-11-23T10:10:00.000Z'));
      const dateRange = DateRange.fromFilter(DateRangeFilter.Last3Months);

      expect(dateRange.startAt).toStrictEqual(new Date('2022-08-23T10:10:00.000Z'));
      expect(dateRange.endAt).toStrictEqual(new Date('2022-11-23T10:10:00.000Z'));
    });

    it('should return last month as fallback when is invalid filter', () => {
      jest.spyOn(Clock, 'current').mockReturnValue(new Date('2022-11-23T10:10:00.000Z'));
      const dateRange = DateRange.fromFilter('any' as DateRangeFilter);

      expect(dateRange.startAt).toStrictEqual(new Date('2022-10-23T10:10:00.000Z'));
      expect(dateRange.endAt).toStrictEqual(new Date('2022-11-23T10:10:00.000Z'));
    });
  });

  describe('when calling within', () => {
    it('should return true when within the range', () => {
      jest.spyOn(Clock, 'current').mockReturnValue(new Date('2022-11-23T10:10:00.000Z'));

      const dateRange = DateRange.fromFilter(DateRangeFilter.LastMonth);

      expect(dateRange.within(new Date('2022-11-23T09:10:10.000Z'))).toBe(true);
      expect(dateRange.within(new Date('2022-11-22T09:10:10.000Z'))).toBe(true);
      expect(dateRange.within(new Date('2022-10-23T10:10:11.000Z'))).toBe(true);
      expect(dateRange.within(new Date('2022-11-01T09:10:10.000Z'))).toBe(true);
    });

    it('should return true when is not within the range', () => {
      jest.spyOn(Clock, 'current').mockReturnValue(new Date('2022-11-23T10:10:00.000Z'));

      const dateRange = DateRange.fromFilter(DateRangeFilter.LastMonth);

      expect(dateRange.within(new Date('2022-11-23T10:11:10.000Z'))).toBe(false);
      expect(dateRange.within(new Date('2022-09-22T09:10:10.000Z'))).toBe(false);
      expect(dateRange.within(new Date('2022-11-23T10:10:10.000Z'))).toBe(false);
      expect(dateRange.within(new Date('2022-10-22T23:59:10.000Z'))).toBe(false);
    });
  });
});
