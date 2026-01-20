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
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../user/decorators';
import { UserDto } from '../user/dtos';
import { AuthService } from './auth.service';
import {
  EmailUserSignInRequestDto,
  EmailUserSignUpRequestDto,
  EmailVerificationCodeRequestDto,
  EmailVerificationMailingRequestDto,
  InvitationUserSignUpRequestDto,
  OAuthUserSignUpRequestDto,
} from './dtos/requests';
import {
  OAuthLoginUrlResponseDto,
  SendEmailCodeResponseDto,
  SignInResponseDto,
} from './dtos/responses';
import { JwtAuthGuard } from './guards';
import { UseEmailGuard } from './guards/use-email.guard';
import { UseOAuthGuard } from './guards/use-oauth.guard';

@ApiTags('auth')
@Controller('/admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: SendEmailCodeResponseDto })
  @Post('email/code')
  async sendCode(@Body() body: EmailVerificationMailingRequestDto) {
    const expiredAt = await this.authService.sendEmailCode(body);
    return SendEmailCodeResponseDto.transform({ expiredAt });
  }

  @HttpCode(200)
  @Post('email/code/verify')
  async verifyEmailCode(@Body() body: EmailVerificationCodeRequestDto) {
    await this.authService.verifyEmailCode(body);
  }

  @UseGuards(UseEmailGuard)
  @Post('signUp/email')
  async signUpEmailUser(@Body() body: EmailUserSignUpRequestDto) {
    await this.authService.signUpEmailUser(body);
  }

  @UseGuards(UseEmailGuard)
  @Post('signUp/invitation')
  async signUpInvitationUser(@Body() body: InvitationUserSignUpRequestDto) {
    await this.authService.signUpInvitationUser(body);
  }

  @UseGuards(UseOAuthGuard)
  @Post('signUp/oauth')
  async signUpOAuthUser(@Body() body: OAuthUserSignUpRequestDto) {
    await this.authService.signUpOAuthUser(body);
  }

  @ApiBody({ type: EmailUserSignInRequestDto })
  @ApiCreatedResponse({ type: SignInResponseDto })
  @Post('signIn/email')
  @UseGuards(UseEmailGuard, AuthGuard('local'))
  signInEmail(@CurrentUser() user: UserDto) {
    return this.authService.signIn(user);
  }

  @UseGuards(UseOAuthGuard)
  @ApiQuery({ name: 'callback_url', required: false })
  @ApiOkResponse({ type: OAuthLoginUrlResponseDto })
  @Get('signIn/oauth/loginURL')
  async redirectToLoginURL(@Query('callback_url') callbackUrl: string) {
    return {
      url: await this.authService.getOAuthLoginURL(callbackUrl),
    };
  }

  @UseGuards(UseOAuthGuard)
  @ApiQuery({ name: 'code', required: false })
  @ApiOkResponse({ type: SignInResponseDto })
  @Get('signIn/oauth')
  async handleCallback(@Query() query: { code: string }) {
    return await this.authService.signInByOAuth(query.code);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: SignInResponseDto })
  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  refreshToken(@CurrentUser() user: UserDto) {
    return this.authService.refreshToken(user);
  }
}
