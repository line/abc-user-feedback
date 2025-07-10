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

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared';

import { AIPlaygroundContextProvider } from '../contexts/ai-playground-context';
import { useAIIssueTest } from '../hooks/use-ai-issue-test';
import PlaygroundInputCard from './playground-input-card.ui';
import PlaygroundOutputCard from './playground-output-card.ui';

// Main component
const AIIssuePlayground = () => {
  const aiTest = useAIIssueTest();

  return (
    <AIPlaygroundContextProvider>
      <Card
        className="last-of-type: flex h-full flex-[2] flex-col border"
        size="md"
      >
        <CardHeader>
          <CardTitle>Playground</CardTitle>
          <CardDescription>
            테스트 데이터와 템플릿 가지고 AI 결과를 미리 확인해 보세요.
          </CardDescription>
        </CardHeader>
        <CardBody className="flex min-h-0 flex-1 flex-col gap-4">
          <PlaygroundInputCard />
          <PlaygroundOutputCard
            result={aiTest.result}
            onTestAI={(inputItems) => aiTest.executeTest(inputItems)}
            isPending={aiTest.isPending}
            isDisabled={aiTest.isTestDisabled}
            resultType="badges"
          />
        </CardBody>
      </Card>
    </AIPlaygroundContextProvider>
  );
};

export default AIIssuePlayground;
