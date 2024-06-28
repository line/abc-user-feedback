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

import { Icon } from '@ufb/ui';

import { useFeedbackTable } from '../model';

import { DescriptionTooltip } from '@/components';
import { useChannels } from '@/hooks';
import { getDescriptionStr } from '@/utils/description-string';

interface IProps {
  onChangeChannel: (channelId: number) => void;
}

const ChannelSelectBox: React.FC<IProps> = ({ onChangeChannel }) => {
  const { channelId, projectId } = useFeedbackTable();

  const { data: channels } = useChannels(projectId);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {channels?.items.map((channel) => (
        <div
          key={channel.id}
          onClick={() => onChangeChannel(channel.id)}
          className={[
            'flex h-10 min-w-[136px] cursor-pointer items-center justify-between gap-2 rounded border px-3 py-2.5',
            channel.id === channelId ? 'border-fill-primary' : 'opacity-50',
          ].join(' ')}
        >
          <div className="flex items-center gap-2">
            <div className="bg-fill-tertiary inline-flex rounded-sm p-1">
              <Icon name="ChannelFill" size={12} className="text-secondary" />
            </div>
            <span>{channel.name}</span>
          </div>
          <DescriptionTooltip
            description={getDescriptionStr(channel.description)}
          />
        </div>
      ))}
    </div>
  );
};

export default ChannelSelectBox;
