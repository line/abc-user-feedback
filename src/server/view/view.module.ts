/* */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

/* */
import { ViewService } from './view.service'
import { ViewController } from './view.controller'
import { CheckTenantMiddleware } from '#/core/middleware'
import { UserService } from '#/user/user.service'
import { AuthService } from '#/auth/auth.service'
import {
  Service,
  User,
  Account,
  EmailAuth,
  UserProfile,
  Role,
  RoleUserBinding,
  RolePermissionBinding
} from '#/core/entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      User,
      UserProfile,
      Account,
      EmailAuth,
      Role,
      RoleUserBinding,
      RolePermissionBinding
    ])
  ],
  controllers: [ViewController],
  providers: [ViewService, UserService, AuthService]
})
export class ViewModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckTenantMiddleware).forRoutes(ViewController)
  }
}
