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
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import client from '@/libs/client';
import type { OAIPathParameters, OAIRequestBody } from '@/types/openapi.type';

type IPath = OAIPathParameters<
  '/api/projects/{projectId}/channels/{channelId}/feedbacks/export',
  'post'
>;
type IBody = OAIRequestBody<
  '/api/projects/{projectId}/channels/{channelId}/feedbacks/export',
  'post'
>;

interface IInput {
  params: IPath;
  options?: Omit<
    UseMutationOptions<void, unknown, IBody, unknown>,
    'mutationKey' | 'mutationFn'
  >;
}
const useDownload = ({ params, options }: IInput) => {
  return useMutation({
    mutationKey: [
      '/api/projects/{projectId}/channels/{channelId}/feedbacks/export',
      params,
    ],
    mutationFn: async (body: IBody) => {
      const { data, headers } = await client.post({
        path: '/api/projects/{projectId}/channels/{channelId}/feedbacks/export',
        pathParams: params,
        body,
        config: { responseType: 'arraybuffer' },
      });

      const filename = (headers as any)?.['content-disposition'].split(
        'filename=',
      )[1];
      const decodedFilename = decodeURI(filename.slice(1, filename.length - 1));

      const url = window.URL.createObjectURL(new Blob([data as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', decodedFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    ...options,
  });
};

export default useDownload;
