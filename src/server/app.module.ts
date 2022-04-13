/* */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpModule } from '@nestjs/axios'
import { TerminusModule } from '@nestjs/terminus'

/* */
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module'
import { AuthModule } from './auth/auth.module'
import { ViewModule } from './view/view.module'
import { AdminModule } from './admin/admin.module'
import { TenantModule } from './tenant/tenant.module'
import { FeedbackModule } from './feedback/feedback.module'
import { RoleModule } from './role/role.module'
import { PermissionModule } from './permission/permission.module'
import {
  CheckTenantMiddleware,
  UserMiddleware,
  CustomUserMiddleware,
  PermissionMiddleware
} from './core/middleware'
import { AuthService } from './auth/auth.service'
import {
  Account,
  User,
  UserProfile,
  RoleUserBinding,
  RolePermissionBinding,
  Role,
  Service,
  EmailAuth,
  CustomAuth
} from './core/entity'
import {
  CoreConfigModule,
  CoreRenderModule,
  CoreTypeOrmModule,
  CoreMailerModule
} from './core/module'
import { UserService } from './user/user.service'
import { HealthController } from './health/health.controller'

const modules = [
  CoreTypeOrmModule,
  CoreRenderModule,
  CoreMailerModule,
  HttpModule,
  TypeOrmModule.forFeature([
    User,
    UserProfile,
    Service,
    CustomAuth,
    Account,
    EmailAuth,
    Role,
    RolePermissionBinding,
    RoleUserBinding
  ]),
  UserModule,
  PermissionModule,
  PostModule,
  AdminModule,
  FeedbackModule,
  AuthModule,
  TenantModule,
  RoleModule,
  TerminusModule,
  ViewModule,
  CoreConfigModule
]

@Module({
  imports: modules,
  controllers: [HealthController],
  providers: [AuthService, UserService, ConfigService],
  exports: [ConfigService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTenantMiddleware)
      .exclude('api*')
      .exclude('health')
      .exclude('_next*')
    consumer
      .apply(CustomUserMiddleware, UserMiddleware, PermissionMiddleware)
      .exclude('_next*')
      .exclude('health')
      .forRoutes('*')
  }
}
