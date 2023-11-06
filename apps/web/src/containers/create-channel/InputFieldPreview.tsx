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
import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { toast } from '@ufb/ui';

import { Path } from '@/constants/path';
import { useCreateChannel } from '@/contexts/create-channel.context';
import { useOAIMutation } from '@/hooks';
import PreviewTable from '../setting-menu/FieldSetting/PreviewTable';
import CreateChannelInputTemplate from './CreateChannelInputTemplate';

interface IProps {}

const InputFieldPreview: React.FC<IProps> = () => {
  const { input } = useCreateChannel();
  const fields = useMemo(() => input.fields, [input.fields]);
  const router = useRouter();
  const projectId = useMemo(
    () => Number(router.query.projectId),
    [router.query.projectId],
  );

  const { mutate } = useOAIMutation({
    method: 'post',
    path: '/api/projects/{projectId}/channels',
    pathParams: { projectId },
    queryOptions: {
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
      onSuccess(data) {
        router.replace({
          pathname: Path.CREATE_CHANNEL_COMPLETE,
          query: { projectId, channelId: data?.id },
        });
      },
    },
  });

  return (
    <CreateChannelInputTemplate
      onComplete={() => {
        mutate({
          ...input.channelInfo,
          fields: input.fields.filter((v) => v.type !== 'DEFAULT'),
        });
      }}
    >
      <PreviewTable fields={fields.filter((v) => v.status === 'ACTIVE')} />
    </CreateChannelInputTemplate>
  );
};

export default InputFieldPreview;
