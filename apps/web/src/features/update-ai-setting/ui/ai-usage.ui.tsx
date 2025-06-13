/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';
import { create } from 'zustand';

import { Button, Calendar, Switch, toast } from '@ufb/react';

import type { DateRangeType } from '@/shared';
import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  DateRangePicker,
  DescriptionTooltip,
  HelpCardDocs,
  SettingAlert,
  SimpleLineChart,
  TextInput,
  useOAIMutation,
  useOAIQuery,
} from '@/shared';
import type { AI } from '@/entities/ai';

import type { AISettingStore } from '../ai-setting-form.type';

const useAIUsageFormStore = create<AISettingStore>((set) => ({
  formId: 'ai-usage-form',
  isPending: false,
  setIsPending: (isPending) => set({ isPending }),
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),
}));

const chartData = { data: 0.1, fill: '#38BDF8' };

export const AIUsageForm = ({ projectId }: { projectId: number }) => {
  const { register, formState, setValue, watch, handleSubmit } = useForm<AI>();
  const { formId, setIsPending, setIsDirty } = useAIUsageFormStore();
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1, 0)),
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/ai/integrations',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: () => {
        toast.success('AI 설정이 저장되었습니다.');
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  const { data: integrationData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
  });

  const { data: dailyData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/usages',
    variables: {
      projectId,
      from: dateRange?.startDate?.toISOString() ?? '',
      to: dateRange?.endDate?.toISOString() ?? '',
    },
  });

  const { data: monthlyData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/usages',
    variables: {
      projectId,
      from: dayjs().startOf('month').toISOString(),
      to: dayjs().endOf('month').toISOString(),
    },
  });

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending]);

  useEffect(() => {
    setIsDirty(formState.isDirty);
  }, [formState.isDirty]);

  const montlyTotalUsage = useMemo(
    () => monthlyData?.reduce((acc, usage) => acc + usage.usedTokens, 0) ?? 0,
    [monthlyData],
  );
  const chartData = useMemo(() => {
    const result: Record<
      string,
      {
        date: string;
        Total: number;
        'AI Field': number;
        'AI Issue': number;
      }
    > = {};

    dailyData?.forEach((entry) => {
      const dateKey = `${entry.year}-${String(entry.month).padStart(2, '0')}-${String(entry.day).padStart(2, '0')}`;
      if (!result[dateKey]) {
        result[dateKey] = {
          date: dateKey,
          Total: 0,
          'AI Field': 0,
          'AI Issue': 0,
        };
      }

      result[dateKey].Total += entry.usedTokens;

      if (entry.category === 'AI_FIELD') {
        result[dateKey]['AI Field'] += entry.usedTokens;
      } else if (entry.category === 'ISSUE_RECOMMEND') {
        result[dateKey]['AI Issue'] += entry.usedTokens;
      }
    });

    return Object.values(result);
  }, [dailyData]);

  return (
    <>
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.api-key" />}
      />
      <form
        className="flex flex-row gap-4"
        id={formId}
        onSubmit={handleSubmit((v) => mutate(v))}
      >
        <div className="flex-[2]">
          <SimpleLineChart
            filterContent={
              <DateRangePicker
                onChange={setDateRange}
                value={dateRange}
                maxDate={new Date()}
              />
            }
            dataKeys={[
              { name: 'Total', color: '#4A90E2' },
              { name: 'AI Field', color: '#50E3C2' },
              { name: 'AI Issue', color: '#F5A623' },
            ]}
            title="사용 토큰량"
            data={chartData}
            showLegend
            description=""
            height={334}
          />
        </div>
        <Card className="min-h-30 flex-[1]">
          <CardHeader>
            <CardTitle>
              잔여 토큰량
              <DescriptionTooltip description="토큰 사용량은 매월 1일에 초기화됩니다." />
            </CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-8">
            <RadialBarChart
              data={[chartData]}
              endAngle={90 - chartData.data * 360}
              startAngle={90}
              innerRadius={80}
              outerRadius={110}
              width={180}
              height={180}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-[var(--bg-neutral-tertiary)] last:fill-[var(--bg-neutral-primary)]"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="data" background />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) - 12}
                            className="text-title-h4 fill-neutral-primary"
                          >
                            {(chartData.data * 100 || '-').toLocaleString()} %
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 12}
                            className="fill-neutral-secondary text-small-normal"
                          >
                            Remaining Tokens
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
            <div className="flex w-full flex-col gap-4">
              <div className="flex justify-between">
                <div>Used Tokens</div>
                <div>{montlyTotalUsage.toLocaleString()}</div>
              </div>
              <div className="flex justify-between">
                <div>Remaining Tokens</div>
                <div>{(900000).toLocaleString()}</div>
              </div>
              <div className="flex justify-between">
                <div>Monthly tokens reset in</div>
                <div>{(900000).toLocaleString()}</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </form>
      <div className="flex gap-4">
        <Card className="min-h-30 flex-[1]" size="md">
          <CardHeader
            action={
              <Switch
                checked={watch('tokenThreshold') !== null}
                onCheckedChange={(checked) => {
                  setValue('tokenThreshold', checked ? 1000000 : null, {
                    shouldDirty: true,
                  });
                  if (!checked) {
                    setValue('notificationThreshold', null, {
                      shouldDirty: true,
                    });
                  }
                }}
              />
            }
          >
            <CardTitle>Token Threshold</CardTitle>
            <CardDescription>
              토큰 사용량 상한을 설정하여 AI 기능에 대한 사용량을 제어할 수
              있습니다.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <TextInput type="number" {...register('tokenThreshold')} />
          </CardBody>
        </Card>
        <Card className="min-h-30 flex-[1]" size="md">
          <CardHeader
            action={
              <Switch
                disabled={watch('tokenThreshold') === null}
                checked={watch('notificationThreshold') !== null}
                onCheckedChange={(checked) => {
                  setValue('notificationThreshold', checked ? 1000000 : null, {
                    shouldDirty: true,
                  });
                }}
              />
            }
          >
            <CardTitle>Pre-limit notification</CardTitle>
            <CardDescription>
              토큰 사용량 상한을 기준으로 사용량에 대한 노티를 미리 안내 받을 수
              있습니다.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <TextInput />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export const AIUsageFormButton = () => {
  const { formId, isPending, isDirty } = useAIUsageFormStore();
  return (
    <Button form={formId} type="submit" disabled={!isDirty} loading={isPending}>
      저장
    </Button>
  );
};
