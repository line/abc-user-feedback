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
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class TokenValidatorConstraint implements ValidatorConstraintInterface {
  validate(token: string | null) {
    const regex = /^[a-zA-Z0-9._-]+$/;
    return (
      !token ||
      (typeof token === 'string' && regex.test(token) && token.length >= 16)
    );
  }

  defaultMessage() {
    return 'Token must be at least 16 characters long and contain only alphanumeric characters, dots, hyphens, and underscores.';
  }
}

export function TokenValidator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: TokenValidatorConstraint,
    });
  };
}
