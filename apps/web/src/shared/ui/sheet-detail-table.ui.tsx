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
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Linkify from 'linkify-react';

import type { IconNameType } from '@ufb/react';
import {
  Badge,
  Icon,
  InputField,
  Tag,
  Textarea,
  TextInput,
  toast,
} from '@ufb/react';

import { AICell } from '@/entities/ai';
import { CategoryCombobox } from '@/entities/category';
import type { Category } from '@/entities/category';
import IssueCell from '@/entities/feedback/ui/issue-cell';

import { DATE_TIME_FORMAT, GRADIENT_CSS } from '../constants';
import type { BadgeColor } from '../constants/color-map';
import { BADGE_COLOR_MAP } from '../constants/color-map';
import { useOAIMutation, usePermissions } from '../lib';
import { cn } from '../utils';
import FeedbackImage from './feedback-image';
import ImagePreviewButton from './image-preview-button';
import {
  DatePicker,
  MultiSelectSearchInput,
  SelectSearchInput,
} from './inputs';

interface PlainRow {
  format: 'text' | 'keyword' | 'number' | 'date' | 'images';
}

interface ImageRow {
  format: 'images';
  editable?: false;
}

interface SelectableRow {
  format: 'select' | 'multiSelect';
  options: { key: string; name: string; color?: BadgeColor }[];
}

interface TicketRow {
  format: 'ticket';
  issueTracker?: { ticketDomain: string | null; ticketKey: string | null };
}

interface IssueRow {
  format: 'issue';
  feedbackId: number;
  editable?: false;
}

interface CategoryRow {
  format: 'cateogry';
  issueId: number;
}
interface AIFieldRow {
  format: 'aiField';
  refetch?: () => Promise<void>;
  status: 'ACTIVE' | 'INACTIVE';
}

export type SheetDetailTableRow = {
  id?: number;
  key: string;
  name: string;
  editable?: boolean;
  disabled?: boolean;
} & (
  | PlainRow
  | SelectableRow
  | TicketRow
  | ImageRow
  | IssueRow
  | CategoryRow
  | AIFieldRow
);

type Format = SheetDetailTableRow['format'];

const FIELD_FORMAT_ICON_MAP: Record<Format, IconNameType> = {
  text: 'RiText',
  keyword: 'RiFontSize',
  number: 'RiHashtag',
  date: 'RiCalendarEventLine',
  select: 'RiCheckboxCircleLine',
  issue: 'RiListCheck',
  multiSelect: 'RiListCheck',
  images: 'RiImageLine',
  ticket: 'RiTicketLine',
  cateogry: 'RiListOrdered2',
  aiField: 'RiSparklingFill',
};

interface Props {
  rows: SheetDetailTableRow[];
  data: Record<string, unknown>;
  mode?: 'view' | 'edit';
  onChange?: (key: string, value: unknown) => void;
}

type RenderFieldMap<T extends SheetDetailTableRow> = Record<
  T['format'],
  (value: unknown, row: T) => React.ReactNode
>;

