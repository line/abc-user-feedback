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

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Divider,
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@ufb/react';

import type { Field, FieldInfo } from '@/entities/field';
import { DEFAULT_FIELD_KEYS } from '@/entities/field/field.constant';

import type { Feedback } from '../feedback.type';
import FeedbackDetailTable from './feedback-detail-table.ui';

interface Props {
  isOpen: boolean;
  close: () => void;
  fields: FieldInfo[];
  feedback: Feedback;
}

const FeedbackDetailSheet = (props: Props) => {
  const { close, feedback, fields, isOpen } = props;
  const { t } = useTranslation();
  const rows = useMemo(() => {
    return fields.map((field) => ({ field, value: feedback[field.key] }));
  }, [feedback, fields]);

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="max-w-[600px]">
        <SheetHeader>
          <SheetTitle>
            {t('v2.text.name.detail', { name: 'Feedback' })}
          </SheetTitle>
        </SheetHeader>
        <SheetBody>
          <FeedbackDetailTable
            rows={rows.filter((v) => DEFAULT_FIELD_KEYS.includes(v.field.key))}
          />
          <Divider variant="subtle" className="my-4" />
          <FeedbackDetailTable
            rows={rows.filter((v) => !DEFAULT_FIELD_KEYS.includes(v.field.key))}
          />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};

export default FeedbackDetailSheet;
