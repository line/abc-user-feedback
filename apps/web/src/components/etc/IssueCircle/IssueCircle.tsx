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
import { useTranslation } from 'react-i18next';

import { ISSUES } from '@/constants/issues';

interface IProps {
  issueKey?: string;
}

const IssueCircle: React.FC<IProps> = ({ issueKey }) => {
  const { t } = useTranslation();

  const circleColor = useMemo(() => {
    const issue = ISSUES(t).find((v) => v.key === issueKey);

    switch (issue?.color) {
      case 'red':
        return 'bg-red-primary';
      case 'blue':
        return 'bg-blue-primary';
      case 'yellow':
        return 'bg-yellow-primary';
      case 'green':
        return 'bg-green-primary';
      case 'purple':
        return 'bg-purple-primary';
      default:
        return '';
    }
  }, [t, issueKey]);
  return (
    <div
      className={[
        'w-1.5 h-1.5 rounded-full border border-fill-secondary mr-1.5 bg-',
        circleColor,
      ].join(' ')}
    />
  );
};

export default IssueCircle;
