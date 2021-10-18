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
import {
  CheckTenantMiddleware,
  UserMiddleware,
  CustomUserMiddleware
} from './core/middleware'
import { AuthService } from './auth/auth.service'
import {
  Account,
  User,
  UserProfile,
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
import { CaslModule } from './casl/casl.module'

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
    EmailAuth
  ]),
  UserModule,
  PostModule,
  AdminModule,
  FeedbackModule,
  AuthModule,
  TenantModule,
  TerminusModule,
  CoreConfigModule,
  ViewModule
]

@Module({
  imports: modules,
  controllers: [HealthController],
  providers: [AuthService, UserService, ConfigService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTenantMiddleware)
      .exclude('api*')
      .exclude('health')
      .exclude('_next*')
    consumer
      .apply(CustomUserMiddleware, UserMiddleware)
      .exclude('_next*')
      .exclude('health')
      .forRoutes('*')
  }
}
