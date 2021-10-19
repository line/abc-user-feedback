import { IsNumber, Min, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export default class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number = 0

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 100
}
