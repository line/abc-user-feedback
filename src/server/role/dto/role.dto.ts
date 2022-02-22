import { ApiProperty } from '@nestjs/swagger'

export class RoleDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  createdTime: Date

  @ApiProperty()
  updatedTime: Date

  constructor(data) {
    for (let key in data) {
      this[key] = data[key]
    }
  }
}
