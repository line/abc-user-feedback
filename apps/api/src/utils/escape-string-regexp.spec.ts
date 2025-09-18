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
import escapeStringRegexp from './escape-string-regexp';

describe('escape-string-regexp', () => {
  describe('escapeStringRegexp', () => {
    it('should escape special regex characters', () => {
      const input = 'test.string|with[special]characters';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\.string\\|with\\[special\\]characters');
    });

    it('should escape parentheses', () => {
      const input = 'test(string)with(parentheses)';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\(string\\)with\\(parentheses\\)');
    });

    it('should escape curly braces', () => {
      const input = 'test{string}with{braces}';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\{string\\}with\\{braces\\}');
    });

    it('should escape square brackets', () => {
      const input = 'test[string]with[brackets]';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\[string\\]with\\[brackets\\]');
    });

    it('should escape backslashes', () => {
      const input = 'test\\string\\with\\backslashes';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\\\string\\\\with\\\\backslashes');
    });

    it('should escape pipe characters', () => {
      const input = 'test|string|with|pipes';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\|string\\|with\\|pipes');
    });

    it('should escape dollar signs', () => {
      const input = 'test$string$with$dollars';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\$string\\$with\\$dollars');
    });

    it('should escape plus signs', () => {
      const input = 'test+string+with+pluses';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\+string\\+with\\+pluses');
    });

    it('should escape asterisks', () => {
      const input = 'test*string*with*asterisks';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\*string\\*with\\*asterisks');
    });

    it('should escape question marks', () => {
      const input = 'test?string?with?questions';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\?string\\?with\\?questions');
    });

    it('should escape carets', () => {
      const input = 'test^string^with^carets';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\^string\\^with\\^carets');
    });

    it('should escape hyphens with \\x2d', () => {
      const input = 'test-string-with-hyphens';
      const result = escapeStringRegexp(input);

      expect(result).toBe('test\\x2dstring\\x2dwith\\x2dhyphens');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = escapeStringRegexp(input);

      expect(result).toBe('');
    });

    it('should handle string without special characters', () => {
      const input = 'normalstring';
      const result = escapeStringRegexp(input);

      expect(result).toBe('normalstring');
    });

    it('should handle string with only special characters', () => {
      const input = '|\\{}()[\\]^$+*?.-';
      const result = escapeStringRegexp(input);

      expect(result).toBe(
        '\\|\\\\\\{\\}\\(\\)\\[\\\\\\]\\^\\$\\+\\*\\?\\.\\x2d',
      );
    });

    it('should throw TypeError for non-string input', () => {
      expect(() => escapeStringRegexp(null as any)).toThrow(TypeError);
      expect(() => escapeStringRegexp(undefined as any)).toThrow(TypeError);
      expect(() => escapeStringRegexp(123 as any)).toThrow(TypeError);
      expect(() => escapeStringRegexp({} as any)).toThrow(TypeError);
      expect(() => escapeStringRegexp([] as any)).toThrow(TypeError);
    });

    it('should throw TypeError with correct message', () => {
      expect(() => escapeStringRegexp(123 as any)).toThrow('Expected a string');
    });
  });
});
