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

import { useChannels } from '@/hooks';

import useFeedbackTable from '../feedback-table.context';

interface IProps extends React.PropsWithChildren {
  onChangeChannel: (channelId: number) => void;
}

const ChannelSelectBox: React.FC<IProps> = ({ onChangeChannel }) => {
  const { channelId, projectId } = useFeedbackTable();

  const { data: channels } = useChannels(projectId);
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {channels?.items.map((channel) => (
        <div
          key={channel.id}
          onClick={() => onChangeChannel(channel.id)}
          className={[
            'flex items-center gap-2 min-w-[136px] border rounded px-3 py-2.5 cursor-pointer h-10',
            channel.id === channelId ? 'border-fill-primary' : 'opacity-50',
          ].join(' ')}
        >
          <div className="bg-fill-tertiary rounded-sm p-1 inline-flex">
            <Icon name="ChannelFill" size={12} className="text-secondary" />
          </div>
          <span>{channel.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ChannelSelectBox;
