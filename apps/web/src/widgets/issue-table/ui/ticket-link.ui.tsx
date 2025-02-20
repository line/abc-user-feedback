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

import { useOAIQuery } from '@/shared';

interface IProps extends React.PropsWithChildren {
  value?: string;
  projectId: number;
}

const TicketLink: React.FC<IProps> = ({ value, projectId }) => {
  const { data: issueTracker } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });

  const link = useMemo(() => {
    if (!issueTracker?.data.ticketDomain) return '';
    try {
      return new URL(
        `/browse/${issueTracker.data.ticketKey}-${value}`,
        issueTracker.data.ticketDomain,
      ).toString();
    } catch {
      return '';
    }
  }, [issueTracker]);

  return (
    value ?
      issueTracker ?
        <a
          className="text-tint-blue"
          href={link}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {`${issueTracker.data.ticketKey}-${value}`}
        </a>
      : value
    : <>-</>
  );
};

export default TicketLink;
