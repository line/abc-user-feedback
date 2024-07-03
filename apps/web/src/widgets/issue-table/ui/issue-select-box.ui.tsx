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
import { useTranslation } from 'react-i18next';

import { ISSUES } from '@/shared';
import type { IssueStatus } from '@/entities/issue';
import { IssueCircle } from '@/entities/issue';

interface IProps extends React.PropsWithChildren {
  onChangeOption: (status: string) => void;
  currentIssueKey: string | undefined;
  issueCountData: { key: string; count: number }[] | undefined;
}

const IssueTableSelectBox: React.FC<IProps> = (props) => {
  const { currentIssueKey, onChangeOption, issueCountData } = props;

  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      {[{ key: 'total' }, ...ISSUES(t)].map((issue) => (
        <div
          key={issue.key}
          className={[
            'flex min-w-[136px] cursor-pointer items-center justify-between rounded border px-3 py-2.5',
            (
              currentIssueKey === issue.key ||
              (currentIssueKey === undefined && issue.key === 'total')
            ) ?
              'border-fill-primary'
            : 'opacity-50',
          ].join(' ')}
          onClick={() => onChangeOption(issue.key)}
        >
          <div className="flex flex-1 items-center gap-2">
            <IssueCircle
              issueKey={
                issue.key === 'total' ? undefined : (issue.key as IssueStatus)
              }
            />
            <span className="whitespace-nowrap">
              {ISSUES(t).find((v) => v.key === issue.key)?.name ??
                t('text.all')}
            </span>
          </div>
          <p className="text-secondary ml-1.5">
            {t('text.number-count', {
              count:
                issueCountData?.find((v) => v.key === issue.key)?.count ?? 0,
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default IssueTableSelectBox;
