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
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CodeTypeEnum } from './code-type.enum';
import { CodeEntity } from './code.entity';
import { SetCodeDto, VerifyCodeDto } from './dtos';
import { SetCodeUserInvitationDataDto } from './dtos/set-code.dto';

export const SECONDS = 60 * 5;

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(CodeEntity)
    private readonly codeRepo: Repository<CodeEntity>,
  ) {}

  @Transactional()
  async setCode(dto: SetCodeDto) {
    const { key, type, durationSec } = dto;

    const code = this.createCode();

    const codeEntity =
      (await this.codeRepo.findOneBy({ key, type })) || new CodeEntity();

    await this.codeRepo.save(
      Object.assign(codeEntity, {
        type,
        key,
        code,
        isVerified: false,
        expiredAt: dayjs()
          .add(durationSec ?? SECONDS, 'seconds')
          .toDate(),
        data: type === CodeTypeEnum.USER_INVITATION ? dto.data : undefined,
      }),
    );

    return code;
  }

  @Transactional()
  async verifyCode({ code, key, type }: VerifyCodeDto) {
    const codeEntity = await this.codeRepo.findOneBy({ key, type });

    if (!codeEntity) throw new NotFoundException('not found code');
    if (codeEntity.isVerified)
      throw new BadRequestException('already verified');

    if (codeEntity.code !== code) {
      throw new BadRequestException('invalid code');
    }

    if (dayjs().isAfter(codeEntity.expiredAt)) {
      throw new BadRequestException('code expired');
    }

    await this.codeRepo.save(Object.assign(codeEntity, { isVerified: true }));
  }

  async getDataByCodeAndType(
    type: CodeTypeEnum.USER_INVITATION,
    code: string,
  ): Promise<SetCodeUserInvitationDataDto> {
    const codeEntity = await this.codeRepo.findOneBy({
      type,
      code,
    });
    if (!codeEntity) throw new NotFoundException('code not found');
    return codeEntity.data;
  }

  async checkVerified(type: CodeTypeEnum, key: string) {
    const codeEntity = await this.codeRepo.findOneBy({ key, type });

    if (!codeEntity) throw new NotFoundException('code not found');

    return codeEntity.isVerified;
  }

  private createCode() {
    return String(Math.floor(Math.random() * 999998 + 1)).padStart(6, '0');
  }
}
