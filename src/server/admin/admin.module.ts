/* */
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

/* */
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { Service } from '#/core/entity'

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
