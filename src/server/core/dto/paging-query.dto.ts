/* */
import { Max, Min, IsOptional, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'

/* */
import { Order } from '@/types'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class PagingQuery {
  @ApiPropertyOptional({ name: 'order', enum: Order, default: Order.DESC })
  @IsEnum(Order)
  @IsOptional()
  order?: Order = Order.ASC

  @ApiPropertyOptional({
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset: number = 0

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 100
  })
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 100
}
