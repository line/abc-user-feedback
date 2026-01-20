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
import crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AxiosError, AxiosResponse } from 'axios';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import type { StringValue } from 'ms';
import { catchError, lastValueFrom, map } from 'rxjs';
import { Transactional } from 'typeorm-transactional';

import { EmailVerificationMailingService } from '@/shared/mailing/email-verification-mailing.service';
import { NotVerifiedEmailException } from '@/shared/mailing/exceptions';

import type { ConfigServiceType } from '@/types/config-service.type';
import { CodeTypeEnum } from '../../../shared/code/code-type.enum';
import { CodeService } from '../../../shared/code/code.service';
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
  SignUpInvitationUserDto,
  ValidateEmailUserDto,
  VerifyEmailCodeDto,
} from './dtos';
import { SignUpEmailUserDto, SignUpOauthUserDto } from './dtos';
import { PasswordNotMatchException, UserBlockedException } from './exceptions';

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

type UserProfileResponse = Record<string, string>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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
    private readonly configService: ConfigService<ConfigServiceType>,
    private readonly httpService: HttpService,
  ) {}

  async sendEmailCode({ email }: SendEmailCodeDto) {
    const user = await this.userService.findByEmailAndSignUpMethod(
      email,
      SignUpMethodEnum.EMAIL,
    );
    if (user) throw new UserAlreadyExistsException();
    await this.memberService.validateEmail(email);

    const code = await this.codeService.setCode({
      type: CodeTypeEnum.EMAIL_VEIRIFICATION,
      key: email,
    });

    // Skip email sending in test environment
    if (process.env.NODE_ENV === 'test') {
      this.logger.warn(
        `Skipping email sending for code: ${code}, email: ${email}`,
      );
    } else {
      await this.emailVerificationMailingService.send({ code, email });
    }

    return DateTime.utc()
      .plus({ seconds: 5 * 60 })
      .toISO();
  }

  async verifyEmailCode({ code, email }: VerifyEmailCodeDto) {
    if (process.env.NODE_ENV === 'test') return;
    const { error } = await this.codeService.verifyCode({
      type: CodeTypeEnum.EMAIL_VEIRIFICATION,
      key: email,
      code,
    });

    if (error) throw error;
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
    } catch {
      throw new BadRequestException('must request email verification');
    }
    if (!isVerified) throw new NotVerifiedEmailException();

    return await this.createUserService.createEmailUser(dto);
  }

  async signUpInvitationUser(dto: SignUpInvitationUserDto) {
    const { code, ...rest } = dto;

    const { error } = await this.codeService.verifyCode({
      type: CodeTypeEnum.USER_INVITATION,
      key: dto.email,
      code,
    });
    if (error) throw error;

    const data = await this.codeService.getDataByCodeAndType(
      CodeTypeEnum.USER_INVITATION,
      code,
    );

    return await this.createUserService.createInvitationUser({
      ...rest,
      type: data.userType,
      roleId: data.roleId,
    });
  }

  @Transactional()
  async signUpOAuthUser(dto: SignUpOauthUserDto) {
    const { email, projectName, roleName } = dto;

    const user = await this.createUserService.createOAuthUser({ email });
    if (!projectName || !roleName) return;
    const role = await this.roleService.findByProjectNameAndRoleName(
      projectName,
      roleName,
    );

    await this.memberService.create({ roleId: role.id, userId: user.id });
  }

  async signIn(user: UserDto): Promise<JwtDto> {
    const { email, id, department, name, type } = user;

    const { allowDomains } = await this.tenantService.findOne();

    if (email && allowDomains && allowDomains.length > 0) {
      const domain = email.substring(email.lastIndexOf('@') + 1);
      if (!allowDomains.includes(domain)) {
        throw new BadRequestException('Signed in with invalid domain.');
      }
    }

    const { state } = await this.userService.findById(id);

    if (state === UserStateEnum.Blocked) throw new UserBlockedException();
    const { accessTokenExpiredTime, refreshTokenExpiredTime } =
      this.configService.get('jwt', { infer: true }) ?? {};

    return {
      accessToken: this.jwtService.sign(
        { sub: id, email, department, name, type },
        {
          expiresIn: (accessTokenExpiredTime ?? '10m') as StringValue | number,
        },
      ),
      refreshToken: this.jwtService.sign(
        { sub: id, email },
        {
          expiresIn: (refreshTokenExpiredTime ?? '1h') as StringValue | number,
        },
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
      redirect_uri: this.getRedirectURI(),
      client_id: oauthConfig.clientId,
      response_type: 'code',
      state: crypto.randomBytes(10).toString('hex'),
      scope: oauthConfig.scopeString,
      callback_url: encodeURIComponent(callback_url ?? ''),
    });

    return `${oauthConfig.authCodeRequestURL}?${params.toString()}`;
  }

  private async getAccessToken(code: string): Promise<string> {
    const { oauthConfig, useOAuth } = await this.tenantService.findOne();

    if (!useOAuth) {
      throw new BadRequestException('OAuth login is disabled.');
    }
    if (!oauthConfig) {
      throw new BadRequestException('OAuth Config is required.');
    }

    const { accessTokenRequestURL, clientId, clientSecret } = oauthConfig;
    return await lastValueFrom<string>(
      this.httpService
        .post<AccessTokenResponse>(
          accessTokenRequestURL,
          {
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.getRedirectURI(),
          },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(
                clientId + ':' + clientSecret,
              ).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe<string>(
          map<AxiosResponse<AccessTokenResponse, any>, string>(
            (res) => res.data.access_token,
          ),
        )
        .pipe(
          catchError((error: Error) => {
            if (error instanceof AxiosError) {
              throw new InternalServerErrorException({
                axiosError: {
                  ...error.response?.data,
                  status: error.response?.status,
                } as object,
              });
            }
            throw error;
          }),
        ),
    );
  }

  private async getEmailByAccessToken(accessToken: string): Promise<string> {
    const { oauthConfig } = await this.tenantService.findOne();

    if (!oauthConfig) {
      throw new BadRequestException('OAuth Config is required.');
    }
    return await lastValueFrom<string>(
      this.httpService
        .get<UserProfileResponse>(oauthConfig.userProfileRequestURL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .pipe(map((res) => res.data[oauthConfig.emailKey]))
        .pipe(
          catchError((error: Error) => {
            if (error instanceof AxiosError) {
              throw new InternalServerErrorException({
                axiosError: {
                  ...error.response?.data,
                  status: error.response?.status,
                } as object,
              });
            }
            throw error;
          }),
        ),
    );
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

  private getRedirectURI() {
    const app = this.configService.get('app', { infer: true });

    return `${app?.adminWebUrl}/auth/oauth-callback`;
  }
}
