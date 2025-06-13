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

import React, { useEffect, useState } from 'react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import type { FormState } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';
import { create } from 'zustand';

import {
  Button,
  Icon,
  InputField,
  InputLabel,
  Menu,
  MenuItem,
  Switch,
  Textarea,
  toast,
} from '@ufb/react';

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  DescriptionTooltip,
  HelpCardDocs,
  SettingAlert,
  SettingTemplate,
  SimpleLineChart,
  TextInput,
  useOAIMutation,
} from '@/shared';
import type { AI } from '@/entities/ai';
import { AiSettingForm } from '@/entities/ai';

const SUB_MENU_ITEMS = [
  { value: 'setting', label: 'AI Setting' },
  { value: 'usage', label: 'AI Usage' },
  { value: 'field-template', label: 'AI Field Template' },
  { value: 'field-template-form', label: 'AI Issue Recommend' },
  { value: 'issue-recommend', label: 'AI Issue Recommend' },
] as const;

const GenerativeAiSetting = ({ projectId }: { projectId: number }) => {
  const [subMenu, setSubMenu] = useQueryState(
    'sub-menu',
    parseAsStringLiteral(SUB_MENU_ITEMS.map((item) => item.value)).withDefault(
      'setting',
    ),
  );

  return (
    <>
      <SettingTemplate
        title={
          subMenu === 'field-template-form' ? 'Template Details' : (
            '생성형 AI 연동'
          )
        }
        action={
          subMenu === 'field-template-form' ? <AISettingFormButton /> : <></>
        }
        onClickBack={
          subMenu === 'field-template-form' ?
            () => setSubMenu('field-template')
          : undefined
        }
      >
        {subMenu !== 'field-template-form' && (
          <Menu
            type="single"
            orientation="horizontal"
            value={subMenu}
            onValueChange={(v) => setSubMenu(v as typeof subMenu)}
          >
            <MenuItem className="w-fit shrink-0" value="setting">
              AI Setting
            </MenuItem>
            <MenuItem className="w-fit shrink-0" value="usage">
              AI Usage
            </MenuItem>
            <MenuItem className="w-fit shrink-0" value="field-template">
              AI Field Template
            </MenuItem>
          </Menu>
        )}
        {subMenu === 'setting' && <AISettingForm projectId={projectId} />}
        {subMenu === 'usage' && <AIUsageForm />}
        {subMenu === 'field-template' && (
          <AIFieldTemplate onClick={() => setSubMenu('field-template-form')} />
        )}
        {subMenu === 'field-template-form' && <AIFieldTemplateForm />}
        {subMenu === 'issue-recommend' && <AIIssueRecommendForm />}
      </SettingTemplate>
    </>
  );
};

type AIForm = {
  isPending: boolean;
  formId: string;
  setIsPending: (isPending: boolean) => void;
  formState?: FormState<Record<string, unknown>>;
  setFormState: (formState: FormState<Record<string, unknown>>) => void;
};

const useAISettingFormStore = create<AIForm>((set) => ({
  isPending: false,
  formId: 'ai-setting-form',
  setIsPending: (isPending) => set({ isPending }),
  setFormState: (formState) => set({ formState }),
}));

const AISettingForm = ({ projectId }: { projectId: number }) => {
  const methods = useForm<AI>();
  const { setIsPending, formId } = useAISettingFormStore();

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

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending]);

  return (
    <>
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.api-key" />}
      />
      <FormProvider {...methods}>
        <form
          id={formId}
          onSubmit={methods.handleSubmit((data) => {
            mutate(data);
          })}
        >
          <AiSettingForm />
        </form>
      </FormProvider>
    </>
  );
};

const AISettingFormButton = () => {
  const { formId, isPending, formState } = useAISettingFormStore();
  return (
    <Button
      form={formId}
      type="submit"
      disabled={!formState?.isDirty}
      loading={isPending}
    >
      저장
    </Button>
  );
};

const useAIUseageFormStore = create<AIForm>((set) => ({
  isPending: false,
  formId: 'ai-usage-form',
  setIsPending: (isPending) => set({ isPending }),
  setFormState: (formState) => set({ formState }),
}));

