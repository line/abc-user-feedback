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
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';

import { EmailVerificationMailingService } from '@/shared/mailing/email-verification-mailing.service';
import { NotVerifiedEmailException } from '@/shared/mailing/exceptions';

import { CodeTypeEnum } from '../../shared/code/code-type.enum';
import { CodeService } from '../../shared/code/code.service';
import { CreateUserService } from '../user/create-user.service';
import { UserDto } from '../user/dtos';
import { UserStateEnum } from '../user/entities/enums';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../user/exceptions';
import { UserService } from '../user/user.service';
import {
  JwtDto,
  SendEmailCodeDto,
  SignUpEmailUserDto,
  SignUpInvitationUserDto,
  ValidateEmailUserDto,
  VerifyEmailCodeDto,
} from './dtos';
import { PasswordNotMatchException, UserBlockedException } from './exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailVerificationMailingService: EmailVerificationMailingService,
    private readonly codeService: CodeService,
  ) {}

  async sendEmailCode({ email }: SendEmailCodeDto) {
    const user = await this.userService.findByEmail(email);
    if (user) throw new UserAlreadyExistsException();

    const code = await this.codeService.setCode({
      type: CodeTypeEnum.EMAIL_VEIRIFICATION,
      key: email,
    });
    await this.emailVerificationMailingService.send({ code, email });

    return dayjs()
      .add(5 * 60, 'seconds')
      .format();
  }

  async verifyEmailCode({ code, email }: VerifyEmailCodeDto) {
    await this.codeService.setCodeVerified({
      type: CodeTypeEnum.EMAIL_VEIRIFICATION,
      key: email,
      code,
    });
  }

  async validateEmailUser({ email, password }: ValidateEmailUserDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UserNotFoundException();
    if (!bcrypt.compareSync(password, user.hashPassword)) {
      throw new PasswordNotMatchException();
    }
    return user;
  }

  async signUpEmailUser({ email, password }: SignUpEmailUserDto) {
    try {
      const isVerified = await this.codeService.checkVerified(
        CodeTypeEnum.EMAIL_VEIRIFICATION,
        email,
      );
      if (!isVerified) throw new NotVerifiedEmailException();
    } catch (error) {
      throw new BadRequestException('must request email verification');
    }
    return await this.createUserService.createEmailUser({ email, password });
  }

  async signUpInvitationUser(dto: SignUpInvitationUserDto) {
    const { password, code, email } = dto;

    try {
      await this.codeService.setCodeVerified({
        type: CodeTypeEnum.USER_INVITATION,
        key: email,
        code,
      });
    } catch (error) {
      throw new BadRequestException('must request invitation');
    }
    const data = await this.codeService.getDataByCodeAndType(
      CodeTypeEnum.USER_INVITATION,
      code,
    );
    if (!data?.roleId) {
      throw new InternalServerErrorException('role id exception');
    }
    return await this.createUserService.createInvitationUser({
      email,
      password,
      roleId: data.roleId,
    });
  }

  async signIn(user: UserDto): Promise<JwtDto> {
    const { email, id, permissions, roleName } = user;
    const { state } = await this.userService.findById(id);

    if (state === UserStateEnum.Blocked) {
      throw new UserBlockedException();
    }

    return {
      accessToken: this.jwtService.sign(
        { sub: id, email, permissions, roleName },
        { expiresIn: '10m' },
      ),
      refreshToken: this.jwtService.sign(
        { sub: id, email },
        { expiresIn: '1h' },
      ),
    };
  }

  async refreshToken({ id }: { id: string }): Promise<JwtDto> {
    const user = await this.userService.findById(id);
    return this.signIn(UserDto.transform(user));
  }
}
