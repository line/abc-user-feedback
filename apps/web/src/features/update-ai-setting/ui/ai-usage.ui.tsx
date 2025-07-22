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
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Tooltip,
} from 'recharts';
import { z } from 'zod';
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
const usageSchema = z.object({
  tokenThreshold: z.number().min(1).nullable(),
  percentage: z.string().optional(),
});
type UsageForm = z.infer<typeof usageSchema>;

export const AIUsageForm = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();

  const { register, formState, setValue, watch, handleSubmit, reset } =
    useForm<UsageForm>({ resolver: zodResolver(usageSchema) });

  const { formId, setIsPending, setIsDirty } = useAIUsageFormStore();

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/ai/integrations',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        toast.success(t('v2.toast.success'));
        await refetch();
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
    console.log('data: ', data);
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
      <SettingAlert description={t('help-card.ai-usage')} />
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row gap-4">
          <div className="flex-[2]">
            <AIChartCard projectId={projectId} />
          </div>
          <div className="flex-[1]">
            <AIChartUsageCard projectId={projectId} />
          </div>
        </div>
        <div className="flex gap-4">
          <Card className="flex-[1]" size="md">
            <CardHeader
              className="flex-1"
              action={
                <Switch
                  checked={watch('tokenThreshold') !== null}
                  onCheckedChange={(checked) => {
                    setValue('tokenThreshold', checked ? 0 : null, {
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
                {t('v2.description.token-threshold')}
              </CardDescription>
            </CardHeader>
            <CardBody>
              <TextInput
                type="number"
                disabled={watch('tokenThreshold') === null}
                {...register('tokenThreshold', { valueAsNumber: true })}
                error={formState.errors.tokenThreshold?.message}
              />
            </CardBody>
          </Card>
          <Card className="flex-[1]" size="md">
            <CardHeader
              className="flex-1"
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
                {t('v2.description.pre-limit-notification')}
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
                  {
                    value: '50',
                    label: t('v2.text.token-threshold-percentage', {
                      percentage: 50,
                    }),
                  },
                  {
                    value: '60',
                    label: t('v2.text.token-threshold-percentage', {
                      percentage: 60,
                    }),
                  },
                  {
                    value: '70',
                    label: t('v2.text.token-threshold-percentage', {
                      percentage: 70,
                    }),
                  },
                  {
                    value: '80',
                    label: t('v2.text.token-threshold-percentage', {
                      percentage: 80,
                    }),
                  },
                  {
                    value: '90',
                    label: t('v2.text.token-threshold-percentage', {
                      percentage: 90,
                    }),
                  },
                  {
                    value: '95',
                    label: t('v2.text.token-threshold-percentage', {
                      percentage: 95,
                    }),
                  },
                ]}
              />
            </CardBody>
          </Card>
        </div>
      </form>
    </>
  );
};

export const AIUsageFormButton = () => {
  const { t } = useTranslation();
  const { formId, isPending, isDirty } = useAIUsageFormStore();
  return (
    <Button form={formId} type="submit" disabled={!isDirty} loading={isPending}>
      {t('v2.button.save')}
    </Button>
  );
};

const AIChartCard = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: dayjs().startOf('month').toDate(),
    endDate: dayjs().toDate(),
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
    const endDate = dayjs(dateRange?.endDate).endOf('day');
    let currentDate = dayjs(dateRange?.startDate).startOf('day');
    while (currentDate.isBefore(endDate)) {
      const dateKey = currentDate.format('YYYY-MM-DD');
      result[dateKey] ??= {
        date: dateKey,
        Total: 0,
        'AI Field': 0,
        'AI Issue': 0,
      };
      currentDate = currentDate.add(1, 'day');
    }

    dailyData?.forEach((entry) => {
      const dateKey = `${entry.year}-${String(entry.month).padStart(2, '0')}-${String(entry.day).padStart(2, '0')}`;
      if (result[dateKey]) {
        result[dateKey].Total += entry.usedTokens;
        if (entry.category === 'AI_FIELD') {
          result[dateKey]['AI Field'] += entry.usedTokens;
        } else {
          result[dateKey]['AI Issue'] += entry.usedTokens;
        }
      }
    });

    return Object.values(result);
  }, [dailyData, dateRange]);

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
      title={t('v2.text.token-usage')}
      data={chartData}
      showLegend
      height={334}
    />
  );
};
const AIChartUsageCard = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();
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
    () => Math.max((integrationData?.tokenThreshold ?? 0) - usedTokens, 0),
    [integrationData, usedTokens],
  );

  const usedPercentage = useMemo(
    () =>
      integrationData?.tokenThreshold ?
        (usedTokens / integrationData.tokenThreshold) * 100
      : 0,
    [usedTokens, integrationData],
  );

  const remainingPercentage = useMemo(
    () =>
      integrationData?.tokenThreshold ?
        (remainingTokens / integrationData.tokenThreshold) * 100
      : 0,
    [integrationData, remainingTokens],
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('v2.text.remaining-token-amount')}</CardTitle>
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
          endAngle={Math.max(90 + 360 * (remainingPercentage / 100), 90)}
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
                          `${remainingPercentage.toFixed(1)}%`
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
              <div>1st of every month</div>
            </div>
          </div>
        : <p className="text-center">
            {t('v2.description.remaining-token-amount')}
          </p>
        }
      </CardBody>
    </Card>
  );
};