const chartData = { data: 0.1, fill: '#38BDF8' };
const AIUsageForm = () => {
  return (
    <>
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.api-key" />}
      />
      <div className="flex gap-4">
        <div className="flex-[2]">
          <SimpleLineChart
            dataKeys={[
              { name: 'Total', color: '#4A90E2' },
              { name: 'AI Field', color: '#50E3C2' },
              { name: 'AI Issue', color: '#F5A623' },
            ]}
            title="사용 토큰량"
            data={[
              {
                name: '2024-01-01',
                Total: 1000,
                'AI Field': 800,
                'AI Issue': 200,
              },
              {
                name: '2024-01-02',
                Total: 1200,
                'AI Field': 900,
                'AI Issue': 300,
              },
              {
                name: '2024-01-03',
                Total: 1500,
                'AI Field': 1000,
                'AI Issue': 500,
              },
            ]}
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
                className="last:fill-neutral-inverse first:fill-[var(--bg-neutral-tertiary)]"
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
                <div>{(900000).toLocaleString()}</div>
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
      </div>
      <div className="flex gap-4">
        <Card className="min-h-30 flex-[1]" size="md">
          <CardHeader action={<Switch />}>
            <CardTitle>Token Threshold</CardTitle>
            <CardDescription>
              토큰 사용량 상한을 설정하여 AI 기능에 대한 사용량을 제어할 수
              있습니다.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <TextInput />
          </CardBody>
        </Card>
        <Card className="min-h-30 flex-[1]" size="md">
          <CardHeader action={<Switch />}>
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

const AIUsageFormButton = () => {
  const { formId, isPending, formState } = useAIUseageFormStore();
  return (
    <Button
      form={formId}
      type="submit"
      disabled={!formState?.isDirty}
      loading={isPending}
    >
      저장
    </Button>
  );
};

const AIFieldTemplate = ({ onClick }: { onClick: () => void }) => {
  return (
    <>
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.api-key" />}
      />
      <div className="grid grid-cols-4 gap-4">
        <TemplateCard type="create" title="New Template" />
        <TemplateCard
          type="update"
          title="Feedback Summary"
          description="Temperature(온도)는 모델의 응답 창의성과 다양성을 조정하는
              매개변수입니다. Precise(정밀)에 가까울수록 응답이 더 구체적이고
              정확해지며, Creative(창의적)에 가까울수록 더 자유롭고 다양한
              응답을 얻을 수 있습니다."
          onClick={onClick}
        />
        <TemplateCard
          type="update"
          title="Feedback Sentiment Analysis"
          description="Temperature(온도)는 모델의 응답 창의성과 다양성을 조정하는
              매개변수입니다. Precise(정밀)에 가까울수록 응답이 더 구체적이고
              정확해지며, Creative(창의적)에 가까울수록 더 자유롭고 다양한
              응답을 얻을 수 있습니다."
          onClick={onClick}
        />
        <TemplateCard
          type="update"
          title="Feedback Translation"
          description="Temperature(온도)는 모델의 응답 창의성과 다양성을 조정하는
              매개변수입니다. Precise(정밀)에 가까울수록 응답이 더 구체적이고
              정확해지며, Creative(창의적)에 가까울수록 더 자유롭고 다양한
              응답을 얻을 수 있습니다."
          onClick={onClick}
        />
        <TemplateCard
          type="update"
          title="Feedback Keyword Extraction"
          description="Temperature(온도)는 모델의 응답 창의성과 다양성을 조정하는
              매개변수입니다. Precise(정밀)에 가까울수록 응답이 더 구체적이고
              정확해지며, Creative(창의적)에 가까울수록 더 자유롭고 다양한
              응답을 얻을 수 있습니다."
          onClick={onClick}
        />
      </div>
    </>
  );
};

const TemplateCard = (props: {
  title: string;
  description?: string;
  type: 'create' | 'update';
  onClick?: () => void;
}) => {
  const { title, description, type, onClick } = props;
  return (
    <Card
      onClick={onClick}
      className="min-h-60 cursor-pointer hover:opacity-50"
    >
      <CardBody className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-1">
          {type === 'create' && <Icon name="RiAddCircleFill" />}
          {type === 'update' && <StarIcon />}
          <h4 className="text-title-h4">{title}</h4>
        </div>
        {description && (
          <div>
            <p className="text-small-normal">Prompt Preview</p>
            <div className="bg-neutral-tertiary rounded-12 p-3">
              <p className="text-small-normal line-clamp-2">{description}</p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const StarIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.1973 14.5996C18.4547 16.2456 19.7544 17.5453 21.4004 17.8027V18.1963C19.7543 18.4537 18.4547 19.7543 18.1973 21.4004H17.8027C17.5453 19.7543 16.2457 18.4537 14.5996 18.1963V17.8027C16.2456 17.5453 17.5453 16.2456 17.8027 14.5996H18.1973ZM8.42773 5.59961C8.71293 8.76612 11.2339 11.286 14.4004 11.5713V12.4277C11.2339 12.7129 8.71294 15.2339 8.42773 18.4004H7.57227C7.28706 15.2339 4.76614 12.7129 1.59961 12.4277V11.5713C4.7661 11.2861 7.28707 8.76612 7.57227 5.59961H8.42773ZM17.0225 2.59961C17.2621 3.79603 18.204 4.73793 19.4004 4.97754V5.02148C18.2039 5.26103 17.2621 6.2039 17.0225 7.40039H16.9775C16.7379 6.2039 15.7961 5.26103 14.5996 5.02148V4.97754C15.796 4.73793 16.7379 3.79603 16.9775 2.59961H17.0225Z"
        fill="url(#paint0_linear_12816_270031)"
        stroke="url(#paint1_linear_12816_270031)"
        stroke-width="1.2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_12816_270031"
          x1="11.5"
          y1="2"
          x2="11.5"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2DD4BF" />
          <stop offset="1" stop-color="#0EA5E9" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_12816_270031"
          x1="11.5"
          y1="2"
          x2="11.5"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2DD4BF" />
          <stop offset="1" stop-color="#0EA5E9" />
        </linearGradient>
      </defs>
    </svg>
  );
};

type InputItem = {
  title: string;
  description: string;
  value: string;
};

const AIPlaygroundContext = React.createContext<{
  inputItems: InputItem[];
  createInputItem: (item: InputItem) => void;
  updateInputItem: (index: number, item: InputItem) => void;
  deleteInputItem: (index: number) => void;
}>({
  inputItems: [],
  createInputItem: () => 0,
  updateInputItem: () => 0,
  deleteInputItem: () => 0,
});

const AIFieldTemplateForm = () => {
  const [inputItems, setInputItems] = useState<InputItem[]>([]);

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <Card className="flex-[1] border" size="md">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            템플릿 정보와 프롬프트를 설정해주세요
          </CardDescription>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <TextInput label="Title" />
          <InputField>
            <InputLabel>Prompt</InputLabel>
            <Textarea />
          </InputField>
          <Card size="sm">
            <CardHeader action={<Switch checked={true} />}>
              <CardTitle>Auto Processing</CardTitle>
              <CardDescription>
                자동으로 AI Prompt를 적용합니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </CardBody>
      </Card>
      <AIPlaygroundContext.Provider
        value={{
          inputItems,
          createInputItem: (item) => setInputItems((prev) => [...prev, item]),
          updateInputItem: (index, item) =>
            setInputItems((prev) => {
              const newData = [...prev];
              newData[index] = item;
              return newData;
            }),
          deleteInputItem: (index) =>
            setInputItems((prev) => {
              const newData = [...prev];
              newData.splice(index, 1);
              return newData;
            }),
        }}
      >
        <Card
          className="last-of-type: flex h-full flex-[2] flex-col border"
          size="md"
        >
          <CardHeader>
            <CardTitle>Playground</CardTitle>
            <CardDescription>
              테스트 데이터와 템플릿 가지고 AI 결과를 미리 확인해 보세요.
            </CardDescription>
          </CardHeader>
          <CardBody className="flex min-h-0 flex-1 flex-col gap-4">
            <Card size="sm" className="flex min-h-0 flex-[2] flex-col">
              <CardHeader
                action={
                  <Button
                    variant="outline"
                    onClick={() =>
                      setInputItems((prev) => [
                        ...prev,
                        { title: '', description: '', value: '' },
                      ])
                    }
                  >
                    <Icon name="RiAddLine" />
                    테스트 케이스 추가
                  </Button>
                }
              >
                <CardTitle>Input Data</CardTitle>
              </CardHeader>
              <CardBody className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
                {inputItems.map((_, key) => (
                  <AIPlaygroundInputDataItem key={key} index={key} />
                ))}
              </CardBody>
            </Card>
            <Card size="sm" className="flex-[1]">
              <CardHeader
                action={
                  <Button variant="outline">
                    <Icon name="RiSparklingFill" />
                    AI 테스트
                  </Button>
                }
              >
                <CardTitle>Output</CardTitle>
              </CardHeader>
            </Card>
          </CardBody>
        </Card>
      </AIPlaygroundContext.Provider>
    </div>
  );
};

const AIPlaygroundInputDataItem = ({ index }: { index: number }) => {
  const { inputItems, updateInputItem, deleteInputItem } =
    React.useContext(AIPlaygroundContext);
  const [isEditing, setIsEditing] = useState(true);
  const data = inputItems[index];

  if (!data) return;

  if (isEditing) {
    return (
      <AIPlaygroundInputDataItemForm
        initialValues={data}
        onClose={() => {
          if (data.title === '') {
            deleteInputItem(index);
          }
          setIsEditing(false);
        }}
        onSubmit={(data) => {
          updateInputItem(index, data);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <Card size="sm">
      <CardHeader
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Icon name="RiEditBoxLine" />
            </Button>
            <Button onClick={() => deleteInputItem(index)} variant="outline">
              <Icon name="RiDeleteBinLine" />
            </Button>
          </div>
        }
      >
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardBody>
        <div className="bg-neutral-tertiary rounded-8 max-h-16 overflow-auto p-3">
          <p className="text-small-normal text-neutral-secondary">
            {data.value}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

const AIPlaygroundInputDataItemForm = ({
  onSubmit,
  onClose,
  initialValues,
}: {
  onSubmit: (input: InputItem) => void;
  onClose: () => void;
  initialValues?: InputItem;
}) => {
  const { register, handleSubmit, reset } = useForm<InputItem>({
    defaultValues: initialValues ?? { title: '', description: '', value: '' },
  });

  return (
    <Card size="sm">
      <CardBody>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
          <TextInput label="Field Title" {...register('title')} />
          <TextInput label="Field Description" {...register('description')} />
          <TextInput label="Field Value" {...register('value')} />
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

const AIIssueRecommendForm = () => {
  return <>AIFieldTemplateForm</>;
};

export default GenerativeAiSetting;
