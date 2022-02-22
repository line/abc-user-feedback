/* */
import { IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PaginatedResultDto<TData> {
  @IsNumber()
  @ApiProperty()
  total: number

  results: Array<TData>

  constructor(total: number, results: Array<TData>) {
    this.total = total
    this.results = results
  }
}
