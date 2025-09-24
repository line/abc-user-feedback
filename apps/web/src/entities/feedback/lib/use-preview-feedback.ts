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
import { useMemo } from 'react';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

import { ISSUES } from '@/shared';
import type { Category } from '@/entities/category';
import type { FieldInfo } from '@/entities/field';
import type { Issue } from '@/entities/issue';

import type { Feedback } from '../feedback.type';

const usePreviewFeedback = (fields: FieldInfo[]) => {
  const { t } = useTranslation();
  const feedbacks = useMemo(() => {
    const feedbacks: Feedback[] = [];
    const categories: Category[] = new Array(5).fill(0).map((_, i) => ({
      id: i,
      name: faker.word.sample(),
    }));
    const issues: Issue[] = faker.helpers
      .uniqueArray(() => faker.word.sample(), 10)
      .map((v) => ({
        id: faker.number.int(),
        createdAt: faker.date.recent().toString(),
        description: faker.lorem.sentence(),
        feedbackCount: faker.number.int(),
        updatedAt: faker.date.recent().toString(),
        name: v,
        status: faker.helpers.arrayElement(ISSUES(t).map((v) => v.key)),
        category: faker.helpers.arrayElement(categories),
      }));

    for (let i = 1; i <= 10; i++) {
      const fakeData: Feedback = {
        id: i,
        createdAt: dayjs().add(i, 'hour').toString(),
        updatedAt: dayjs().add(i, 'hour').toString(),
        issues: faker.helpers.arrayElements(issues, {
          min: 0,
          max: 4,
        }),
      };
      for (const field of fields) {
        if (
          field.key === 'id' ||
          field.key === 'createdAt' ||
          field.key === 'updatedAt' ||
          field.key === 'issues'
        ) {
          continue;
        }
        fakeData[field.key] =
          field.format === 'date' ? faker.date.anytime()
          : field.format === 'keyword' ? faker.word.noun()
          : field.format === 'multiSelect' ?
            faker.helpers.arrayElements(
              (field.options ?? []).map((v) => v.name),
            )
          : field.format === 'select' ?
            (field.options ?? []).length > 0 ?
              faker.helpers.arrayElement(
                (field.options ?? []).map((v) => v.name),
              )
            : undefined
          : field.format === 'number' ? faker.number.int()
          : field.format === 'text' ? faker.lorem.text()
          : field.format === 'aiField' ?
            {
              status: 'success',
              message: 'The AI response results will be displayed here.',
            }
          : faker.helpers.arrayElements(
              Array.from({
                length: 15,
              }).fill('/assets/images/sample_image.png'),
            );
      }

      feedbacks.push(fakeData);
    }
    return feedbacks;
  }, [fields]);
  return feedbacks;
};

export default usePreviewFeedback;
