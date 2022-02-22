/* */
import { ApiProperty } from '@nestjs/swagger'

/* */
import { IUser } from '@/types'

export class UserDto implements IUser {
  @ApiProperty()
  id: string

  @ApiProperty()
  email: string

  @ApiProperty()
  profile: {
    nickname: string
    avatarUrl: string
  }

  @ApiProperty()
  role: {
    id: string
    name
    string
  }

  @ApiProperty()
  nickname: string

  @ApiProperty()
  avatarUrl?: string

  constructor(data) {
    for (let key in data) {
      this[key] = data[key]
    }
  }
}
