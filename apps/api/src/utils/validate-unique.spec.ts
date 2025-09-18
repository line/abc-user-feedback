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
import { validateUnique } from './validate-unique';

describe('validate-unique', () => {
  describe('validateUnique', () => {
    interface TestObject {
      id: number;
      name: string;
      value: string;
    }

    it('should return true for unique values', () => {
      const objList: TestObject[] = [
        { id: 1, name: 'test1', value: 'value1' },
        { id: 2, name: 'test2', value: 'value2' },
        { id: 3, name: 'test3', value: 'value3' },
      ];

      const result = validateUnique(objList, 'id');
      expect(result).toBe(true);
    });

    it('should return false for duplicate values', () => {
      const objList: TestObject[] = [
        { id: 1, name: 'test1', value: 'value1' },
        { id: 2, name: 'test2', value: 'value2' },
        { id: 1, name: 'test3', value: 'value3' },
      ];

      const result = validateUnique(objList, 'id');
      expect(result).toBe(false);
    });

    it('should work with string properties', () => {
      const objList: TestObject[] = [
        { id: 1, name: 'test1', value: 'value1' },
        { id: 2, name: 'test2', value: 'value2' },
        { id: 3, name: 'test3', value: 'value3' },
      ];

      const result = validateUnique(objList, 'name');
      expect(result).toBe(true);
    });

    it('should return false for duplicate string values', () => {
      const objList: TestObject[] = [
        { id: 1, name: 'test1', value: 'value1' },
        { id: 2, name: 'test2', value: 'value2' },
        { id: 3, name: 'test1', value: 'value3' },
      ];

      const result = validateUnique(objList, 'name');
      expect(result).toBe(false);
    });

    it('should handle empty array', () => {
      const objList: TestObject[] = [];

      const result = validateUnique(objList, 'id');
      expect(result).toBe(true);
    });

    it('should handle undefined array', () => {
      const objList: TestObject[] | undefined = undefined;

      const result = validateUnique(objList, 'id');
      expect(result).toBe(true);
    });

    it('should handle single item array', () => {
      const objList: TestObject[] = [{ id: 1, name: 'test1', value: 'value1' }];

      const result = validateUnique(objList, 'id');
      expect(result).toBe(true);
    });

    it('should work with different property types', () => {
      interface MixedObject {
        id: number;
        name: string;
        isActive: boolean;
        tags: string[];
      }

      const objList: MixedObject[] = [
        { id: 1, name: 'test1', isActive: true, tags: ['tag1'] },
        { id: 2, name: 'test2', isActive: false, tags: ['tag2'] },
        { id: 3, name: 'test3', isActive: true, tags: ['tag3'] },
      ];

      const result = validateUnique(objList, 'isActive');
      expect(result).toBe(false); // true and false are different, but we have two true values
    });

    it('should work with boolean properties', () => {
      interface BooleanObject {
        id: number;
        isActive: boolean;
      }

      const objList: BooleanObject[] = [
        { id: 1, isActive: true },
        { id: 2, isActive: false },
        { id: 3, isActive: true },
      ];

      const result = validateUnique(objList, 'isActive');
      expect(result).toBe(false);
    });

    it('should work with unique boolean values', () => {
      interface BooleanObject {
        id: number;
        isActive: boolean;
      }

      const objList: BooleanObject[] = [
        { id: 1, isActive: true },
        { id: 2, isActive: false },
      ];

      const result = validateUnique(objList, 'isActive');
      expect(result).toBe(true);
    });

    it('should handle null and undefined values', () => {
      interface NullableObject {
        id: number;
        value: string | null | undefined;
      }

      const objList: NullableObject[] = [
        { id: 1, value: 'test1' },
        { id: 2, value: null },
        { id: 3, value: undefined },
        { id: 4, value: 'test2' },
      ];

      const result = validateUnique(objList, 'value');
      expect(result).toBe(true); // null, undefined, 'test1', 'test2' are all different
    });

    it('should handle duplicate null values', () => {
      interface NullableObject {
        id: number;
        value: string | null;
      }

      const objList: NullableObject[] = [
        { id: 1, value: 'test1' },
        { id: 2, value: null },
        { id: 3, value: null },
      ];

      const result = validateUnique(objList, 'value');
      expect(result).toBe(false);
    });

    it('should handle duplicate undefined values', () => {
      interface UndefinedObject {
        id: number;
        value: string | undefined;
      }

      const objList: UndefinedObject[] = [
        { id: 1, value: 'test1' },
        { id: 2, value: undefined },
        { id: 3, value: undefined },
      ];

      const result = validateUnique(objList, 'value');
      expect(result).toBe(false);
    });
  });
});
