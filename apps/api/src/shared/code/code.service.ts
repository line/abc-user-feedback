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
import crypto from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CodeTypeEnum } from './code-type.enum';
import { CodeEntity } from './code.entity';
import { SetCodeDto, VerifyCodeDto } from './dtos';
import type { SetCodeUserInvitationDataDto } from './dtos/set-code.dto';

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
        expiredAt: DateTime.utc()
          .plus({ seconds: durationSec ?? SECONDS })
          .toJSDate(),
        data: type === CodeTypeEnum.USER_INVITATION ? dto.data : undefined,
        tryCount: 0,
      }),
    );

    return code;
  }

  @Transactional()
  async verifyCode({ code, key, type }: VerifyCodeDto) {
    const codeEntity = await this.codeRepo.findOne({
      where: { key, type },
      lock: { mode: 'pessimistic_write' },
    });

    if (!codeEntity) return { error: new NotFoundException('not found code') };
    if (codeEntity.isVerified)
      return { error: new BadRequestException('already verified') };

    if (codeEntity.tryCount >= 5) {
      return { error: new BadRequestException('code expired') };
    }

    if (codeEntity.code !== code) {
      codeEntity.tryCount += 1;
      await this.codeRepo.save(codeEntity);
      return { error: new BadRequestException('invalid code') };
    }

    if (DateTime.utc() > DateTime.fromJSDate(codeEntity.expiredAt)) {
      return { error: new BadRequestException('code expired') };
    }

    await this.codeRepo.save(Object.assign(codeEntity, { isVerified: true }));
    return { error: null };
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
    return String(crypto.randomInt(1, 1000000)).padStart(6, '0');
  }
}
