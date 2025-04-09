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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CodeTypeEnum } from '@/shared/code/code-type.enum';
import { CodeService } from '@/shared/code/code.service';
import { ResetPasswordMailingService } from '@/shared/mailing/reset-password-mailing.service';

import type { ResetPasswordDto } from './dtos';
import { ChangePasswordDto } from './dtos';
import { UserEntity } from './entities/user.entity';
import { InvalidPasswordException, UserNotFoundException } from './exceptions';

@Injectable()
export class UserPasswordService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly resetPasswordMailingService: ResetPasswordMailingService,
    private readonly codeService: CodeService,
  ) {}

  @Transactional()
  async sendResetPasswordMail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new UserNotFoundException();

    const code = await this.codeService.setCode({
      type: CodeTypeEnum.RESET_PASSWORD,
      key: email,
    });

    await this.resetPasswordMailingService.send({ email, code });
  }

  async resetPassword({ email, code, password }: ResetPasswordDto) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new UserNotFoundException();

    const { error } = await this.codeService.verifyCode({
      type: CodeTypeEnum.RESET_PASSWORD,
      key: email,
      code,
    });

    if (error) throw error;

    return await this.userRepo.save(
      Object.assign(user, {
        hashPassword: await this.createHashPassword(password),
      }),
    );
  }

  @Transactional()
  async changePassword(dto: ChangePasswordDto) {
    const { newPassword, password, userId } = dto;
    const user =
      (await this.userRepo.findOneBy({
        id: userId,
      })) ?? new UserEntity();
    const originHashPassword = user.hashPassword;

    if (!bcrypt.compareSync(password, originHashPassword)) {
      throw new InvalidPasswordException();
    }

    return await this.userRepo.save(
      Object.assign(user, {
        hashPassword: await this.createHashPassword(newPassword),
      }),
    );
  }

  async createHashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }
}
