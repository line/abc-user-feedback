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
import { useEffect, useState } from 'react';

import { useOAIQuery } from '@/shared';

import { FeedbackTableProvider } from '../model';
import FeedbackTable from './feedback-table';

interface IProps {
  issueId: number;
  projectId: number;
}

const FeedbackTableInIssue: React.FC<IProps> = (props) => {
  const { projectId, issueId } = props;
  const { data: channels } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });
  const [currentChannelId, setCurrentChannelId] = useState<number>(0);

  useEffect(() => {
    setCurrentChannelId(channels?.items?.[0]?.id ?? 0);
  }, [channels]);

  if (!currentChannelId) return <div>Loading...</div>;

  return (
    <FeedbackTableProvider projectId={projectId} channelId={currentChannelId}>
      <FeedbackTable
        issueId={issueId}
        onChangeChannel={setCurrentChannelId}
        sub
      />
    </FeedbackTableProvider>
  );
};

export default FeedbackTableInIssue;
