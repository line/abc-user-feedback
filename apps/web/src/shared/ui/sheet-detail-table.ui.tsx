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
import dayjs from 'dayjs';

import type { Color, IconNameType } from '@ufb/react';
import {
  Badge,
  Calendar,
  Icon,
  InputField,
  Tag,
  Textarea,
  TextInput,
} from '@ufb/react';

import type { Category } from '@/entities/category';
import IssueCell from '@/entities/feedback/ui/issue-cell';

import { DATE_TIME_FORMAT } from '../constants';
import CategoryCombobox from './category-combobox.ui';
import ImagePreviewButton from './image-preview-button';
import { SelectInput } from './inputs';

type PlainRow = {
  format: 'text' | 'keyword' | 'number' | 'date' | 'images';
};

type ImageRow = {
  format: 'images';
  editable?: false;
};

type SelectableRow = {
  format: 'select' | 'multiSelect';
  options: { key: string; name: string; color?: Color }[];
};

type TicketRow = {
  format: 'ticket';
  issueTracker?: { ticketDomain: string | null; ticketKey: string | null };
};
type IssueRow = {
  format: 'issue';
  feedbackId: number;
  editable?: false;
};
type CategoryRow = {
  format: 'cateogry';
  issueId: number;
};

export type SheetDetailTableRow = {
  key: string;
  name: string;
  editable?: boolean;
} & (PlainRow | SelectableRow | TicketRow | ImageRow | IssueRow | CategoryRow);

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
    text: (value) => (value as string | null) ?? '-',
    keyword: (value) => (value as string | null) ?? '-',
    number: (value) => (value as string | null) ?? '-',
    date: (value) => dayjs(value as string).format(DATE_TIME_FORMAT),
    select: (value, row) => {
      const option = (row as SelectableRow).options.find(
        (option) => option.key === value,
      );
      return (
        <Badge variant="subtle" color={option?.color}>
          {option?.name ?? ''}
        </Badge>
      );
    },
    multiSelect: (value, row) => (
      <div className="flex gap-2">
        {(value as string[])
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
              <Badge variant="subtle" color={option?.color}>
                {(option?.name ?? value) as string}
              </Badge>
            );
          })}
      </div>
    ),
    images: (value) => <ImagePreviewButton urls={value as string[]} />,
    ticket: (value, row) => {
      const { issueTracker } = row as TicketRow;
      return issueTracker?.ticketDomain && issueTracker.ticketKey ?
          <a
            href={`${issueTracker.ticketDomain}/browse/${issueTracker.ticketKey}-${value as string}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            {`${issueTracker.ticketKey}-${value as string}`}
          </a>
        : ((value as string | null) ?? '-');
    },
    issue: (_, row) => (
      <IssueCell feedbackId={(row as IssueRow).feedbackId}>
        <Tag variant="secondary" className="cursor-pointer">
          +
        </Tag>
      </IssueCell>
    ),
    cateogry: (value, row) => {
      const category = value as Category | undefined;
      return (
        <div className="flex items-center gap-2">
          {category ?
            <Badge variant="subtle">{category.name}</Badge>
          : ''}
          <CategoryCombobox
            issueId={(row as CategoryRow).issueId}
            category={category}
          >
            <Tag variant="outline" size="small" className="cursor-pointer">
              <Icon name="RiMoreFill" />
            </Tag>
          </CategoryCombobox>
        </div>
      );
    },
  };

  const renderEditModeField: RenderFieldMap<SheetDetailTableRow> = {
    text: (value, row) => (
      <Textarea
        value={value as string}
        onChange={(e) => onChange?.(row.key, e.currentTarget.value)}
      />
    ),
    keyword: (value, row) => (
      <InputField>
        <TextInput
          value={value as number}
          onChange={(e) => onChange?.(row.key, e.currentTarget.value)}
        />
      </InputField>
    ),
    number: (value, row) => (
      <InputField>
        <TextInput
          value={value as number}
          type="number"
          onChange={(e) => onChange?.(row.key, e.currentTarget.value)}
        />
      </InputField>
    ),
    date: (value, row) => (
      <Calendar
        selected={dayjs(value as string).toDate()}
        onDayClick={(date) => onChange?.(row.key, date)}
      />
    ),
    select: (value, row) => {
      return (
        <SelectInput
          options={(row as SelectableRow).options.map((option) => ({
            value: option.key,
            label: option.name,
          }))}
          value={value as string}
          onChange={(value) => onChange?.(row.key, value)}
        />
      );
    },
    multiSelect: (value, row) => (
      <SelectInput
        type="multiple"
        options={(row as SelectableRow).options.map((option) => ({
          value: option.key,
          label: option.name,
        }))}
        values={value as string[]}
        onValuesChange={(value) => onChange?.(row.key, value)}
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
            />
          </InputField>
        </div>
      );
    },
    images: () => <></>,
    issue: () => <></>,
    cateogry: () => <></>,
  };

  return (
    <table>
      <tbody>
        {rows.map((row) => {
          const { format, key, name } = row;
          const value = data[key];
          return (
            <tr>
              <th className="text-neutral-tertiary min-w-[120px] py-2.5 align-top font-normal">
                <div className="flex items-center gap-1">
                  <Icon name={FIELD_FORMAT_ICON_MAP[format]} size={16} />
                  {name}
                </div>
              </th>
              <td className="w-full py-2.5">
                {mode === 'view' &&
                  (typeof value === 'undefined' ? '-' : (
                    renderViewModeField[format](value, row)
                  ))}
                {mode === 'edit' && renderEditModeField[format](value, row)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SheetDetailTable;
