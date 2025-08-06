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
import { useState } from 'react';

import { Icon, ToggleGroup, ToggleGroupItem } from '@ufb/react';

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@/shared';

import { AIPlaygroundContextProvider } from '../contexts/ai-playground-context';
import type { PlaygroundInputItem } from '../playground-input-item.schema';
import PlaygroundInputCard from './playground-input-card.ui';
import PlaygroundOutputCard from './playground-output-card.ui';

interface Props {
  onTestAI: (inputItems: PlaygroundInputItem[]) => void;
  result?: string | string[];
  isPending: boolean;
  isDisabled: boolean;
  description?: string;
}

const AiPlaygroundTemplate = (props: Props) => {
  const { onTestAI, result, isPending, isDisabled, description } = props;
  const [viewType, setViewType] = useState<'vertical' | 'horizontal'>(
    'vertical',
  );

  return (
    <AIPlaygroundContextProvider>
      <Card
        size="lg"
        className="last-of-type: flex h-full flex-[2] flex-col border"
      >
        <CardHeader
          action={
            <ToggleGroup
              type="single"
              value={viewType}
              onValueChange={(v) => setViewType(v as 'vertical' | 'horizontal')}
              className="flex-shrink-0"
            >
              <ToggleGroupItem value="vertical">
                <Icon name="RiFlipVerticalLine" />
                Horizontal View
              </ToggleGroupItem>
              <ToggleGroupItem value="horizontal">
                <Icon name="RiFlipHorizontalLine" />
                Vertical View
              </ToggleGroupItem>
            </ToggleGroup>
          }
        >
          <CardTitle>Playground</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardBody
          className={cn('flex min-h-0 flex-1 gap-4', {
            'flex-col': viewType === 'vertical',
            'flex-row': viewType === 'horizontal',
          })}
        >
          <PlaygroundInputCard />
          <PlaygroundOutputCard
            result={result}
            onTestAI={onTestAI}
            isPending={isPending}
            isDisabled={isDisabled}
          />
        </CardBody>
      </Card>
    </AIPlaygroundContextProvider>
  );
};

export default AiPlaygroundTemplate;
