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
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CodeTypeEnum } from '@/shared/code/code-type.enum';
import { CodeService } from '@/shared/code/code.service';
import { ResetPasswordMailingService } from '@/shared/mailing/reset-password-mailing.service';

import { ChangePasswordDto, ResetPasswordDto } from './dtos';
import { UserEntity } from './entities/user.entity';
import { UserNotFoundException } from './exceptions';

@Injectable()
export class UserPasswordService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly resetPassworeMailingService: ResetPasswordMailingService,
    private readonly codeService: CodeService,
  ) {}

  async sendResetPasswordMail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new UserNotFoundException();

    const code = await this.codeService.setCode({
      type: CodeTypeEnum.RESET_PASSWORD,
      key: email,
    });

    await this.resetPassworeMailingService.send({ email, code });
  }

  async resetPassword({ email, code, password }: ResetPasswordDto) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new UserNotFoundException();

    await this.codeService.setCodeVerified({
      type: CodeTypeEnum.RESET_PASSWORD,
      key: email,
      code,
    });

    await this.userRepo.update(
      { id: user.id },
      { hashPassword: await this.createHashPassword(password) },
    );
  }

  async changePassword(dto: ChangePasswordDto) {
    const { newPassword, password, userId } = dto;
    const { hashPassword: originHashPassword } = await this.userRepo.findOneBy({
      id: userId,
    });

    if (!bcrypt.compareSync(password, originHashPassword)) {
      throw new BadRequestException('Invalid original password');
    }

    await this.userRepo.update(
      { id: userId },
      { hashPassword: await this.createHashPassword(newPassword) },
    );
  }

  async createHashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }
}
