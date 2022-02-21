import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({
    example: '',
    description: 'user nickname',
    required: true
  })
  public nickname: string
}
