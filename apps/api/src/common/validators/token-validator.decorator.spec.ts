/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
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
import { IsNotEmpty, validate } from 'class-validator';

import { TokenValidator } from './token-validator';

class TokenDto {
  @IsNotEmpty()
  @TokenValidator({ message: 'Invalid token format' })
  token: string;
}

describe('TokenValidator', () => {
  it('should validate a correct token', async () => {
    const dto = new TokenDto();
    dto.token = 'validToken123456';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should invalidate a token with invalid characters', async () => {
    const dto = new TokenDto();
    dto.token = 'invalidToken$123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('TokenValidatorConstraint');
  });

  it('should invalidate a token that is too short', async () => {
    const dto = new TokenDto();
    dto.token = 'short';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('TokenValidatorConstraint');
  });

  it('should invalidate an empty token', async () => {
    const dto = new TokenDto();
    dto.token = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
