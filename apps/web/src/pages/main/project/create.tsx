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
import type { GetStaticProps, NextPage } from 'next';
import { useOverlay } from '@toss/use-overlay';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@ufb/react';

import { DEFAULT_LOCALE, useOAIQuery } from '@/shared';
import { CreateProject } from '@/features/create-project';

const CreateProjectPage: NextPage = () => {
  const { t } = useTranslation();
  const overlay = useOverlay();

  const { data } = useOAIQuery({
    path: '/api/admin/projects',
    variables: { limit: 0 },
    queryOptions: { retry: false },
  });
  const openWarningNoProjects = () => {
    overlay.open(({ close, isOpen }) => (
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent>
          <DialogTitle>
            {t('v2.dialog.no-project-in-project-creation-page.title')}
          </DialogTitle>
          <DialogBody className="flex flex-col items-center gap-2">
            <img src="/assets/images/no-projects-in-project-creation-page.png" />
            <p>
              {t('v2.dialog.no-project-in-project-creation-page.description')}
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogClose variant="primary">
              {t('v2.button.confirm')}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ));
  };

  useEffect(() => {
    if (!data || data.meta.totalItems > 0) return;
    openWarningNoProjects();
  }, [data]);

  return <CreateProject />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default CreateProjectPage;
