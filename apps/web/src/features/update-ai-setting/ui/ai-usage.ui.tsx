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
  Tooltip,
} from 'recharts';
import { create } from 'zustand';

import { Button, Switch, toast } from '@ufb/react';

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
  SelectInput,
  SettingAlert,
  SimpleLineChart,
  TextInput,
  useOAIMutation,
  useOAIQuery,
  useWarnIfUnsavedChanges,
} from '@/shared';

import type { AISettingStore } from '../ai-setting-form.type';

const useAIUsageFormStore = create<AISettingStore>((set) => ({
  formId: 'ai-usage-form',
  isPending: false,
  setIsPending: (isPending) => set({ isPending }),
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),
}));
type UsageForm = {
  tokenThreshold: number | null;
  percentage: string | undefined;
};
export const AIUsageForm = ({ projectId }: { projectId: number }) => {
  const { register, formState, setValue, watch, handleSubmit, reset } =
    useForm<UsageForm>();

  const { formId, setIsPending, setIsDirty } = useAIUsageFormStore();

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/ai/integrations',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.success('AI 설정이 저장되었습니다.');
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  const { data: integrationData, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
  });

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending]);

  useEffect(() => {
    setIsDirty(formState.isDirty);
  }, [formState.isDirty]);
  useWarnIfUnsavedChanges(formState.isDirty);

  useEffect(() => {
    if (integrationData) {
      reset({
        tokenThreshold: integrationData.tokenThreshold ?? null,
        percentage:
          integrationData.notificationThreshold ?
            (
              (integrationData.notificationThreshold /
                (integrationData.tokenThreshold ?? 1)) *
              100
            ).toFixed(0)
          : undefined,
      });
    }
  }, [integrationData]);

  const onSubmit = (data: UsageForm) => {
    if (!integrationData) return;
    const { percentage, tokenThreshold } = data;

    mutate({
      ...integrationData,
      tokenThreshold: tokenThreshold ? +tokenThreshold : null,
      notificationThreshold:
        tokenThreshold && percentage ?
          tokenThreshold * (parseInt(percentage, 10) / 100)
        : null,
    });
    setIsDirty(false);
  };

  return (
    <>
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.api-key" />}
      />
      <form
        id={formId}
        className="flex flex-row gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-[2]">
          <AIChartCard projectId={projectId} />
        </div>
        <div className="flex-[1]">
          <AIChartUsageCard projectId={projectId} />
        </div>
      </form>
      <div className="flex gap-4">
        <Card className="flex-[1]" size="md">
          <CardHeader
            action={
              <Switch
                checked={watch('tokenThreshold') !== null}
                onCheckedChange={(checked) => {
                  setValue('tokenThreshold', checked ? 1000000 : null, {
                    shouldDirty: true,
                  });
                  if (!checked) {
                    setValue('percentage', undefined, { shouldDirty: true });
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
        <Card className="flex-[1]" size="md">
          <CardHeader
            action={
              <Switch
                disabled={watch('tokenThreshold') === null}
                checked={!!watch('percentage')}
                onCheckedChange={(checked) =>
                  setValue('percentage', checked ? '50' : undefined, {
                    shouldDirty: true,
                  })
                }
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
            <SelectInput
              disabled={!watch('percentage')}
              value={watch('percentage')}
              onChange={(value) =>
                setValue('percentage', value, { shouldDirty: true })
              }
              options={[
                { value: '50', label: '상한값의 50% 도달' },
                { value: '60', label: '상한값의 60% 도달' },
                { value: '70', label: '상한값의 70% 도달' },
                { value: '80', label: '상한값의 80% 도달' },
                { value: '90', label: '상한값의 90% 도달' },
                { value: '95', label: '상한값의 95% 도달' },
              ]}
            />
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

const AIChartCard = ({ projectId }: { projectId: number }) => {
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1, 0)),
  });

  const { data: dailyData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/usages',
    variables: {
      projectId,
      from: dateRange?.startDate?.toISOString() ?? '',
      to: dateRange?.endDate?.toISOString() ?? '',
    },
  });

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
      result[dateKey] ??= {
        date: dateKey,
        Total: 0,
        'AI Field': 0,
        'AI Issue': 0,
      };

      result[dateKey].Total += entry.usedTokens;

      if (entry.category === 'AI_FIELD') {
        result[dateKey]['AI Field'] += entry.usedTokens;
      } else {
        result[dateKey]['AI Issue'] += entry.usedTokens;
      }
    });

    return Object.values(result);
  }, [dailyData]);

  return (
    <SimpleLineChart
      filterContent={
        <DateRangePicker
          onChange={setDateRange}
          value={dateRange}
          maxDate={new Date()}
          numberOfMonths={1}
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
  );
};
const AIChartUsageCard = ({ projectId }: { projectId: number }) => {
  const { data: integrationData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
  });
  const { data: monthlyData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/usages',
    variables: {
      projectId,
      from: dayjs().startOf('month').toISOString(),
      to: dayjs().endOf('month').toISOString(),
    },
  });

  const usedTokens = useMemo(
    () => monthlyData?.reduce((acc, usage) => acc + usage.usedTokens, 0) ?? 0,
    [monthlyData],
  );

  const remainingTokens = useMemo(
    () => (integrationData?.tokenThreshold ?? 0) - usedTokens,
    [integrationData, usedTokens],
  );

  const usedPercentage = useMemo(
    () =>
      integrationData?.tokenThreshold ?
        (remainingTokens / integrationData.tokenThreshold) * 100
      : 0,
    [usedTokens, integrationData, remainingTokens],
  );
  const remainingPercentage = useMemo(
    () =>
      integrationData?.tokenThreshold ?
        (remainingTokens / integrationData.tokenThreshold) * 100
      : 0,
    [integrationData, usedTokens],
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          잔여 토큰량
          <DescriptionTooltip description="토큰 사용량은 매월 1일에 초기화됩니다." />
        </CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col items-center gap-8">
        <RadialBarChart
          data={[
            {
              remainingTokens,
              fill: '#38BDF8',
              name: 'Remaining Tokens',
            },
          ]}
          startAngle={90}
          endAngle={Math.max(90 + 360 * (usedPercentage / 100), 90)}
          innerRadius={80}
          outerRadius={110}
          width={180}
          height={180}
        >
          <Tooltip
            formatter={(value) => value.toLocaleString()}
            cursor={{ fill: 'var(--bg-neutral-tertiary)' }}
            content={({ payload }) => {
              return (
                <div className="bg-neutral-primary border-neutral-tertiary max-w-[240px] rounded border px-4 py-3 shadow-lg">
                  {payload?.map(({ value, payload }, i) => (
                    <div
                      key={i}
                      className="text-neutral-secondary text-small-normal flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            backgroundColor: (payload as { fill: string }).fill,
                          }}
                          className="h-2 w-2 flex-shrink-0 rounded-full"
                        />
                        <p className="text-small-normal break-all">
                          {(payload as { name: string | undefined }).name}
                        </p>
                      </div>
                      <p>{value?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-[var(--bg-neutral-tertiary)] last:fill-[var(--bg-neutral-primary)]"
            polarRadius={[86, 74]}
          />
          <RadialBar dataKey="remainingTokens" background />
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
                        {integrationData?.tokenThreshold ?
                          `${usedPercentage.toFixed(1)}%`
                        : '-'}
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
        {integrationData?.tokenThreshold ?
          <div className="flex w-full flex-col gap-4">
            <div className="flex justify-between">
              <div>Used Tokens</div>
              <div>
                {usedTokens.toLocaleString()} ({usedPercentage.toFixed(1)}%)
              </div>
            </div>
            <div className="flex justify-between">
              <div>Remaining Tokens</div>
              <div>
                {remainingTokens.toLocaleString()} (
                {remainingPercentage.toFixed(1)}%)
              </div>
            </div>
            <div className="flex justify-between">
              <div>Monthly tokens reset in</div>
              <div>매월 1일</div>
            </div>
          </div>
        : <p className="text-center">
            잔여 토큰량을 확인하려면 상한값을 먼저 설정해 주세요.
          </p>
        }
      </CardBody>
    </Card>
  );
};
