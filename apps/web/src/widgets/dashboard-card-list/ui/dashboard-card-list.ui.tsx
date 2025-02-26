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
import {
  CreateFeedbackPerIssueCard,
  SevenDaysFeedbackCard,
  SevenDaysIssueCard,
  ThirtyDaysFeedbackCard,
  ThirtyDaysIssueCard,
  TodayFeedbackCard,
  TodayIssueCard,
  TotalFeedbackCard,
  TotalIssueCard,
  YesterdayFeedbackCard,
  YesterdayIssueCard,
} from '@/entities/dashboard';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
  invisible: Record<string, boolean>;
}

const DashboardCardList: React.FC<IProps> = (props) => {
  const { to, projectId, from, invisible } = props;
  return (
    <div className="flex flex-wrap gap-2.5">
      {/* t('dashboard-card.total-feedback.title') */}
      {!invisible.TotalFeedbackCard && (
        <TotalFeedbackCard projectId={projectId} from={from} to={to} />
      )}
      {/* t('dashboard-card.today-feedback.title') */}
      {!invisible.TodayFeedbackCard && (
        <TodayFeedbackCard projectId={projectId} />
      )}
      {/* t('dashboard-card.yesterday-feedback.title') */}
      {!invisible.YesterdayFeedbackCard && (
        <YesterdayFeedbackCard projectId={projectId} />
      )}
      {/* t('dashboard-card.n-days-feedback.title', { n: 7 }) */}
      {!invisible.SevenDaysFeedbackCard && (
        <SevenDaysFeedbackCard projectId={projectId} />
      )}
      {/* t('dashboard-card.n-days-feedback.title', { n: 30 }) */}
      {!invisible.ThirtyDaysFeedbackCard && (
        <ThirtyDaysFeedbackCard projectId={projectId} />
      )}

      {/* t('dashboard-card.total-issue.title') */}
      {!invisible.TotalIssueCard && (
        <TotalIssueCard projectId={projectId} from={from} to={to} />
      )}
      {/* t('dashboard-card.issue-ratio.title') */}
      {!invisible.CreateFeedbackPerIssueCard && (
        <CreateFeedbackPerIssueCard projectId={projectId} from={from} to={to} />
      )}
      {/* t('dashboard-card.today-issue.title') */}
      {!invisible.TodayIssueCard && <TodayIssueCard projectId={projectId} />}
      {/* t('dashboard-card.yesterday-issue.title') */}
      {!invisible.YesterdayIssueCard && (
        <YesterdayIssueCard projectId={projectId} />
      )}
      {/* t('dashboard-card.n-days-issue.title', { n: 7 }) */}
      {!invisible.SevenDaysIssueCard && (
        <SevenDaysIssueCard projectId={projectId} />
      )}
      {/* t('dashboard-card.n-days-issue.title', { n: 30 }) */}
      {!invisible.ThirtyDaysIssueCard && (
        <ThirtyDaysIssueCard projectId={projectId} />
      )}
    </div>
  );
};

export default DashboardCardList;
