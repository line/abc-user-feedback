/* */
import { PickType } from '@nestjs/swagger'

/* */
import { Role } from '#/core/entity'
import { ApiProperty } from '@nestjs/swagger'

export class RoleDto extends PickType(Role, [
  'id',
  'name',
  'description',
  'createdTime',
  'updatedTime'
] as const) {
  constructor(data) {
    super(data)
  }
}
