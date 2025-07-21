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

import { Badge, Button, Icon } from '@ufb/react';

import { Card, CardBody, CardHeader, CardTitle, GRADIENT_CSS } from '@/shared';

import { useAIPlayground } from '../contexts/ai-playground-context';
import type { PlaygroundInputItem } from '../playground-input-item.schema';

// Loading Component
export const LoadingBars = () => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: 3 }, (_, index) => (
      <div
        key={index}
        className="h-4 w-full animate-pulse rounded"
        style={GRADIENT_CSS.primary}
      />
    ))}
  </div>
);

// Result Display Component
export const ResultBadges = ({ results }: { results: string[] }) => (
  <div className="flex gap-2">
    {results.map((item, index) => (
      <Badge key={index} style={GRADIENT_CSS.primary}>
        {item}
      </Badge>
    ))}
  </div>
);

// Text Result Display Component
export const TextResult = ({ result }: { result: string }) => (
  <div className="bg-neutral-tertiary rounded-8 overflow-auto p-3">
    <p className="text-small-normal text-neutral-secondary">{result}</p>
  </div>
);

interface AIResultSectionProps {
  result?: string | string[];
  onTestAI: (inputItems: PlaygroundInputItem[]) => void;
  isPending: boolean;
  isDisabled: boolean;
  resultType?: 'text' | 'badges';
}

const PlaygroundOutputCard = ({
  result,
  onTestAI,
  isPending,
  isDisabled,
  resultType = 'text',
}: AIResultSectionProps) => {
  const { t } = useTranslation();
  const { inputItems } = useAIPlayground();

  return (
    <Card size="sm" className="flex-[1]">
      <CardHeader
        action={
          <Button
            variant="outline"
            onClick={() => onTestAI(inputItems)}
            loading={isPending}
            disabled={isDisabled || inputItems.length === 0}
          >
            <Icon name="RiSparklingFill" />
            {t('v2.button.process-ai-test')}
          </Button>
        }
      >
        <CardTitle>AI Result (Output)</CardTitle>
      </CardHeader>
      <CardBody>
        {isPending ?
          <LoadingBars />
        : result ?
          resultType === 'badges' && Array.isArray(result) ?
            <ResultBadges results={result} />
          : resultType === 'text' && typeof result === 'string' ?
            <TextResult result={result} />
          : null
        : null}
      </CardBody>
    </Card>
  );
};

export default PlaygroundOutputCard;
