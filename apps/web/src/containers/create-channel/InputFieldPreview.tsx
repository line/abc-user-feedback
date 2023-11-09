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
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { ErrorCode } from '@ufb/shared';
import { Popover, PopoverModalContent, toast } from '@ufb/ui';

import { Path } from '@/constants/path';
import { useCreateChannel } from '@/contexts/create-channel.context';
import { useOAIMutation } from '@/hooks';
import PreviewTable from '../setting-menu/FieldSetting/PreviewTable';
import CreateChannelInputTemplate from './CreateChannelInputTemplate';

interface IProps {}

const InputFieldPreview: React.FC<IProps> = () => {
  const { input, gotoStep } = useCreateChannel();

  const [openChannelInfoError, setOpenChannelInfoError] = useState(false);

  const fields = useMemo(() => input.fields, [input.fields]);
  const router = useRouter();
  const projectId = useMemo(
    () => Number(router.query.projectId),
    [router.query.projectId],
  );

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/projects/{projectId}/channels',
    pathParams: { projectId },
    queryOptions: {
      onError(error) {
        if (error.code === ErrorCode.Channel.ChannelAlreadyExists)
          setOpenChannelInfoError(true);
        else
          toast.negative({
            title: error?.message ?? 'Error',
            description: error?.code,
          });
      },
      onSuccess(data) {
        router.replace({
          pathname: Path.CREATE_CHANNEL_COMPLETE,
          query: { projectId, channelId: data?.id },
        });
      },
    },
  });
  const onComplete = () => {
    mutate({
      ...input.channelInfo,
      fields: input.fields.filter((v) => v.type !== 'DEFAULT'),
    });
  };

  return (
    <CreateChannelInputTemplate onComplete={onComplete} isLoading={isPending}>
      <PreviewTable fields={fields.filter((v) => v.status === 'ACTIVE')} />
      {openChannelInfoError && (
        <Popover
          modal
          open={openChannelInfoError}
          onOpenChange={setOpenChannelInfoError}
        >
          <PopoverModalContent
            title="안내"
            description="유효하지 않은 Channel 정보가 존재합니다."
            submitButton={{
              children: '확인',
              onClick: () => {
                setOpenChannelInfoError(false);
                gotoStep('channelInfo');
              },
            }}
          />
        </Popover>
      )}
    </CreateChannelInputTemplate>
  );
};

export default InputFieldPreview;
