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
import ContentLoader from 'react-content-loader';

import { Badge, Button, Icon } from '@ufb/react';

import { Card, CardBody, CardHeader, CardTitle, GRADIENT_CSS } from '@/shared';

import { useAIPlayground } from '../contexts/ai-playground-context';
import type { PlaygroundInputItem } from '../playground-input-item.schema';

// Loading Component
type LoadingBarsProps = React.ComponentProps<typeof ContentLoader>;
export const LoadingBars = (props: LoadingBarsProps) => (
  <ContentLoader
    speed={3.6}
    width={534}
    height={76}
    viewBox="0 0 534 76"
    backgroundColor="#2a8dcb"
    foregroundColor="#6fecd7"
    {...props}
  >
    <path d="M 0 10 C 0 4.477 4.477 0 10 0 h 514 c 5.523 0 10 4.477 10 10 s -4.477 10 -10 10 H 10 C 4.477 20 0 15.523 0 10 z M 0 38 c 0 -5.523 4.477 -10 10 -10 h 376 c 5.523 0 10 4.477 10 10 s -4.477 10 -10 10 H 10 C 4.477 48 0 43.523 0 38 z M 0 66 c 0 -5.523 4.477 -10 10 -10 h 452 c 5.523 0 10 4.477 10 10 s -4.477 10 -10 10 H 10 C 4.477 76 0 71.523 0 66 z" />{' '}
  </ContentLoader>
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
}

const PlaygroundOutputCard = ({
  result,
  onTestAI,
  isPending,
  isDisabled,
}: AIResultSectionProps) => {
  const { t } = useTranslation();
  const { inputItems } = useAIPlayground();

  return (
    <Card className="flex-1">
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
          Array.isArray(result) ?
            <ResultBadges results={result} />
          : typeof result === 'string' ?
            <TextResult result={result} />
          : null
        : null}
      </CardBody>
    </Card>
  );
};

export default PlaygroundOutputCard;
