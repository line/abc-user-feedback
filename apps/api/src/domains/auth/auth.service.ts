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
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosError } from 'axios';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { Transactional } from 'typeorm-transactional';

import { EmailVerificationMailingService } from '@/shared/mailing/email-verification-mailing.service';
import { NotVerifiedEmailException } from '@/shared/mailing/exceptions';
import { CodeTypeEnum } from '../../shared/code/code-type.enum';
import { CodeService } from '../../shared/code/code.service';
import { ApiKeyService } from '../project/api-key/api-key.service';
import { MemberService } from '../project/member/member.service';
import { RoleService } from '../project/role/role.service';
import { TenantService } from '../tenant/tenant.service';
import { CreateUserService } from '../user/create-user.service';
import { UserDto } from '../user/dtos';
import { SignUpMethodEnum, UserStateEnum } from '../user/entities/enums';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../user/exceptions';
import { UserService } from '../user/user.service';
import type {
  JwtDto,
  SendEmailCodeDto,
  ValidateEmailUserDto,
  VerifyEmailCodeDto,
} from './dtos';
import {
  SignUpEmailUserDto,
  SignUpInvitationUserDto,
  SignUpOauthUserDto,
} from './dtos';
import { PasswordNotMatchException, UserBlockedException } from './exceptions';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private REDIRECT_URI = `${process.env.BASE_URL}/auth/oauth-callback`;

  constructor(
    private readonly createUserService: CreateUserService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailVerificationMailingService: EmailVerificationMailingService,
    private readonly codeService: CodeService,
    private readonly apiKeyService: ApiKeyService,
    private readonly tenantService: TenantService,
    private readonly roleService: RoleService,
    private readonly memberService: MemberService,
  ) {}

  async sendEmailCode({ email }: SendEmailCodeDto) {
    const user = await this.userService.findByEmailAndSignUpMethod(
      email,
      SignUpMethodEnum.EMAIL,
    );
    if (user) throw new UserAlreadyExistsException();
    await this.userService.validateEmail(email);

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
    await this.codeService.verifyCode({
      type: CodeTypeEnum.EMAIL_VEIRIFICATION,
      key: email,
      code,
    });
  }

  async validateEmailUser({ email, password }: ValidateEmailUserDto) {
    const user = await this.userService.findByEmailAndSignUpMethod(
      email,
      SignUpMethodEnum.EMAIL,
    );
    if (!user) throw new UserNotFoundException();
    if (!bcrypt.compareSync(password, user.hashPassword)) {
      throw new PasswordNotMatchException();
    }
    return user;
  }

  @Transactional()
  async signUpEmailUser(dto: SignUpEmailUserDto) {
    let isVerified: boolean;
    try {
      isVerified = await this.codeService.checkVerified(
        CodeTypeEnum.EMAIL_VEIRIFICATION,
        dto.email,
      );
    } catch (error) {
      throw new BadRequestException('must request email verification');
    }
    if (!isVerified) throw new NotVerifiedEmailException();

    return await this.createUserService.createEmailUser(dto);
  }

  @Transactional()
  async signUpInvitationUser(dto: SignUpInvitationUserDto) {
    const { code, ...rest } = dto;

    await this.codeService.verifyCode({
      type: CodeTypeEnum.USER_INVITATION,
      key: dto.email,
      code,
    });

    const data = await this.codeService.getDataByCodeAndType(
      CodeTypeEnum.USER_INVITATION,
      code,
    );

    if (!data?.userType) {
      throw new InternalServerErrorException('no user type');
    }
    return await this.createUserService.createInvitationUser({
      ...rest,
      type: data.userType,
      roleId: data.roleId,
    });
  }

  @Transactional()
  async signUpOAuthUser(dto: SignUpOauthUserDto) {
    const { email, projectName, roleName } = dto;

    const role = await this.roleService.findByProjectNameAndRoleName(
      projectName,
      roleName,
    );
    const user = await this.createUserService.createOAuthUser({ email });

    await this.memberService.create({ roleId: role.id, userId: user.id });
  }

  async signIn(user: UserDto): Promise<JwtDto> {
    const { email, id, department, name, type } = user;
    const { state } = await this.userService.findById(id);

    if (state === UserStateEnum.Blocked) {
      throw new UserBlockedException();
    }

    return {
      accessToken: this.jwtService.sign(
        { sub: id, email, department, name, type },
        { expiresIn: '10m' },
      ),
      refreshToken: this.jwtService.sign(
        { sub: id, email },
        { expiresIn: '1h' },
      ),
    };
  }

  async refreshToken({ id }: { id: number }): Promise<JwtDto> {
    const user = await this.userService.findById(id);
    return this.signIn(UserDto.transform(user));
  }

  async validateApiKey(value: string, projectId: number) {
    const apiKeys = await this.apiKeyService.findByProjectIdAndValue(
      projectId,
      value,
    );

    if (apiKeys.length === 1) return true;
    return false;
  }

  async getOAuthLoginURL(callback_url?: string) {
    const { useOAuth, oauthConfig } = await this.tenantService.findOne();

    if (!useOAuth) {
      throw new BadRequestException('OAuth login is disabled.');
    }
    if (!oauthConfig) {
      throw new BadRequestException('OAuth Config is required.');
    }

    const params = new URLSearchParams({
      redirect_uri: this.REDIRECT_URI,
      client_id: oauthConfig.clientId,
      response_type: 'code',
      state: crypto.randomBytes(10).toString('hex'),
      scope: oauthConfig.scopeString,
      callback_url: encodeURIComponent(callback_url),
    });

    return `${oauthConfig.authCodeRequestURL}?${params}`;
  }

  private async getAccessToken(code: string) {
    const { oauthConfig, useOAuth } = await this.tenantService.findOne();

    if (!useOAuth) {
      throw new BadRequestException('OAuth login is disabled.');
    }
    if (!oauthConfig) {
      throw new BadRequestException('OAuth Config is required.');
    }

    const { accessTokenRequestURL, clientId, clientSecret } = oauthConfig;
    try {
      const { data } = await axios.post(
        accessTokenRequestURL,
        {
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.REDIRECT_URI,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              clientId + ':' + clientSecret,
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return data.access_token;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new InternalServerErrorException({
          axiosError: {
            ...error.response.data,
            status: error.response.status,
          },
        });
      }
      throw error;
    }
  }

  private async getEmailByAccessToken(accessToken: string): Promise<string> {
    const { oauthConfig } = await this.tenantService.findOne();

    if (!oauthConfig) {
      throw new BadRequestException('OAuth Config is required.');
    }
    try {
      const { data } = await axios.get(oauthConfig.userProfileRequestURL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data[oauthConfig.emailKey];
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new InternalServerErrorException({
          axiosError: {
            ...error.response.data,
            status: error.response.status,
          },
        });
      }
      throw error;
    }
  }

  async signInByOAuth(code: string) {
    const accessToken = await this.getAccessToken(code);

    const email = await this.getEmailByAccessToken(accessToken);

    const user = await this.userService.findByEmailAndSignUpMethod(
      email,
      SignUpMethodEnum.OAUTH,
    );
    if (user) {
      return await this.signIn(user);
    } else {
      const user = await this.createUserService.createOAuthUser({ email });
      return await this.signIn(user);
    }
  }
}
