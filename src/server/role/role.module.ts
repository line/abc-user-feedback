/* */
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

/* */
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { Role, RolePermissionBinding, RoleUserBinding } from '#/core/entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleUserBinding, RolePermissionBinding])
  ],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
