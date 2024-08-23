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
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@ufb/react';

import { useOAIQuery } from '@/shared';

import { webhookInfoSchema } from '../webhook.schema';
import type { WebhookInfo } from '../webhook.type';
import WebhookForm from './webhook-form.ui';

const defaultValues: WebhookInfo = {
  name: '',
  status: 'ACTIVE',
  url: '',
  token: null,
  events: [
    { type: 'FEEDBACK_CREATION', channelIds: [], status: 'INACTIVE' },
    { type: 'ISSUE_ADDITION', channelIds: [], status: 'INACTIVE' },
    { type: 'ISSUE_STATUS_CHANGE', channelIds: [], status: 'INACTIVE' },
    { type: 'ISSUE_CREATION', channelIds: [], status: 'INACTIVE' },
  ],
};

interface IProps {
  disabled?: boolean;
  projectId: number;
  onClickCreate: (input: WebhookInfo) => unknown;
  isOpen: boolean;
  close: () => void;
}

const CreateWebhookSheet: React.FC<IProps> = (props) => {
  const { projectId, onClickCreate, isOpen, close } = props;

  const { t } = useTranslation();

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const methods = useForm<WebhookInfo>({
    resolver: zodResolver(webhookInfoSchema),
    defaultValues,
  });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [isOpen]);

  const onSubmit = async (data: WebhookInfo) => {
    await onClickCreate({ ...data, status: 'ACTIVE' });
    close();
  };

  return (
    <Sheet onOpenChange={close} open={isOpen} modal>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('dialog.create-webhook.title')}</SheetTitle>
        </SheetHeader>
        <SheetBody>
          <form id="webhook" onSubmit={methods.handleSubmit(onSubmit)}>
            <FormProvider {...methods}>
              <WebhookForm channels={data?.items ?? []} />
            </FormProvider>
          </form>
        </SheetBody>
        <SheetFooter>
          <SheetClose />
          <Button type={'submit'} form={'webhook'}>
            {t('button.confirm')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateWebhookSheet;
