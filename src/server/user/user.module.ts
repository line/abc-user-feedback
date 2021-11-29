/* */
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

/* */
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AuthService } from '#/auth/auth.service'
import {
  Account,
  CustomAuth,
  EmailAuth,
  Service,
  User,
  Role,
  RolePermissionBinding,
  UserProfile,
  RoleUserBinding
} from '#/core/entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      Account,
      EmailAuth,
      CustomAuth,
      Role,
      RolePermissionBinding,
      RoleUserBinding,
      Service
    ])
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService]
})
export class UserModule {}
