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
import { faker } from '@faker-js/faker';
import { Validator } from 'class-validator';

import { IsPassword } from './is-password';

class IsPasswordTest {
  @IsPassword()
  password: any;
}

describe('IsPassword decorator', () => {
  it('', () => {
    const instance = new IsPasswordTest();
    instance.password = faker.string.sample(
      faker.number.int({ min: 8, max: 15 }),
    );
    const validator = new Validator();
    validator.validate(instance).then((errors) => {
      expect(errors).toHaveLength(0);
    });
  });
  it('minLength', () => {
    const instance = new IsPasswordTest();
    instance.password = faker.string.sample(
      faker.number.int({ min: 0, max: 7 }),
    );
    const validator = new Validator();
    validator.validate(instance).then((errors) => {
      expect(errors.length).toEqual(1);
      expect(Object.keys(errors[0].constraints)[0]).toEqual('minLength');
    });
  });

  it('isString', () => {
    const instance = new IsPasswordTest();
    instance.password = faker.number.int({ min: 10000000, max: 99999999 });

    const validator = new Validator();
    validator.validate(instance).then((errors) => {
      expect(errors.length).toEqual(1);
      expect(Object.keys(errors[0].constraints)[0]).toEqual('isString');
    });
  });

  it('isString, minLength', () => {
    const instance = new IsPasswordTest();
    instance.password = faker.number.int({ min: 0, max: 9999999 });
    const validator = new Validator();
    validator.validate(instance).then((errors) => {
      expect(errors.length).toEqual(1);
      expect(Object.keys(errors[0].constraints)[0]).toEqual('isString');
      expect(Object.keys(errors[0].constraints)[1]).toEqual('minLength');
    });
  });
});
