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

import { useEffect, useState } from 'react';
import { useOverlay } from '@toss/use-overlay';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

import {
  Button,
  Divider,
  Icon,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Tag,
  toast,
} from '@ufb/react';

import {
  DeleteDialog,
  isObjectEqual,
  SheetDetailTable,
  usePermissions,
} from '@/shared';
import type { SheetDetailTableRow } from '@/shared/ui/sheet-detail-table.ui';
import type { FieldInfo } from '@/entities/field';
import { DEFAULT_FIELD_KEYS } from '@/entities/field/field.constant';

import type { Feedback } from '../feedback.type';

interface Props {
  isOpen: boolean;
  close: () => void;
  fields: FieldInfo[];
  feedback: Feedback;
  onClickDelete?: () => Promise<unknown>;
  updateFeedback?: (feedback: Feedback) => Promise<unknown>;
  channelId: number;
  refetchFeedback?: () => Promise<unknown>;
}

const FeedbackDetailSheet = (props: Props) => {
  const {
    close,
    feedback,
    fields,
    isOpen,
    onClickDelete,
    updateFeedback,
    channelId,
    refetchFeedback,
  } = props;
  const { t } = useTranslation();

  const perms = usePermissions();
  const [currentFeedback, setCurrentFeedback] = useState(feedback);
  const [mode, setMode] = useState<'edit' | 'view'>('view');
  const overlay = useOverlay();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setCurrentFeedback(feedback);
  }, [feedback]);

  const onClickCancel = () => {
    setMode('view');
    setCurrentFeedback(feedback);
  };

  const onClickSubmit = async () => {
    const editedFeedback = fields
      .filter((v) => v.property === 'EDITABLE' && v.status === 'ACTIVE')
      .reduce((acc, cur) => {
        if (cur.key === 'issues') return acc;
        if (cur.format === 'date') {
          return {
            ...acc,
            [cur.key]:
              currentFeedback[cur.key] ?
                dayjs(currentFeedback[cur.key] as string).toISOString()
              : null,
          };
        }
        if (cur.format === 'multiSelect') {
          return {
            ...acc,
            [cur.key]: currentFeedback[cur.key] ?? [],
          };
        }
        if (cur.format === 'select') {
          return {
            ...acc,
            [cur.key]: currentFeedback[cur.key] ?? null,
          };
        }
        return { ...acc, [cur.key]: currentFeedback[cur.key] };
      }, {} as Feedback);

    try {
      await updateFeedback?.(editedFeedback);
    } finally {
      setIsLoading(false);
      setMode('view');
    }
  };

  const openDeleteDialog = () => {
    overlay.open(({ close: dialogClose, isOpen }) => (
      <DeleteDialog
        close={dialogClose}
        isOpen={isOpen}
        onClickDelete={async () => {
          await onClickDelete?.();
          dialogClose();
          close();
        }}
      />
    ));
  };

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="max-w-[800px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {t('v2.text.name.detail', { name: 'Feedback' })}
            <Tag
              variant="outline"
              size="small"
              className="cursor-pointer"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/${window.location.pathname}?queries=${JSON.stringify([{ key: 'id', value: feedback.id, condition: 'IS' }])}&channelId=${channelId}`,
                );
                toast(t('v2.toast.copy'), {
                  icon: <Icon name="RiCheckboxMultipleFill" />,
                });
              }}
            >
              Copy URL
            </Tag>
          </SheetTitle>
        </SheetHeader>
        <SheetBody>
          <SheetDetailTable
            data={currentFeedback}
            rows={
              fields
                .filter((v) => DEFAULT_FIELD_KEYS.includes(v.key))
                .map((v) =>
                  v.key === 'issues' ?
                    { ...v, format: 'issue', feedbackId: feedback.id }
                  : v.format === 'aiField' ?
                    { ...v, format: 'aiField', refetch: refetchFeedback }
                  : v,
                ) as SheetDetailTableRow[]
            }
          />
          <Divider variant="subtle" className="my-4" />
          <SheetDetailTable
            rows={
              fields
                .filter((v) => !DEFAULT_FIELD_KEYS.includes(v.key))
                .map((v) => ({
                  ...v,
                  editable: v.property === 'EDITABLE',
                  disabled:
                    v.property === 'EDITABLE' && v.status === 'INACTIVE',
                  refetch: v.format === 'aiField' ? refetchFeedback : undefined,
                })) as SheetDetailTableRow[]
            }
            mode={mode}
            data={currentFeedback}
            onChange={(key, value) =>
              setCurrentFeedback((prev) => ({ ...prev, [key]: value }))
            }
          />
        </SheetBody>
        <SheetFooter>
          {onClickDelete && (
            <div className="flex-1">
              <Button
                variant="destructive"
                onClick={openDeleteDialog}
                disabled={!perms.includes('feedback_delete')}
              >
                {t('v2.button.delete')}
              </Button>
            </div>
          )}
          {mode === 'edit' && (
            <>
              <Button variant="secondary" onClick={onClickCancel}>
                {t('v2.button.cancel')}
              </Button>
              <Button
                disabled={isObjectEqual(
                  { ...feedback, updatedAt: '' },
                  { ...currentFeedback, updatedAt: '' },
                )}
                onClick={onClickSubmit}
                loading={isLoading}
              >
                {t('v2.button.save')}
              </Button>
            </>
          )}
          {mode === 'view' && (
            <>
              <SheetClose>{t('v2.button.cancel')}</SheetClose>
              <Button
                onClick={() => setMode('edit')}
                disabled={!perms.includes('feedback_update')}
              >
                {t('v2.button.edit')}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FeedbackDetailSheet;
