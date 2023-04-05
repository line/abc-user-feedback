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
import { InternalServerErrorException } from '@nestjs/common';
import { validate } from 'class-validator';

const DtoValidator =
  () => (target: unknown, propName: string, descriptor: any) => {
    const methodRef = (descriptor as any).value;

    (descriptor as any).value = async function (...args) {
      for (const arg of args) {
        let errors = [];

        if (!Array.isArray(arg) && typeof arg === 'object') {
          errors = await validate(arg);
        } else if (
          Array.isArray(arg) &&
          arg.length > 0 &&
          typeof arg[0] === 'object'
        ) {
          errors = (
            await Promise.all(arg.map(async (item) => await validate(item)))
          ).flat();
        }
        if (errors.length > 0) {
          throw new InternalServerErrorException(errors);
        }
      }
      return await methodRef.call(this, ...args);
    };
    return descriptor;
  };
export default DtoValidator;
