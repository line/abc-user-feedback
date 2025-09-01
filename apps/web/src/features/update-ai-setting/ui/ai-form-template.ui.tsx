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
import type { UseFormReturn } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';

import { Button, Icon } from '@ufb/react';

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared';

interface Props<T extends Record<string, unknown>>
  extends React.PropsWithChildren {
  methods: UseFormReturn<T>;
  playground?: React.ReactNode;
  description?: string;
}

const AiFormTemplate = <T extends Record<string, unknown>>(props: Props<T>) => {
  const { methods, children, playground, description } = props;
  const [isShrunk, setIsShrunk] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <FormProvider {...methods}>
        {!isShrunk ?
          <Card className="flex-1 overflow-auto border" size="lg">
            <CardHeader
              action={
                <Button
                  variant="outline"
                  onClick={() => setIsShrunk(!isShrunk)}
                >
                  <Icon name="RiExpandLeftFill" />
                </Button>
              }
            >
              <CardTitle>Configuration</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">{children}</CardBody>
          </Card>
        : <Button
            variant="outline"
            onClick={() => setIsShrunk(!isShrunk)}
            className="mb-4"
          >
            <Icon name="RiExpandRightFill" />
          </Button>
        }
        {playground}
      </FormProvider>
    </div>
  );
};

export default AiFormTemplate;
