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
import { useTranslation } from 'next-i18next';

import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Divider,
  Icon,
  toast,
  ToggleGroup,
  ToggleGroupItem,
} from '@ufb/react';

import {
  SettingAlert,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useWarnIfUnsavedChanges,
} from '@/shared';
import type { FieldInfo } from '@/entities/field';
import {
  FeedbackRequestCodePopover,
  FieldSettingSheet,
  FieldTable,
  PreviewFieldTable,
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

  const { mutateAsync, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/fields',
    pathParams: { channelId, projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        toast.success(t('v2.toast.success'));
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  const isDirty = useMemo(
    () =>
      !(data ?
        objectsEqual(
          data.fields.sort((a, b) => a.order - b.order),
          fields,
        )
      : true),
    [data, fields],
  );

  useWarnIfUnsavedChanges(isDirty);

  useEffect(() => {
    setFields(data?.fields ?? []);
  }, [data]);

  const saveFields = async () => {
    await mutateAsync({ fields });
  };

  const addField = (input: FieldInfo) => {
    setFields((v) => v.concat({ ...input, order: v.length }));
  };

  const updateField = (input: { index: number; field: FieldInfo }) => {
    setFields((prev) =>
      prev.map((v, i) => (i === input.index ? input.field : v)),
    );
  };

  const deleteField = ({ index }: { index: number }) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const openCreateFieldFormSheet = () => {
    overlay.open(({ close, isOpen }) => (
      <FieldSettingSheet
        isOpen={isOpen}
        close={close}
        onSubmit={addField}
        fieldRows={fields}
        disabledUpdate={!perms.includes('channel_field_update')}
      />
    ));
  };
  const openUpdateFieldFormSheet = (input: {
    index: number;
    field: FieldInfo;
  }) => {
    overlay.open(({ close, isOpen }) => (
      <FieldSettingSheet
        isOpen={isOpen}
        close={close}
        onSubmit={(newField) =>
          updateField({ index: input.index, field: newField })
        }
        fieldRows={fields}
        disabledDelete={!perms.includes('channel_field_update')}
        disabledUpdate={!perms.includes('channel_field_update')}
        data={input.field}
        onClickDelete={() => {
          deleteField({ index: input.index });
          close();
        }}
      />
    ));
  };
  const openSaveFieldDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('modal.save-field.title')}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription>
              {t('modal.save-field.description')}
            </DialogDescription>
          </DialogBody>
          <DialogFooter>
            <DialogClose>{t('v2.button.cancel')}</DialogClose>
            <Button
              loading={isPending}
              onClick={async () => {
                await saveFields();
                close();
              }}
            >
              {t('v2.button.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
                onClick={openCreateFieldFormSheet}
                disabled={!perms.includes('channel_field_update')}
              >
                <Icon name="RiAddLine" />
                {t('v2.button.name.add', { name: 'Field' })}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="item-2"
                onClick={() => setIsPreview(true)}
              >
                <Icon name="RiEyeLine" />
                {t('v2.text.preview')}
              </ToggleGroupItem>
            </ToggleGroup>
            <Divider
              variant="subtle"
              orientation="vertical"
              className="my-2 h-auto"
            />
            <Button
              disabled={!isDirty || !perms.includes('channel_field_update')}
              onClick={openSaveFieldDialog}
            >
              {t('button.save')}
            </Button>
          </>
        )
      }
    >
      {isPreview && <SettingAlert description={t('help-card.field-preview')} />}
      {isPreview ?
        <PreviewFieldTable fields={fields} />
      : <FieldTable
          fields={fields}
          onClickRow={(index, field) =>
            openUpdateFieldFormSheet({ index, field })
          }
          reorder={(data) => setFields(data)}
        />
      }
    </SettingTemplate>
  );
};

export default FieldSetting;
