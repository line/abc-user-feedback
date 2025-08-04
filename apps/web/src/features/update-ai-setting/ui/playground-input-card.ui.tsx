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

import React from 'react';
import { useTranslation } from 'next-i18next';

import { Button, Icon } from '@ufb/react';

import { Card, CardBody, CardHeader, CardTitle } from '@/shared';

import { NodataImage } from '@/assets';
import { useAIPlayground } from '../contexts/ai-playground-context';
import { EmptyState } from './empty-state';
import PlaygroundInputData from './playground-input-data';

const PlaygroundInputCard = () => {
  const { t } = useTranslation();
  const { inputItems, addNewEditingItem } = useAIPlayground();

  return (
    <Card className="flex min-h-0 flex-1 flex-col">
      <CardHeader
        action={
          <Button variant="outline" onClick={addNewEditingItem}>
            <Icon name="RiAddLine" />
            {t('v2.button.name.add', { name: 'Data' })}
          </Button>
        }
      >
        <CardTitle>Test Data (Input)</CardTitle>
      </CardHeader>
      <CardBody className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
        {inputItems.length === 0 ?
          <EmptyState
            image={<NodataImage width={120} height={120} />}
            message={t('v2.text.no-data.default')}
          />
        : inputItems.map(({ id }) => <PlaygroundInputData key={id} id={id} />)}
      </CardBody>
    </Card>
  );
};
export default PlaygroundInputCard;
