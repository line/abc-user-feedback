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

import type { IssueTrackerType } from '@/types/issue-tracker.type';

interface IProps extends React.PropsWithChildren {
  value?: string;
  issueTracker: IssueTrackerType;
}

const TicketLink: React.FC<IProps> = ({ value, issueTracker }) => {
  const link = useMemo(() => {
    try {
      return new URL(
        `/browse/${issueTracker?.ticketKey}-${value}`,
        issueTracker?.ticketDomain,
      ).toString();
    } catch (error) {
      return '';
    }
  }, [issueTracker, value]);

  return value ? (
    <a
      className="text-blue-primary"
      href={link}
      target="_blank"
      rel="noreferrer"
    >
      {`${issueTracker?.ticketKey}-${value}`}
    </a>
  ) : (
    <>-</>
  );
};

export default TicketLink;
