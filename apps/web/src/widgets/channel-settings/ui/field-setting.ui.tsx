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
import { useEffect, useMemo, useState } from 'react';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { Divider, ToggleGroup, ToggleGroupItem } from '@ufb/react';
import { Popover, PopoverModalContent, PopoverTrigger, toast } from '@ufb/ui';

import {
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useWarnIfUnsavedChanges,
} from '@/shared';
import { FeedbackTable, usePreviewFeedback } from '@/entities/feedback';
import type { FieldInfo } from '@/entities/field';
import {
  FeedbackRequestCodePopover,
  FieldSettingPopover,
  FieldTable,
  sortField,
} from '@/entities/field';

const objectsEqual = (
  o1: Record<string, unknown>[],
  o2: Record<string, unknown>[],
) => JSON.stringify(o1) === JSON.stringify(o2);

interface IProps {
  projectId: number;
  channelId: number;
}

const FieldSetting: React.FC<IProps> = (props) => {
  const { projectId, channelId } = props;
  const { t } = useTranslation();
  const perms = usePermissions(projectId);
  const overlay = useOverlay();
  const [isPreview, setIsPreview] = useState(false);

  const [fields, setFields] = useState<FieldInfo[]>([]);

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const { mutateAsync } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/fields',
    pathParams: { channelId, projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  const isDirty = useMemo(
    () => !(data ? objectsEqual(data.fields.sort(sortField), fields) : true),
    [data, fields],
  );
  const feedbacks = usePreviewFeedback(fields);

  useWarnIfUnsavedChanges(isDirty);

  useEffect(() => {
    setFields(data?.fields.sort(sortField) ?? []);
  }, [data]);

  const saveFields = async () => {
    await mutateAsync({ fields });
  };

  const addField = (input: FieldInfo) => {
    setFields((v) => v.concat(input).sort(sortField));
  };

  const updateField = (input: { index: number; field: FieldInfo }) => {
    setFields((prev) =>
      prev.map((v, i) => (i === input.index ? input.field : v)),
    );
  };

  const deleteField = ({ index }: { index: number }) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const openFieldFormSheet = (input?: { index: number; field: FieldInfo }) => {
    overlay.open(({ close, isOpen }) => (
      <FieldSettingPopover
        isOpen={isOpen}
        close={close}
        onSubmit={(newField) =>
          input ?
            updateField({ index: input.index, field: newField })
          : addField(newField)
        }
        fieldRows={fields}
        disabled={!perms.includes('channel_field_update')}
        data={input?.field}
        onClickDelete={
          input ?
            () => {
              deleteField({ index: input.index });
              close();
            }
          : undefined
        }
      />
    ));
  };

  return (
    <SettingTemplate
      title={
        isPreview ?
          t('main.setting.field-mgmt.preview')
        : t('channel-setting-menu.field-mgmt')
      }
      onClickBack={isPreview ? () => setIsPreview(false) : undefined}
      action={
        !isPreview && (
          <>
            <FeedbackRequestCodePopover
              projectId={projectId}
              channelId={channelId}
            />
            <Divider
              variant="subtle"
              orientation="vertical"
              className="my-2 h-auto"
            />
            <ToggleGroup type="single" value="">
              <ToggleGroupItem
                value="item-1"
                onClick={() => openFieldFormSheet()}
                icon="RiAddLine"
              >
                Field 추가
              </ToggleGroupItem>
              <ToggleGroupItem
                value="item-2"
                icon="RiEyeLine"
                onClick={() => setIsPreview(true)}
              >
                미리보기
              </ToggleGroupItem>
            </ToggleGroup>
            <Divider
              variant="subtle"
              orientation="vertical"
              className="my-2 h-auto"
            />
            <SaveFieldPopover
              onClickSave={saveFields}
              disabled={!isDirty || !perms.includes('channel_field_update')}
            />
          </>
        )
      }
    >
      {isPreview ?
        <FeedbackTable feedbacks={feedbacks} fields={fields} />
      : <FieldTable
          fields={fields}
          onClickRow={(index, field) => openFieldFormSheet({ index, field })}
        />
      }
    </SettingTemplate>
  );
};

interface ISaveFieldPopoverProps {
  onClickSave: () => Promise<void>;
  disabled: boolean;
}
const SaveFieldPopover: React.FC<ISaveFieldPopoverProps> = (props) => {
  const { onClickSave, disabled } = props;

  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="btn btn-primary btn-md min-w-[120px]"
          disabled={disabled}
          onClick={() => setIsOpen(true)}
        >
          {t('button.save')}
        </button>
      </PopoverTrigger>
      <PopoverModalContent
        title={t('modal.save-field.title')}
        description={t('modal.save-field.description')}
        submitButton={{
          children: t('button.save'),
          onClick: async () => {
            await onClickSave();
            setIsOpen(false);
          },
        }}
        cancelButton={{
          children: t('button.cancel'),
          onClick: () => setIsOpen(false),
        }}
      />
    </Popover>
  );
};
export default FieldSetting;