const SheetDetailTable = (props: Props) => {
  const { rows, data, mode = 'view', onChange } = props;

  const renderViewModeField: RenderFieldMap<SheetDetailTableRow> = {
    text: (value) =>
      value ?
        <Linkify
          options={{
            className: 'text-blue-500 underline',
            target: '_blank',
            rel: 'noopener noreferrer',
          }}
        >
          {String(value)}
        </Linkify>
      : '-',
    keyword: (value) => ((value as string | null) ? (value as string) : '-'),
    number: (value) => (value as string | null) ?? '-',
    date: (value) =>
      value ? dayjs(value as string).format(DATE_TIME_FORMAT) : '-',
    select: (value, row) => {
      const option = (row as SelectableRow).options.find(
        (option) => option.key === value,
      );
      return option ?
          <Badge
            variant={option.color ? 'bold' : 'subtle'}
            className={option.color ? BADGE_COLOR_MAP[option.color] : ''}
          >
            {option.name}
          </Badge>
        : '-';
    },
    multiSelect: (value, row) => (
      <div className="flex flex-wrap gap-2">
        {((value ?? []) as string[]).length === 0 ?
          '-'
        : (value as string[])
            .sort(
              (aKey, bKey) =>
                (row as SelectableRow).options.findIndex(
                  (option) => option.key === aKey,
                ) -
                (row as SelectableRow).options.findIndex(
                  (option) => option.key === bKey,
                ),
            )
            .map((key) => {
              const option = (row as SelectableRow).options.find(
                (option) => option.key === key,
              );
              return (
                <Badge
                  key={option?.key}
                  variant={option?.color ? 'bold' : 'subtle'}
                  className={option?.color ? BADGE_COLOR_MAP[option.color] : ''}
                >
                  {(option?.name ?? value) as string}
                </Badge>
              );
            })
        }
      </div>
    ),
    images: (value) => {
      const urls = value as string[] | undefined;
      if (!urls || urls.length === 0) {
        return '-';
      }
      return (
        <div className="flex flex-wrap gap-2">
          {urls.map((v, index) => (
            <div
              className="bg-neutral-tertiary relative h-16 w-16 overflow-hidden rounded"
              key={index}
            >
              <FeedbackImage url={v} />
              <div className="absolute inset-1/2 flex h-fit w-fit -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                <ImagePreviewButton
                  urls={value as string[]}
                  initialIndex={index}
                >
                  <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#FFFFFF80]">
                    <Icon
                      name="RiEyeFill"
                      size={10}
                      className="cursor-pointer text-white"
                    />
                  </div>
                </ImagePreviewButton>
              </div>
            </div>
          ))}
        </div>
      );
    },
    ticket: (value, row) => {
      const { issueTracker } = row as TicketRow;
      return issueTracker?.ticketDomain && issueTracker.ticketKey && value ?
          <a
            href={`${issueTracker.ticketDomain}/browse/${issueTracker.ticketKey}-${value as string}`}
            target="_blank"
            rel="noreferrer"
            className="text-tint-blue underline"
          >
            {`${issueTracker.ticketKey}-${value as string}`}
          </a>
        : ((value as string | null) ?? '-');
    },
    issue: (_, row) => <IssueCell feedbackId={(row as IssueRow).feedbackId} />,
    cateogry: (value, row) => {
      const category = value as Category | undefined;
      return (
        <div className="flex items-center gap-2">
          {category && <Badge variant="subtle">{category.name}</Badge>}
          <CategoryCombobox
            issueId={(row as CategoryRow).issueId}
            category={category}
          >
            <Tag variant="outline" size="small" className="cursor-pointer">
              {category ? 'Edit' : 'Add'}
            </Tag>
          </CategoryCombobox>
        </div>
      );
    },
    aiField: (value, row) => {
      if (!row.id || row.format !== 'aiField') return <></>;
      return (
        <AISheetDetailCell
          value={
            value as
              | { status: 'loading' | 'success' | 'error'; message: string }
              | undefined
          }
          feedbackId={data.id as number}
          fieldId={row.id}
          refetch={row.refetch}
          showButton={row.status === 'ACTIVE'}
        />
      );
    },
  };

  const renderEditModeField: RenderFieldMap<SheetDetailTableRow> = {
    text: (value, row) => (
      <Textarea
        value={value as string}
        onChange={(e) => onChange?.(row.key, e.currentTarget.value)}
        className="resize-none"
        disabled={row.disabled}
      />
    ),
    keyword: (value, row) => (
      <InputField>
        <TextInput
          value={value as number}
          onChange={(e) => onChange?.(row.key, e.currentTarget.value)}
          disabled={row.disabled}
        />
      </InputField>
    ),
    number: (value, row) => (
      <InputField>
        <TextInput
          value={value as number}
          type="number"
          onChange={(e) => onChange?.(row.key, Number(e.currentTarget.value))}
          disabled={row.disabled}
        />
      </InputField>
    ),
    date: (value, row) => (
      <DatePicker
        value={value as string | undefined | null}
        onChange={(date) => onChange?.(row.key, date ?? null)}
        disabled={row.disabled}
        mode="datetime"
      />
    ),
    select: (value, row) => {
      return (
        <SelectSearchInput
          options={(row as SelectableRow).options.map((option) => ({
            value: option.key,
            label: option.name,
          }))}
          value={(value as string | null) ?? undefined}
          onChange={(key) => onChange?.(row.key, key ?? null)}
          disabled={row.disabled}
        />
      );
    },
    multiSelect: (value, row) => (
      <MultiSelectSearchInput
        options={(row as SelectableRow).options.map((option) => ({
          value: option.key,
          label: option.name,
        }))}
        value={value as string[]}
        onChange={(value) => onChange?.(row.key, value)}
        disabled={row.disabled}
      />
    ),
    ticket: (value, row) => {
      const { issueTracker } = row as TicketRow;
      return (
        <div className="flex items-center gap-2">
          <InputField>
            <TextInput
              disabled
              value={issueTracker?.ticketKey ?? ''}
              className="w-28"
            />
          </InputField>
          <span>-</span>
          <InputField>
            <TextInput
              value={value as string}
              onChange={(e) => onChange?.(row.key, e.currentTarget.value)}
              disabled={row.disabled}
            />
          </InputField>
        </div>
      );
    },
    images: (value, row) => {
      const urls = value as string[] | undefined;
      if (!urls || urls.length === 0) {
        return '-';
      }
      return (
        <div className="flex flex-wrap gap-2">
          {urls.map((v, index) => (
            <div
              className="bg-neutral-tertiary relative h-16 w-16 overflow-hidden rounded"
              key={v}
            >
              <FeedbackImage url={v} />
              <div className="absolute inset-1/2 flex h-fit w-fit -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1">
                <ImagePreviewButton
                  urls={value as string[]}
                  initialIndex={index}
                >
                  <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#FFFFFF80]">
                    <Icon
                      name="RiEyeFill"
                      size={10}
                      className="cursor-pointer text-white"
                    />
                  </div>
                </ImagePreviewButton>
                <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#FFFFFF80]">
                  <Icon
                    name="RiDeleteBinLine"
                    size={10}
                    className="cursor-pointer text-white"
                    onClick={() => {
                      onChange?.(
                        row.key,
                        urls.filter((_, i) => i !== index),
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    },
    issue: () => <></>,
    cateogry: () => <></>,
    aiField: () => <></>,
  };

  return (
    <table className="w-full table-fixed">
      <tbody>
        {rows.map((row) => {
          const { format, key, name } = row;
          const value = data[key];
          return (
            <tr key={key}>
              <th className="text-neutral-tertiary w-1/4 py-2.5 pr-3 text-left align-top font-normal">
                <Icon
                  className="mr-2"
                  name={FIELD_FORMAT_ICON_MAP[format]}
                  size={16}
                />
                <span className="break-words">{name}</span>
              </th>
              <td className="w-3/4 whitespace-pre-wrap break-words py-2.5">
                {mode === 'edit' && row.editable ?
                  renderEditModeField[format](value, row)
                : renderViewModeField[format](value, row)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const AISheetDetailCell = ({
  value,
  feedbackId,
  fieldId,
  refetch,
  showButton,
}: {
  value:
    | { status: 'loading' | 'success' | 'error'; message: string }
    | undefined;
  feedbackId: number;
  fieldId: number;
  refetch?: () => Promise<void>;
  showButton?: boolean;
}) => {
  const router = useRouter();
  const projectId = +(router.query.projectId as string);
  const perms = usePermissions(projectId);

  const { mutateAsync: processAI, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/ai/process/field',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await refetch?.();
      },
    },
  });

  return (
    <div>
      {showButton && (
        <Tag
          size="small"
          style={GRADIENT_CSS.primaryAlt}
          onClick={() => {
            if (!perms.includes('feedback_update')) return;
            if (isPending) return;
            toast.promise(processAI({ feedbackId, aiFieldId: fieldId }), {
              loading: 'Loading',
              success: () => 'Success',
            });
          }}
          className={cn('cursor-pointer', {
            '!opacity-50': isPending || !perms.includes('feedback_update'),
            'cursor-not-allowed': !perms.includes('feedback_update'),
          })}
        >
          <Icon name="RiAiGenerate" />
          Run AI
        </Tag>
      )}
      <div className="py-2">
        <AICell
          value={
            value as
              | { status: 'loading' | 'success' | 'error'; message: string }
              | undefined
          }
          isLoading={isPending}
        />
      </div>
    </div>
  );
};

export default SheetDetailTable;
