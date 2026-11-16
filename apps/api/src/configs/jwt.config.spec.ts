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
import { jwtConfigSchema, KNOWN_DEFAULT_JWT_SECRETS } from './jwt.config';

describe('jwtConfigSchema', () => {
  it.each(KNOWN_DEFAULT_JWT_SECRETS)(
    'rejects the published default %s',
    (s) => {
      expect(
        jwtConfigSchema.validate({ JWT_SECRET: s }).error?.message,
      ).toMatch('publicly known default');
    },
  );

  it('accepts a generated secret', () => {
    expect(
      jwtConfigSchema.validate({
        JWT_SECRET: 'f3a9c1d2e4b5a6978877665544332211',
      }).error,
    ).toBeUndefined();
  });
});
