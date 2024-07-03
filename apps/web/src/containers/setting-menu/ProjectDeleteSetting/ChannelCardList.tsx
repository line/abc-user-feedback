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
import { useFeedbackSearch } from '@/entities/feedback';

import { ChannelCard } from '@/components/cards';

interface IProps extends React.PropsWithChildren {
  projectId: number;
  channelId: number;
  name: string;
  createdAt: string;
}

const ChannelCardList: React.FC<IProps> = (props) => {
  const { projectId, channelId, name } = props;

  const { data: feedbackData } = useFeedbackSearch(projectId, channelId, {
    query: {},
    limit: 0,
  });

  return (
    <ChannelCard
      name={name}
      value={(feedbackData?.meta.totalItems ?? 0).toLocaleString()}
      iconName="BubbleDotsFill"
      color="green"
    />
  );
};

export default ChannelCardList;
