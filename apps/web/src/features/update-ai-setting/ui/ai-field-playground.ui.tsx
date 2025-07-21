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

import { useTranslation } from 'next-i18next';

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared';

import { AIPlaygroundContextProvider } from '../contexts/ai-playground-context';
import { useAITemplateTest } from '../hooks/use-ai-template-test';
import PlaygroundInputCard from './playground-input-card.ui';
import PlaygroundOutputCard from './playground-output-card.ui';

interface AIPlaygroundProps {
  projectId: number;
}

// Main component
const AiFieldPlayground = ({ projectId }: AIPlaygroundProps) => {
  const { t } = useTranslation();
  const aiTest = useAITemplateTest(projectId);

  return (
    <AIPlaygroundContextProvider>
      <Card
        className="last-of-type: flex h-full flex-[2] flex-col border"
        size="md"
      >
        <CardHeader>
          <CardTitle>Playground</CardTitle>
          <CardDescription>
            {t('v2.description.ai-field-template-playground')}
          </CardDescription>
        </CardHeader>
        <CardBody className="flex min-h-0 flex-1 flex-col gap-4">
          <PlaygroundInputCard />
          <PlaygroundOutputCard
            result={aiTest.result}
            onTestAI={(inputItems) => {
              aiTest.executeTest(inputItems);
            }}
            isPending={aiTest.isPending}
            isDisabled={aiTest.isTestDisabled}
            resultType="text"
          />
        </CardBody>
      </Card>
    </AIPlaygroundContextProvider>
  );
};

export default AiFieldPlayground;
