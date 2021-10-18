/* */
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

/* */
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '#/user/user.module'
import { LocalStrategy } from './local.strategy'
import { User, Account, EmailAuth, UserProfile, Service } from '#/core/entity'

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, UserProfile, Service, Account, EmailAuth]),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
