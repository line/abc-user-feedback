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
import type { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetImageUploadUrlResponseDto implements PresignedPost {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Presigned post url',
    example: 'https://example.com',
  })
  url: string;

  @Expose()
  @ApiProperty({
    type: Object,
    description: 'Presigned post fields',
    example: {
      key: 'key',
      bucket: 'bucket',
      'X-Amz-Algorithm': 'X-Amz-Algorithm',
      'X-Amz-Credential': 'X-Amz-Credential',
      'X-Amz-Date': 'X-Amz-Date',
      Policy: 'Policy',
      'X-Amz-Signature': 'X-Amz-Signature',
    },
  })
  fields: Record<string, string>;
}
