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
import { DateTime } from 'luxon';

import {
  calculateDaysBetweenDates,
  getCurrentDay,
  getCurrentMonth,
  getCurrentYear,
} from './date-utils';

describe('date-utils', () => {
  describe('calculateDaysBetweenDates', () => {
    it('should calculate days between two dates correctly', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-10';

      const result = calculateDaysBetweenDates(startDate, endDate);

      expect(result).toBe(9);
    });

    it('should return 0 when dates are the same', () => {
      const date = '2024-01-01';

      const result = calculateDaysBetweenDates(date, date);

      expect(result).toBe(0);
    });

    it('should return negative number when end date is before start date', () => {
      const startDate = '2024-01-10';
      const endDate = '2024-01-01';

      const result = calculateDaysBetweenDates(startDate, endDate);

      expect(result).toBe(-9);
    });

    it('should handle leap year correctly', () => {
      const startDate = '2024-02-28';
      const endDate = '2024-03-01';

      const result = calculateDaysBetweenDates(startDate, endDate);

      expect(result).toBe(2);
    });

    it('should handle different months correctly', () => {
      const startDate = '2024-01-31';
      const endDate = '2024-02-01';

      const result = calculateDaysBetweenDates(startDate, endDate);

      expect(result).toBe(1);
    });

    it('should handle different years correctly', () => {
      const startDate = '2023-12-31';
      const endDate = '2024-01-01';

      const result = calculateDaysBetweenDates(startDate, endDate);

      expect(result).toBe(1);
    });
  });

  describe('getCurrentYear', () => {
    it('should return current year', () => {
      const result = getCurrentYear();
      const expectedYear = DateTime.now().year;

      expect(result).toBe(expectedYear);
    });

    it('should return a valid year number', () => {
      const result = getCurrentYear();

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(2000);
      expect(result).toBeLessThan(3000);
    });
  });

  describe('getCurrentMonth', () => {
    it('should return current month', () => {
      const result = getCurrentMonth();
      const expectedMonth = DateTime.now().month;

      expect(result).toBe(expectedMonth);
    });

    it('should return a valid month number (1-12)', () => {
      const result = getCurrentMonth();

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(12);
    });
  });

  describe('getCurrentDay', () => {
    it('should return current day', () => {
      const result = getCurrentDay();
      const expectedDay = DateTime.now().day;

      expect(result).toBe(expectedDay);
    });

    it('should return a valid day number (1-31)', () => {
      const result = getCurrentDay();

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(31);
    });
  });
});
