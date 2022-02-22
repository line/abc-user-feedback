/* */
import { applyDecorators, Type } from '@nestjs/common'
import { ApiOkResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger'
import { ApiResponseOptions } from '@nestjs/swagger'

/* */
import { PaginatedResultDto } from '#/core/dto'

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  options?: ApiResponseOptions
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResultDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) }
              }
            }
          }
        ]
      }
    })
  )
}
