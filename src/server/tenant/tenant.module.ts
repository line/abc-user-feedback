/* */
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

/* */
import { TenantService } from './tenant.service'
import { TenantController } from './tenant.controller'
import { Service } from '#/core/entity'

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [TenantController],
  providers: [TenantService]
})
export class TenantModule {}
