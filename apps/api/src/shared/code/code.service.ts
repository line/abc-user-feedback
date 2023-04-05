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
import * as crypto from 'crypto';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';

import { CodeTypeEnum } from './code-type.enum';
import { CodeEntity } from './code.entity';
import { SetCodeDto, SetCodeVerifiedDto } from './dtos';

export const SECONDS = 60 * 5;

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(CodeEntity)
    private readonly codeRepo: Repository<CodeEntity>,
  ) {}

  async setCode(dto: SetCodeDto) {
    const { key, type } = dto;

    const code = this.createCode();
    const hashedKey = this.getHashKey(key);

    const codeEntity = await this.codeRepo.findOneBy({
      key: hashedKey,
      type,
    });
    await this.codeRepo.save({
      ...codeEntity,
      type,
      key: hashedKey,
      code,
      isVerified: false,
      expiredAt: dayjs().add(SECONDS, 'seconds').toDate(),
      data: type === CodeTypeEnum.USER_INVITATION ? dto.data : undefined,
    });

    return code;
  }

  async setCodeVerified({ code, key, type }: SetCodeVerifiedDto) {
    const hashedKey = this.getHashKey(key);

    const codeEntity = await this.codeRepo.findOneBy({
      key: hashedKey,
      type,
    });

    if (!codeEntity) throw new NotFoundException('not found code');

    if (codeEntity.code !== code) {
      throw new BadRequestException('invalid code');
    }

    if (dayjs(codeEntity.expiredAt).diff(dayjs()) < 0) {
      throw new BadRequestException('code expired');
    }

    await this.codeRepo.update({ id: codeEntity.id }, { isVerified: true });
  }

  async getDataByCodeAndType(type: CodeTypeEnum.USER_INVITATION, code: string) {
    const codeDoc = await this.codeRepo.findOneBy({
      type,
      code,
    });
    if (!codeDoc) throw new NotFoundException('not found code');
    return codeDoc.data;
  }

  async checkVerified(type: CodeTypeEnum, key: string) {
    const codeEntity = await this.codeRepo.findOneBy({
      key: this.getHashKey(key),
      type,
    });

    if (!codeEntity) throw new NotFoundException('not found code');

    return codeEntity.isVerified;
  }

  private createCode() {
    return String(Math.floor(Math.random() * 999998 + 1)).padStart(6, '0');
  }

  getHashKey(key: string) {
    return crypto.createHash('sha1').update(key).digest('hex');
  }
}
