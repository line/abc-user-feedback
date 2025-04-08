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

import { IsString } from 'class-validator';

import DtoValidator from './dto-validator';

class Dto {
  @IsString()
  str: string;
}

class TestClass {
  @DtoValidator()
  noParam() {
    return;
  }

  @DtoValidator()
  dtoParam(_dto: Dto) {
    return;
  }

  @DtoValidator()
  dtosParam(_dtos: Dto[]) {
    return;
  }

  @DtoValidator()
  compositionParam(_a: any, _dtos: Dto) {
    return;
  }
}
describe('dto validator', () => {
  let instance: TestClass;
  beforeEach(() => {
    instance = new TestClass();
  });
  it('method call with no params', () => {
    instance.noParam();
  });
  it('method call with no params', () => {
    const dto = new Dto();
    dto.str = 'test';
    instance.dtoParam(dto);
    const dto2 = new Dto();
    void expect(instance.dtoParam(dto2)).rejects.toThrow();
  });
  it('method call with no params', () => {
    const dto = new Dto();
    dto.str = 'test';
    instance.dtosParam([dto]);
    const dto2 = new Dto();
    void expect(instance.dtosParam([dto2])).rejects.toThrow();
  });
  it('method call with no params', () => {
    const dto = new Dto();
    dto.str = '123';
    instance.compositionParam([1], dto);
  });
});
