/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

<<<<<<<< HEAD:apps/api/src/domains/admin/project/category/dtos/requests/update-category-request.dto.ts
import { CreateCategoryRequestDto } from './create-category-request.dto';

export class UpdateCategoryRequestDto extends CreateCategoryRequestDto {
  @ApiProperty({
    description: 'Category name',
    example: 'category',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  declare name: string;
}
========
import { roleSchema } from '../role';
import { userSchema } from '../user/user.schema';

export const memberSchema = z.object({
  id: z.number(),
  user: userSchema.pick({
    id: true,
    email: true,
    name: true,
    department: true,
  }),
  role: roleSchema,
  createdAt: z.string(),
});

export const memberInfoSchema = memberSchema.partial({
  id: true,
  createdAt: true,
});

export const memberInfoFormSchema = memberSchema
  .partial({ id: true, createdAt: true, user: true })
  .refine((data) => !!data.user, { path: ['user'] });
>>>>>>>> c43b0c82 (Merge 'dev'):apps/web/src/entities/member/member.schema.ts
