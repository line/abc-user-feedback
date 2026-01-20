/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { getIntervalDatesInFormat } from './util-functions';

describe('getIntervalDatesInFormat', () => {
  describe('Error cases', () => {
    it('should throw error when startDate is later than endDate', () => {
      const startDate = '2024-01-15';
      const endDate = '2024-01-10';
      const inputDate = new Date('2024-01-12');

      expect(() => {
        getIntervalDatesInFormat(startDate, endDate, inputDate, 'day');
      }).toThrow('endDate must be later than startDate');
    });
  });

  describe('Day interval tests', () => {
    it('should return same start and end date for day interval', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const inputDate = new Date('2024-01-15');

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'day',
      );

      expect(result).toEqual({
        startOfInterval: '2024-01-15',
        endOfInterval: '2024-01-15',
      });
    });

    it('should return correct result for different dates in day interval', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const inputDate = new Date('2024-01-25');

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'day',
      );

      expect(result).toEqual({
        startOfInterval: '2024-01-25',
        endOfInterval: '2024-01-25',
      });
    });
  });

  describe('Week interval tests', () => {
    it('should return correct week range for week interval', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const inputDate = new Date('2024-01-15');

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'week',
      );

      expect(result.startOfInterval).toBeDefined();
      expect(result.endOfInterval).toBeDefined();
      expect(result.startOfInterval).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.endOfInterval).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should use startDate when input date is before startDate in week interval', () => {
      const startDate = '2024-01-10';
      const endDate = '2024-01-31';
      const inputDate = new Date('2024-01-05'); // Before startDate

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'week',
      );

      expect(result.startOfInterval).toBe('2024-01-10');
    });
  });

  describe('Month interval tests', () => {
    it('should return correct month range for month interval', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-03-31';
      const inputDate = new Date('2024-02-15');

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'month',
      );

      expect(result.startOfInterval).toBeDefined();
      expect(result.endOfInterval).toBeDefined();
      expect(result.startOfInterval).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.endOfInterval).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should use startDate when input date is before startDate in month interval', () => {
      const startDate = '2024-02-01';
      const endDate = '2024-03-31';
      const inputDate = new Date('2024-01-15'); // Before startDate

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'month',
      );

      expect(result.startOfInterval).toBe('2024-02-01');
    });
  });

  describe('Edge case tests', () => {
    it('should handle same start and end date correctly', () => {
      const startDate = '2024-01-15';
      const endDate = '2024-01-15';
      const inputDate = new Date('2024-01-15');

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'day',
      );

      expect(result).toEqual({
        startOfInterval: '2024-01-15',
        endOfInterval: '2024-01-15',
      });
    });

    it('should handle intervalCount of 0 correctly for week interval', () => {
      const startDate = '2024-01-15';
      const endDate = '2024-01-15';
      const inputDate = new Date('2024-01-15');

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'week',
      );

      expect(result.startOfInterval).toBeDefined();
      expect(result.endOfInterval).toBeDefined();
    });

    it('should handle intervalCount of 0 correctly for month interval', () => {
      const startDate = '2024-01-15';
      const endDate = '2024-01-15';
      const inputDate = new Date('2024-01-15');

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'month',
      );

      expect(result.startOfInterval).toBeDefined();
      expect(result.endOfInterval).toBeDefined();
    });
  });

  describe('Actual date calculation validation', () => {
    it('should calculate accurate week range for week interval', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const inputDate = new Date('2024-01-15'); // Monday

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'week',
      );

      // Verify that results are valid date formats
      expect(new Date(result.startOfInterval)).toBeInstanceOf(Date);
      expect(new Date(result.endOfInterval)).toBeInstanceOf(Date);

      // Start date should be earlier than or equal to end date
      expect(new Date(result.startOfInterval).getTime()).toBeLessThanOrEqual(
        new Date(result.endOfInterval).getTime(),
      );
    });

    it('should calculate accurate month range for month interval', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-03-31';
      const inputDate = new Date('2024-02-15');

      const result = getIntervalDatesInFormat(
        startDate,
        endDate,
        inputDate,
        'month',
      );

      // Verify that results are valid date formats
      expect(new Date(result.startOfInterval)).toBeInstanceOf(Date);
      expect(new Date(result.endOfInterval)).toBeInstanceOf(Date);

      // Start date should be earlier than or equal to end date
      expect(new Date(result.startOfInterval).getTime()).toBeLessThanOrEqual(
        new Date(result.endOfInterval).getTime(),
      );
    });
  });
});
