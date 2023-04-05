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
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
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
} from './dtos/requests';
import { SignInResponseDto } from './dtos/responses';
import { SendEmailCodeResponseDto } from './dtos/responses';
import { JwtAuthGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
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

  @Post('signUp/email')
  async signUpEmailUser(@Body() body: EmailUserSignUpRequestDto) {
    await this.authService.signUpEmailUser(body);
  }

  @Post('signUp/invitation')
  async signUpInvitationUser(@Body() body: InvitationUserSignUpRequestDto) {
    await this.authService.signUpInvitationUser(body);
  }

  @ApiBody({ type: EmailUserSignInRequestDto })
  @ApiCreatedResponse({ type: SignInResponseDto })
  @Post('signIn/email')
  @UseGuards(AuthGuard('local'))
  signInEmail(@CurrentUser() user: UserDto) {
    return this.authService.signIn(user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: SignInResponseDto })
  @Get('signIn/google')
  @UseGuards(AuthGuard('google'))
  googleLogin(@CurrentUser() user: UserDto) {
    return this.authService.signIn(user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: SignInResponseDto })
  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  refreshToken(@CurrentUser() user: UserDto) {
    return this.authService.refreshToken(user);
  }
}
