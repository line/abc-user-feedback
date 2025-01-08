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

import { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Divider,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@ufb/react';

import { SheetDetailTable } from '@/shared';
import type { SheetDetailTableRow } from '@/shared/ui/sheet-detail-table.ui';
import type { FieldInfo } from '@/entities/field';
import { DEFAULT_FIELD_KEYS } from '@/entities/field/field.constant';

import type { Feedback } from '../feedback.type';

interface Props {
  isOpen: boolean;
  close: () => void;
  fields: FieldInfo[];
  feedback: Feedback;
  onClickDelete?: () => void;
  updateFeedback?: (feedback: Feedback) => void;
}

const FeedbackDetailSheet = (props: Props) => {
  const { close, feedback, fields, isOpen, onClickDelete, updateFeedback } =
    props;
  const { t } = useTranslation();

  const [currentFeedback, setCurrentFeedback] = useState(feedback);
  const [mode, setMode] = useState<'edit' | 'view'>('view');
  const onClickCancel = () => {
    setMode('view');
    setCurrentFeedback(feedback);
  };
  const onClickSubmit = () => {
    const editedFeedback = fields.reduce((acc, cur) => {
      if (cur.key === 'issues') return acc;
      if (
        typeof currentFeedback[cur.key] === 'undefined' ||
        currentFeedback[cur.key] === null
      ) {
        return acc;
      }
      if (cur.property === 'EDITABLE') {
        if (cur.format === 'number') {
          return {
            ...acc,
            [cur.key]: Number(currentFeedback[cur.key]),
          };
        }
        if (cur.format === 'date') {
          return {
            ...acc,
            [cur.key]: dayjs(currentFeedback[cur.key] as string).toISOString(),
          };
        }
        return { ...acc, [cur.key]: currentFeedback[cur.key] };
      }
      return acc;
    }, {} as Feedback);
    updateFeedback?.(editedFeedback);
    setMode('edit');
  };

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="max-w-[600px]">
        <SheetHeader>
          <SheetTitle>
            {t('v2.text.name.detail', { name: 'Feedback' })}
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
                  : v,
                ) as SheetDetailTableRow[]
            }
          />
          <Divider variant="subtle" className="my-4" />
          <SheetDetailTable
            rows={
              fields.filter(
                (v) => !DEFAULT_FIELD_KEYS.includes(v.key),
              ) as SheetDetailTableRow[]
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
              <Button variant="destructive" onClick={onClickDelete}>
                {t('v2.button.delete')}
              </Button>
            </div>
          )}
          {mode === 'edit' && (
            <>
              <Button variant="secondary" onClick={onClickCancel}>
                {t('v2.button.cancel')}
              </Button>
              <Button onClick={onClickSubmit}>{t('v2.button.save')}</Button>
            </>
          )}
          {mode === 'view' && (
            <>
              <SheetClose>{t('v2.button.cancel')}</SheetClose>
              <Button onClick={() => setMode('edit')}>편집</Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FeedbackDetailSheet;
