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

import { Path } from '@/constants/path';
import { useChannels } from '@/hooks';
import { FeedbackTableProvider } from './feedback-table.context';
import FeedbackTable from './FeedbackTable';

interface IProps {
  issueId?: number;
  projectId: number;
  channelId?: number | null;
}

const FeedbackTableWrapper: React.FC<IProps> = (props) => {
  const { projectId, issueId, channelId } = props;
  const router = useRouter();
  const { data: channels } = useChannels(projectId);

  const currentChannelId = useMemo(() => {
    if (channelId) return channelId;
    if (!channels) return undefined;
    return channels.items?.[0]?.id;
  }, [channelId, channels]);

  if (!currentChannelId) return <div>No Channel</div>;

  return (
    <FeedbackTableProvider projectId={projectId} channelId={currentChannelId}>
      <FeedbackTable
        issueId={issueId}
        onChangeChannel={(channelId: number) =>
          router.push({
            pathname: Path.FEEDBACK,
            query: { projectId, channelId },
          })
        }
      />
    </FeedbackTableProvider>
  );
};

export default FeedbackTableWrapper;
